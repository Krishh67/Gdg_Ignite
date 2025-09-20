#!/usr/bin/env python3
"""
Test script for CodeChella Carnival webhook endpoints
Run this to test if your Flask app is receiving data correctly
"""

import requests
import json
import time

# Configuration - Update these URLs
FLASK_APP_URL = "http://localhost:5000"  # Change to your deployed URL

def test_sheet_names_webhook():
    """Test the sheet names webhook endpoint"""
    print("Testing sheet names webhook...")
    
    url = f"{FLASK_APP_URL}/webhook/update_sheets"
    payload = {
        "sheet_names": ["Game1", "Game2", "Game3", "TestGame"]
    }
    
    try:
        response = requests.post(url, json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_game_data_webhook():
    """Test the game data webhook endpoint"""
    print("\nTesting game data webhook...")
    
    url = f"{FLASK_APP_URL}/webhook/update_game"
    payload = {
        "game": "TestGame",
        "team1_balance": "150",
        "team2_balance": "200",
        "team1_tickets": "25",
        "team2_tickets": "30"
    }
    
    try:
        response = requests.post(url, json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_multiple_games():
    """Test updating multiple games"""
    print("\nTesting multiple games...")
    
    games = [
        {
            "game": "Game1",
            "team1_balance": "100",
            "team2_balance": "120",
            "team1_tickets": "15",
            "team2_tickets": "18"
        },
        {
            "game": "Game2", 
            "team1_balance": "80",
            "team2_balance": "90",
            "team1_tickets": "12",
            "team2_tickets": "14"
        }
    ]
    
    success_count = 0
    for game_data in games:
        url = f"{FLASK_APP_URL}/webhook/update_game"
        try:
            response = requests.post(url, json=game_data)
            if response.status_code == 200:
                success_count += 1
                print(f"✅ {game_data['game']} updated successfully")
            else:
                print(f"❌ {game_data['game']} failed: {response.status_code}")
        except Exception as e:
            print(f"❌ {game_data['game']} error: {e}")
    
    return success_count == len(games)

def main():
    """Run all tests"""
    print("🧪 CodeChella Carnival Webhook Tests")
    print("=" * 50)
    
    # Test 1: Sheet names
    test1_success = test_sheet_names_webhook()
    
    # Test 2: Game data
    test2_success = test_game_data_webhook()
    
    # Test 3: Multiple games
    test3_success = test_multiple_games()
    
    # Results
    print("\n" + "=" * 50)
    print("📊 Test Results:")
    print(f"Sheet Names Webhook: {'✅ PASS' if test1_success else '❌ FAIL'}")
    print(f"Game Data Webhook: {'✅ PASS' if test2_success else '❌ FAIL'}")
    print(f"Multiple Games: {'✅ PASS' if test3_success else '❌ FAIL'}")
    
    if all([test1_success, test2_success, test3_success]):
        print("\n🎉 All tests passed! Your webhook endpoints are working correctly.")
        print("You can now deploy your Flask app and set up the Apps Script.")
    else:
        print("\n⚠️  Some tests failed. Check your Flask app and try again.")
    
    print("\n💡 Next steps:")
    print("1. Deploy your Flask app to Vercel/Railway/Heroku")
    print("2. Update the WEBHOOK_URL in your Apps Script")
    print("3. Run the setup() function in Apps Script")
    print("4. Test with real Google Sheet data")

if __name__ == "__main__":
    main()
