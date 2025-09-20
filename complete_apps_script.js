/**
 * Complete Google Apps Script for CodeChella Carnival Scoreboard
 * Combines your existing game logic with real-time webhook updates
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to script.google.com
 * 2. Create a new project
 * 3. Replace the default code with this script
 * 4. Update the WEBHOOK_URL below with your Railway app URL
 * 5. Update the SHEET_ID below with your Google Sheet ID
 * 6. Save and run the setup function once
 * 7. Set up triggers for automatic execution
 */

// ===== CONFIGURATION =====
// Replace with your Railway app URL
const WEBHOOK_URL = 'https://web-production-fb295.up.railway.app';

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
 * Your existing onEdit function with webhook integration
 * This handles the game logic AND sends real-time updates
 */
function onEdit(e) {
  try {
    var sheet = e.source.getActiveSheet();
    var range = e.range;
    var editedCell = range.getA1Notation();
    var editedRow = range.getRow();
    var sheetName = sheet.getName();

    // ---- Part 1: Increment/Decrement A3 and B3 based on TRUE/FALSE toggles ----
    var targetA = sheet.getRange("A3");
    var currentValueA = targetA.getValue();
    var targetB = sheet.getRange("B3");
    var currentValueB = targetB.getValue();

    var cellMapA = {
      "D1": 60, "D2": 60,
      "G1": 70, "G2": 70,
      "I1": 120, "I2": 120,
      "L1": 80, "L2": 80,
      "O1": 90, "O2": 90
    };

    var cellMapB = {
      "D3": 60, "D4": 60,
      "G3": 70, "G4": 70,
      "I3": 120, "I4": 120,
      "L3": 80, "L4": 80,
      "O3": 90, "O4": 90
    };

    var dataChanged = false;

    if (!isNaN(currentValueA) && cellMapA.hasOwnProperty(editedCell)) {
      var changeA = cellMapA[editedCell];
      if (e.value === "TRUE") {
        targetA.setValue(currentValueA - changeA);
        dataChanged = true;
      } else if (e.value === "FALSE") {
        targetA.setValue(currentValueA + changeA);
        dataChanged = true;
      }
    }

    if (!isNaN(currentValueB) && cellMapB.hasOwnProperty(editedCell)) {
      var changeB = cellMapB[editedCell];
      if (e.value === "TRUE") {
        targetB.setValue(currentValueB - changeB);
        dataChanged = true;
      } else if (e.value === "FALSE") {
        targetB.setValue(currentValueB + changeB);
        dataChanged = true;
      }
    }

    // ---- Part 2: Recalculate A10 and B10 when dropdowns change ----
    if ([23, 24, 27, 28].includes(editedRow)) {
      var team1Range = sheet.getRange("E23:O24");
      var team2Range = sheet.getRange("E27:O28");

      var team1Sum = team1Range.getValues().flat().reduce((sum, val) => sum + (parseInt(val) || 0), 0);
      var team2Sum = team2Range.getValues().flat().reduce((sum, val) => sum + (parseInt(val) || 0), 0);

      sheet.getRange("A10").setValue(team1Sum);
      sheet.getRange("B10").setValue(team2Sum);
      dataChanged = true;
    }

    // ---- Part 3: Send real-time update to web app ----
    if (dataChanged) {
      console.log(`Data changed in ${sheetName}, sending update...`);
      
      // Add a small delay to ensure the sheet values are updated
      Utilities.sleep(100);
      
      // Send the updated data to your Railway app
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
    .for(spreadsheet)
    .onEdit()
    .create();
  
  // Also create a time-based trigger as backup (every 2 minutes)
  ScriptApp.newTrigger('sendAllGameData')
    .timeBased()
    .everyMinutes(2)
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
   - WEBHOOK_URL is already set to your Railway app
   - Update SHEET_ID with your Google Sheet ID

2. INITIAL SETUP:
   - Run the setup() function once
   - Run the setupTriggers() function once

3. TEST THE CONNECTION:
   - Run testSendAllData() to test the connection
   - Check your Railway app logs to see if data is received

4. AUTOMATIC UPDATES:
   - The script will now automatically send updates when:
     * Any cell in your game logic is edited (TRUE/FALSE toggles, dropdowns)
     * Every 2 minutes as a backup check

5. MONITORING:
   - Check the Apps Script execution log for any errors
   - Monitor your Railway app for incoming webhook data

6. TROUBLESHOOTING:
   - If updates stop working, run sendAllGameData() manually
   - Check that your Railway app URL is accessible
   - Verify the sheet ID is correct
   - Make sure the sheet names match between Apps Script and your web app

NOTES:
- The script reads from cells A3:B3 (team balances) and A10:B10 (team tickets)
- Your existing game logic is preserved and enhanced with real-time updates
- The script will work with any number of sheets in your spreadsheet
- Each sheet represents a different game/competition
- Updates are sent instantly when data changes
*/
