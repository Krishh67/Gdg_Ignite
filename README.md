**Made a Website for Google Developer Club Game**



# CodeChella Carnival Scoreboard


Welcome to the CodeChella Carnival Scoreboard! This project provides a vibrant, real-time, web-based scoreboard for live competitions. Originally designed for GDG NMIMS Navi Mumbai's "Ignite 8.0" event, it leverages a modern, event-driven architecture to instantly reflect score changes from a Google Sheet to multiple displays.

This system replaces a traditional polling mechanism with an efficient webhook-based approach, ensuring instant updates, superior performance, and lower server costs.

## Key Features

-   **Real-time Updates**: Scores change instantly on screen using WebSockets (Flask-SocketIO) as they are edited in the source Google Sheet.
-   **Event-Driven Architecture**: A Google Apps Script triggers webhooks on sheet edits, *pushing* data to the backend instead of the backend constantly *pulling* it.
-   **Dynamic Frontend**: A carnival-themed interface built with HTML, CSS, and JavaScript, featuring animations, sound effects, progress bars, and a live timer.
-   **Multi-Game Support**: Easily manage multiple competitions by creating new sheets (tabs) in the source Google Sheet. Each sheet acts as an independent game scoreboard.
-   **Lightweight Backend**: A Flask application designed to receive webhook data and broadcast it efficiently to all connected clients.
-   **Easy Deployment**: Ready to be deployed on modern platforms like Vercel, Railway, and Heroku.

## How It Works

The application follows a simple, event-driven data flow:

1.  An event organizer updates a cell in the designated Google Sheet.
2.  The `onEdit` trigger in the attached Google Apps Script fires instantly.
3.  The Apps Script sends the updated score data via a webhook (HTTP POST request) to the deployed Flask application.
4.  The Flask backend receives the webhook, stores the new data in memory, and broadcasts it over a WebSocket channel for the specific game.
5.  All connected clients (browsers showing the scoreboard) receive the update via Socket.IO and dynamically render the new scores and animations.

## Setup and Deployment

Follow these steps to get your own instance of the scoreboard running.

### Part 1: Deploy the Backend

First, deploy the Flask backend to a web hosting service.

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/krishh67/gdg_ignite-game.git
    cd gdg_ignite-game
    ```

2.  **Install Dependencies**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Deploy to a Hosting Platform**
    Deploy the application to your preferred platform (e.g., Railway, Vercel, Heroku). The repository is already configured for deployment.

4.  **Get Your URL**
    Once deployed, note the public URL of your application (e.g., `https://your-app.railway.app`). You will need this for the next part.

For detailed platform-specific instructions, see the [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).

### Part 2: Configure Google Sheets & Apps Script

Next, set up the Google Sheet to act as your data source and connect it to your deployed backend.

1.  **Prepare Your Google Sheet**
    -   Create a new Google Sheet.
    -   Each game should be its own sheet (tab). The script reads scores from the following cells:
        -   `A3`: Team 1 Balance
        -   `B3`: Team 2 Balance
        -   `A10`: Team 1 Tickets
        -   `B10`: Team 2 Tickets
    -   Note the **Sheet ID** from the URL (e.g., the value in `.../spreadsheets/d/`**`SHEET_ID`**`/edit`).

2.  **Create the Apps Script**
    -   Go to [script.google.com](https://script.google.com) and create a **New Project**.
    -   Delete the default code and paste in the entire content of the [`complete_apps_script.js`](./complete_apps_script.js) file from this repository.

3.  **Configure the Script**
    -   In the Apps Script editor, update the following constants at the top of the file:
        ```javascript
        // Replace with your deployed Flask app URL
        const WEBHOOK_URL = 'https://your-app.railway.app';
        
        // Replace with your Google Sheet ID
        const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID';
        ```

4.  **Initialize the Script**
    -   Save the project.
    -   From the function dropdown in the editor, select `setup` and click **Run**. Grant the necessary permissions when prompted.
    -   Next, select the `setupTriggers` function and click **Run**. This will create the automatic triggers that listen for edits.

Your scoreboard system is now live!

## Usage

1.  Navigate to the URL of your deployed application.
2.  On the animated landing page, click **"Enter the Carnival"**.
3.  Choose a game from the dropdown menu (this list is populated automatically from your sheet names).
4.  The scoreboard for the selected game will load.
5.  As you edit the values in the corresponding Google Sheet, the changes will appear on the scoreboard in real time.
