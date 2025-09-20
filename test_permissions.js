/**
 * Test function to check if external requests are working
 * Run this function first to test permissions
 */

function testPermissions() {
  try {
    console.log('Testing external request permissions...');
    
    // Simple test request to a public API
    const response = UrlFetchApp.fetch('https://httpbin.org/get', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('✅ External requests are working!');
    console.log('Response status:', response.getResponseCode());
    console.log('Response:', response.getContentText());
    
    return true;
    
  } catch (error) {
    console.error('❌ External requests are NOT working:');
    console.error('Error:', error.toString());
    
    if (error.toString().includes('permission')) {
      console.log('\n🔧 SOLUTION:');
      console.log('1. Go to Project Settings (gear icon)');
      console.log('2. Enable "Google Cloud Platform (GCP) Project"');
      console.log('3. Create a new project or select existing');
      console.log('4. Re-run this function');
      console.log('5. Grant permissions when prompted');
    }
    
    return false;
  }
}

/**
 * Test function specifically for your Railway app
 */
function testRailwayConnection() {
  try {
    console.log('Testing connection to Railway app...');
    
    const WEBHOOK_URL = 'https://web-production-fb295.up.railway.app';
    
    const response = UrlFetchApp.fetch(`${WEBHOOK_URL}/webhook/update_sheets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      payload: JSON.stringify({
        sheet_names: ['TestGame1', 'TestGame2']
      })
    });
    
    console.log('✅ Railway connection is working!');
    console.log('Response status:', response.getResponseCode());
    console.log('Response:', response.getContentText());
    
    return true;
    
  } catch (error) {
    console.error('❌ Railway connection failed:');
    console.error('Error:', error.toString());
    return false;
  }
}
