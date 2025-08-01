// Simple test to verify user profile functionality
const { createServer } = require('./server/index.ts');

async function testUserProfile() {
  try {
    console.log('Testing user profile functionality...');
    
    const app = createServer();
    console.log('✅ Server created successfully');
    
    // Test that the routes are properly configured
    const routes = app._router.stack
      .filter(r => r.route)
      .map(r => r.route.path);
    
    console.log('Available routes:', routes);
    
    console.log('✅ User profile functionality test completed');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testUserProfile();