# CodeChella Carnival - Apps Script Deployment Guide

## Overview
This guide will help you deploy your CodeChella Carnival scoreboard system using Google Apps Script for real-time updates instead of polling.

## Benefits of Apps Script Approach
- ✅ **Real-time updates**: Instant updates when data changes
- ✅ **No polling**: Eliminates 1.5-second delays and reduces server load
- ✅ **Better performance**: Faster response times for all 5 PCs
- ✅ **Cost effective**: Reduces server resource usage
- ✅ **Reliable**: Google's infrastructure handles the monitoring

## Prerequisites
- Google account with access to Google Sheets and Apps Script
- Your Flask app deployed to Vercel, Railway, or similar platform
- Your Google Sheet with the game data

## Step 1: Deploy Your Flask App

### Option A: Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. In your project directory, run: `vercel`
3. Follow the prompts to deploy
4. Note your deployment URL (e.g., `https://your-app.vercel.app`)

### Option B: Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Deploy your Flask app
4. Note your deployment URL

### Option C: Deploy to Heroku
1. Create a `Procfile` with: `web: python app.py`
2. Deploy using Heroku CLI or GitHub integration
3. Note your deployment URL

## Step 2: Set Up Google Apps Script

### 2.1 Create Apps Script Project
1. Go to [script.google.com](https://script.google.com)
2. Click "New Project"
3. Delete the default code
4. Copy and paste the code from `apps_script_code.js`

### 2.2 Configure the Script
Update these variables in the Apps Script:

```javascript
// Replace with your deployed Flask app URL
const WEBHOOK_URL = 'https://your-app.vercel.app';

// Replace with your Google Sheet ID (from the URL)
const SHEET_ID = '1FvEG6CH2tCvpdkvKp3FUj6eP7rZQkDgc';
```

### 2.3 Initial Setup
1. Save the script (Ctrl+S)
2. Run the `setup()` function once:
   - Click on the function dropdown
   - Select `setup`
   - Click the "Run" button
   - Grant necessary permissions when prompted

3. Run the `setupTriggers()` function once:
   - Select `setupTriggers` from the dropdown
   - Click "Run"
   - Grant permissions if needed

### 2.4 Test the Connection
1. Run `testSendAllData()` function
2. Check your Flask app logs to see if data is received
3. Verify that your web app shows the updated data

## Step 3: Verify Your Google Sheet Structure

Make sure your Google Sheet has this structure:

```
Sheet Name: [Game Name]
Row 3: A3 = Team 1 Balance, B3 = Team 2 Balance
Row 10: A10 = Team 1 Tickets, B10 = Team 2 Tickets
```

## Step 4: Test the Complete System

### 4.1 Test Real-time Updates
1. Open your deployed web app
2. Navigate to a game scoreboard
3. Edit data in the corresponding Google Sheet
4. Verify that changes appear instantly on the web app

### 4.2 Test Multiple Games
1. Create multiple sheets in your Google Sheet
2. Each sheet represents a different game
3. Test updating data in different sheets
4. Verify that each game updates independently

## Step 5: Monitor and Maintain

### 5.1 Apps Script Monitoring
- Check the Apps Script execution log regularly
- Look for any error messages
- Re-run `setup()` if needed

### 5.2 Web App Monitoring
- Monitor your Flask app logs
- Check for webhook endpoint responses
- Verify that Socket.IO connections are working

## Troubleshooting

### Common Issues

#### 1. Webhook Not Receiving Data
- **Check URL**: Verify the WEBHOOK_URL is correct and accessible
- **Check permissions**: Make sure Apps Script has permission to access your sheet
- **Test manually**: Run `testSendAllData()` to test the connection

#### 2. Updates Not Appearing
- **Check triggers**: Verify that triggers are set up correctly
- **Check sheet structure**: Ensure your sheet has the correct cell structure
- **Check logs**: Look at both Apps Script and Flask app logs

#### 3. Permission Errors
- **Re-authorize**: Run the setup functions again to re-grant permissions
- **Check sheet access**: Ensure the Apps Script has access to your Google Sheet

#### 4. Multiple Sheet Issues
- **Update sheet names**: Run `sendSheetNames()` to update available games
- **Check sheet names**: Ensure sheet names match between Apps Script and web app

### Manual Recovery
If automatic updates stop working:

1. Run `sendAllGameData()` in Apps Script
2. Check your Flask app for the data
3. Re-run `setupTriggers()` if needed
4. Contact support if issues persist

## Performance Benefits

### Before (Polling):
- 1.5-second delay for updates
- Continuous server load
- API rate limits
- Higher costs

### After (Apps Script):
- Instant updates
- Minimal server load
- No API rate limits
- Lower costs
- Better user experience

## Security Notes

- The webhook endpoints are public but only accept POST requests
- Apps Script handles authentication with Google Sheets
- No sensitive credentials are stored in your Flask app
- All communication is over HTTPS

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the Apps Script execution logs
3. Test the webhook endpoints manually
4. Verify your deployment URL is accessible

## Next Steps

Once everything is working:
1. Share the web app URL with your 5 PCs
2. Each PC can access different games simultaneously
3. Updates will be instant across all devices
4. Enjoy the improved performance and user experience!

---

**Note**: This system is now much more efficient and will provide a better experience for all users. The real-time updates will make the carnival competition more engaging and responsive.
