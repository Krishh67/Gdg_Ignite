from flask import Flask, render_template, request, redirect, url_for, jsonify, send_from_directory
from flask_socketio import SocketIO, emit, join_room, leave_room
import threading
import time
import json
import os

app = Flask(__name__)
socketio = SocketIO(app, async_mode="threading", cors_allowed_origins="*", logger=True, engineio_logger=True)

# In-memory data storage (replaces Google Sheets polling)
active_games_lock = threading.Lock()
active_games = set()
game_data = {}  # Store game data received from Apps Script
sheet_names = []  # Store available sheet names

def get_game_data(game_name):
    """Get game data from in-memory storage"""
    return game_data.get(game_name, {
        "game": game_name,
        "team1_balance": "0",
        "team2_balance": "0", 
        "team1_tickets": "0",
        "team2_tickets": "0",
    })

# Webhook endpoint to receive data from Apps Script
@app.route('/webhook/update_game', methods=['POST'])
def update_game_webhook():
    """Receive game data updates from Google Apps Script"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data received"}), 400
        
        game_name = data.get('game')
        if not game_name:
            return jsonify({"error": "Game name required"}), 400
        
        # Store the updated data
        game_data[game_name] = {
            "game": game_name,
            "team1_balance": str(data.get('team1_balance', '0')),
            "team2_balance": str(data.get('team2_balance', '0')),
            "team1_tickets": str(data.get('team1_tickets', '0')),
            "team2_tickets": str(data.get('team2_tickets', '0')),
        }
        
        # Emit update to connected clients
        with active_games_lock:
            if game_name in active_games:
                socketio.emit("score_update", game_data[game_name], to=game_name)
        
        return jsonify({"status": "success", "message": f"Game {game_name} updated"})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Webhook endpoint to receive sheet names from Apps Script
@app.route('/webhook/update_sheets', methods=['POST'])
def update_sheets_webhook():
    """Receive available sheet names from Google Apps Script"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data received"}), 400
        
        global sheet_names
        sheet_names = data.get('sheet_names', [])
        
        return jsonify({"status": "success", "message": f"Updated {len(sheet_names)} sheet names"})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/")
def index():
    return render_template("index.html")

# Route to serve MP3 files
@app.route('/audio/<filename>')
def serve_audio(filename):
    return send_from_directory('static/audio', filename)

@app.route("/select_game", methods=["GET", "POST"])
def select_game():
    if request.method == "POST":
        game_name = request.form["game"]
        return redirect(url_for("scoreboard", game=game_name))
    # Use sheet names from Apps Script
    return render_template("select_game.html", sheet_names=sheet_names)

@app.route("/scoreboard/<game>")
def scoreboard(game):
    try:
        # Get current game data from in-memory storage
        data = get_game_data(game)
        return render_template("scoreboard.html",
                               game=game,
                               team1_balance=data["team1_balance"],
                               team2_balance=data["team2_balance"],
                               team1_tickets=data["team1_tickets"],
                               team2_tickets=data["team2_tickets"]) 
    except Exception as e:
        return f"Error: {str(e)}"


@socketio.on("join_game")
def on_join_game(data):
    game = data.get("game")
    if not game:
        emit("score_error", {"error": "Missing game name"})
        return
    join_room(game)
    with active_games_lock:
        active_games.add(game)
    # On join, send the latest snapshot immediately
    snapshot = get_game_data(game)
    emit("score_update", snapshot)


@socketio.on("leave_game")
def on_leave_game(data):
    game = data.get("game")
    if not game:
        return
    leave_room(game)
    # If no clients remain in the room, optionally remove from active set
    # Flask-SocketIO does not expose room population directly here; keep active to avoid churn


@socketio.on("connect")
def on_connect():
    print("Client connected")

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    socketio.run(app, host="0.0.0.0", port=port, debug=False, use_reloader=False, allow_unsafe_werkzeug=True)
