# CodeChella Carnival - Quick Start Guide

## 🚀 Ready to Deploy!

Your CodeChella Carnival scoreboard system has been converted to use Google Apps Script for real-time updates. Here's what's been done:

### ✅ What's Ready
- **Flask App**: Updated to receive webhook data instead of polling
- **Apps Script Code**: Complete monitoring and webhook system
- **Dependencies**: Removed Google API dependencies for lighter deployment
- **Webhook Endpoints**: Ready to receive real-time updates

### 📁 Files Created/Updated
- `app.py` - Updated Flask app with webhook endpoints
- `requirements.txt` - Removed Google API dependencies
- `apps_script_code.js` - Complete Apps Script solution
- `test_webhooks.py` - Test script for webhook endpoints
- `DEPLOYMENT_GUIDE.md` - Detailed deployment instructions

## 🎯 Quick Deployment Steps

### 1. Test Locally (Optional)
```bash
# Install dependencies
pip install -r requirements.txt

# Run Flask app
python app.py

# In another terminal, test webhooks
python test_webhooks.py
```

### 2. Deploy Flask App
Choose one platform:

#### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

#### Railway
- Go to [railway.app](https://railway.app)
- Connect your GitHub repo
- Deploy automatically

#### Heroku
```bash
# Create Procfile
echo "web: python app.py" > Procfile

# Deploy
git add .
git commit -m "Deploy CodeChella Carnival"
git push heroku main
```

### 3. Set Up Apps Script
1. Go to [script.google.com](https://script.google.com)
2. Create new project
3. Copy code from `apps_script_code.js`
4. Update `WEBHOOK_URL` with your deployed app URL
5. Update `SHEET_ID` with your Google Sheet ID
6. Run `setup()` function once
7. Run `setupTriggers()` function once

### 4. Test the System
1. Open your deployed web app
2. Edit data in your Google Sheet
3. Watch updates appear instantly!

## 🎮 How It Works Now

### Before (Polling):
```
Google Sheet → Flask App (every 1.5s) → Web App
```

### After (Apps Script):
```
Google Sheet → Apps Script (instant) → Flask App → Web App
```

## 🔧 Configuration

### Flask App
- **Host**: `0.0.0.0` (for deployment)
- **Port**: `5000`
- **Webhook Endpoints**: 
  - `/webhook/update_game` - Receives game data
  - `/webhook/update_sheets` - Receives sheet names

### Apps Script
- **Triggers**: Automatic on sheet edit + backup every minute
- **Data Ranges**: A3:B3 (balances), A10:B10 (tickets)
- **Real-time**: Updates sent instantly when data changes

## 🎉 Benefits You'll See

- ⚡ **Instant Updates**: No more 1.5-second delays
- 🚀 **Better Performance**: Reduced server load
- 💰 **Lower Costs**: No continuous polling
- 🔄 **Real-time**: Updates across all 5 PCs instantly
- 📱 **Responsive**: Better user experience

## 🆘 Need Help?

1. **Check the logs**: Both Flask app and Apps Script have detailed logging
2. **Test webhooks**: Use `test_webhooks.py` to verify endpoints
3. **Manual trigger**: Run `sendAllGameData()` in Apps Script if needed
4. **Review guide**: See `DEPLOYMENT_GUIDE.md` for detailed instructions

## 🎊 You're All Set!

Your CodeChella Carnival is now ready for deployment with real-time updates! The system will be much faster and more responsive for all your users.

**Happy coding and may the best team win! 🏆**
