/**
 * Google Apps Script for CodeChella Carnival Scoreboard
 * This script monitors Google Sheets changes and sends real-time updates to your Flask web app
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to script.google.com
 * 2. Create a new project
 * 3. Replace the default code with this script
 * 4. Update the WEBHOOK_URL below with your deployed Flask app URL
 * 5. Update the SHEET_ID below with your Google Sheet ID
 * 6. Save and run the setup function once
 * 7. Set up triggers for automatic execution
 */

// ===== CONFIGURATION =====
// Replace with your deployed Flask app URL (e.g., https://your-app.vercel.app)
const WEBHOOK_URL = 'https://your-app.vercel.app';

// Replace with your Google Sheet ID (from the URL)
const SHEET_ID = '1FvEG6CH2tCvpdkvKp3FUj6ePbeIYAoQ56uP7rZQkDgc';

// ===== MAIN FUNCTIONS =====

/**
 * Setup function - run this once to initialize the script
 */
function setup() {
  console.log('Setting up CodeChella Carnival Scoreboard...');
  
  // Send initial sheet names to web app
  sendSheetNames();
  
  // Send initial data for all sheets
  sendAllGameData();
  
  console.log('Setup complete!');
}

/**
 * Send available sheet names to the web app
 */
function sendSheetNames() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheets = spreadsheet.getSheets();
    const sheetNames = sheets.map(sheet => sheet.getName());
    
    const payload = {
      sheet_names: sheetNames
    };
    
    const response = UrlFetchApp.fetch(`${WEBHOOK_URL}/webhook/update_sheets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      payload: JSON.stringify(payload)
    });
    
    console.log('Sheet names sent:', sheetNames);
    console.log('Response:', response.getContentText());
    
  } catch (error) {
    console.error('Error sending sheet names:', error);
  }
}

/**
 * Send game data for a specific sheet
 */
function sendGameData(sheetName) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      console.error(`Sheet "${sheetName}" not found`);
      return;
    }
    
    // Read data from the same ranges as your original app
    const balanceRange = sheet.getRange('A3:B3');
    const ticketsRange = sheet.getRange('A10:B10');
    
    const balanceValues = balanceRange.getValues();
    const ticketsValues = ticketsRange.getValues();
    
    const team1Balance = balanceValues[0][0] || '0';
    const team2Balance = balanceValues[0][1] || '0';
    const team1Tickets = ticketsValues[0][0] || '0';
    const team2Tickets = ticketsValues[0][1] || '0';
    
    const payload = {
      game: sheetName,
      team1_balance: team1Balance.toString(),
      team2_balance: team2Balance.toString(),
      team1_tickets: team1Tickets.toString(),
      team2_tickets: team2Tickets.toString()
    };
    
    const response = UrlFetchApp.fetch(`${WEBHOOK_URL}/webhook/update_game`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      payload: JSON.stringify(payload)
    });
    
    console.log(`Game data sent for ${sheetName}:`, payload);
    console.log('Response:', response.getContentText());
    
  } catch (error) {
    console.error(`Error sending game data for ${sheetName}:`, error);
  }
}

/**
 * Send data for all sheets
 */
function sendAllGameData() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheets = spreadsheet.getSheets();
    
    sheets.forEach(sheet => {
      sendGameData(sheet.getName());
    });
    
  } catch (error) {
    console.error('Error sending all game data:', error);
  }
}

/**
 * Trigger function for when any cell in the spreadsheet is edited
 * This will be called automatically when data changes
 */
function onEdit(e) {
  try {
    // Get the sheet that was edited
    const sheet = e.source.getActiveSheet();
    const sheetName = sheet.getName();
    
    // Check if the edited cell is in our target ranges (A3:B3 or A10:B10)
    const editedRange = e.range;
    const editedRow = editedRange.getRow();
    const editedColumn = editedRange.getColumn();
    
    // Check if edit is in our target ranges
    const isBalanceRange = editedRow === 3 && (editedColumn === 1 || editedColumn === 2);
    const isTicketsRange = editedRow === 10 && (editedColumn === 1 || editedColumn === 2);
    
    if (isBalanceRange || isTicketsRange) {
      console.log(`Data changed in ${sheetName} at row ${editedRow}, column ${editedColumn}`);
      
      // Send updated data to web app
      sendGameData(sheetName);
    }
    
  } catch (error) {
    console.error('Error in onEdit trigger:', error);
  }
}

/**
 * Manual function to test sending data for a specific game
 * You can run this from the Apps Script editor to test
 */
function testSendGameData() {
  // Replace 'YourGameName' with an actual sheet name from your spreadsheet
  const testGameName = 'YourGameName';
  sendGameData(testGameName);
}

/**
 * Manual function to test sending all data
 * You can run this from the Apps Script editor to test
 */
function testSendAllData() {
  sendAllGameData();
}

// ===== TRIGGER SETUP =====

/**
 * Function to set up automatic triggers
 * Run this once after setup() to enable automatic updates
 */
function setupTriggers() {
  // Delete existing triggers to avoid duplicates
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'onEdit') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // Create new trigger for spreadsheet edits
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  ScriptApp.newTrigger('onEdit')
    .timeBased()
    .everyMinutes(1) // Check every minute as backup
    .create();
  
  // Also create an onEdit trigger for immediate updates
  ScriptApp.newTrigger('onEdit')
    .for(spreadsheet)
    .onEdit()
    .create();
  
  console.log('Triggers set up successfully!');
}

/**
 * Function to remove all triggers
 * Run this if you want to stop automatic updates
 */
function removeTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    ScriptApp.deleteTrigger(trigger);
  });
  console.log('All triggers removed!');
}

// ===== DEPLOYMENT INSTRUCTIONS =====

/*
STEP-BY-STEP SETUP:

1. CONFIGURE THE SCRIPT:
   - Replace WEBHOOK_URL with your deployed Flask app URL
   - Replace SHEET_ID with your Google Sheet ID

2. INITIAL SETUP:
   - Run the setup() function once
   - Run the setupTriggers() function once

3. TEST THE CONNECTION:
   - Run testSendAllData() to test the connection
   - Check your Flask app logs to see if data is received

4. AUTOMATIC UPDATES:
   - The script will now automatically send updates when:
     * Any cell in rows 3 or 10, columns A or B is edited
     * Every minute as a backup check

5. MONITORING:
   - Check the Apps Script execution log for any errors
   - Monitor your Flask app for incoming webhook data

6. TROUBLESHOOTING:
   - If updates stop working, run sendAllGameData() manually
   - Check that your Flask app URL is accessible
   - Verify the sheet ID is correct
   - Make sure the sheet names match between Apps Script and your web app

NOTES:
- The script reads from cells A3:B3 (team balances) and A10:B10 (team tickets)
- Make sure your Google Sheet has the correct structure
- The script will work with any number of sheets in your spreadsheet
- Each sheet represents a different game/competition
*/
