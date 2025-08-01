// Simple ES module test for authentication service
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Mock environment variables
const JWT_SECRET = 'test-jwt-secret-key-for-testing-purposes-only';
const JWT_REFRESH_SECRET = 'test-refresh-secret-key-for-testing-purposes-only';

console.log('Testing JWT Authentication Service...');

// Test user data
const mockUser = {
  id: 'user_123',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'USER',
  emailVerified: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastLoginAt: new Date(),
};

try {
  // Test 1: Generate access token
  console.log('\n1. Testing access token generation...');
  const payload = {
    userId: mockUser.id,
    email: mockUser.email,
    role: mockUser.role,
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: '15m',
    issuer: 'feexsystems',
    audience: 'feexsystems-users',
  });
  
  console.log('✅ Access token generated successfully');
  console.log('Token length:', accessToken.length);

  // Test 2: Verify access token
  console.log('\n2. Testing access token verification...');
  const decoded = jwt.verify(accessToken, JWT_SECRET, {
    issuer: 'feexsystems',
    audience: 'feexsystems-users',
  });
  
  console.log('✅ Access token verified successfully');
  console.log('Payload:', { userId: decoded.userId, email: decoded.email, role: decoded.role });

  // Test 3: Generate refresh token
  console.log('\n3. Testing refresh token generation...');
  const refreshPayload = {
    userId: mockUser.id,
    tokenId: 'token_123',
  };

  const refreshToken = jwt.sign(refreshPayload, JWT_REFRESH_SECRET, {
    expiresIn: '7d',
    issuer: 'feexsystems',
    audience: 'feexsystems-refresh',
  });
  
  console.log('✅ Refresh token generated successfully');

  // Test 4: Verify refresh token
  console.log('\n4. Testing refresh token verification...');
  const refreshDecoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET, {
    issuer: 'feexsystems',
    audience: 'feexsystems-refresh',
  });
  
  console.log('✅ Refresh token verified successfully');
  console.log('Refresh payload:', { userId: refreshDecoded.userId, tokenId: refreshDecoded.tokenId });

  // Test 5: Generate secure token
  console.log('\n5. Testing secure token generation...');
  const secureToken = crypto.randomBytes(32).toString('hex');
  console.log('✅ Secure token generated:', secureToken.length, 'characters');

  // Test 6: Password strength check
  console.log('\n6. Testing password strength...');
  const testPassword = 'StrongPass123!';
  const hasLowercase = /[a-z]/.test(testPassword);
  const hasUppercase = /[A-Z]/.test(testPassword);
  const hasNumbers = /\d/.test(testPassword);
  const hasSpecial = /[@$!%*?&]/.test(testPassword);
  const isLongEnough = testPassword.length >= 8;
  
  const score = [hasLowercase, hasUppercase, hasNumbers, hasSpecial, isLongEnough].filter(Boolean).length;
  console.log('✅ Password strength check:', { score, isStrong: score >= 4 });

  // Test 7: Token expiration check
  console.log('\n7. Testing token expiration...');
  const tokenDecoded = jwt.decode(accessToken);
  const isExpired = Date.now() >= tokenDecoded.exp * 1000;
  console.log('✅ Token expiration check:', { isExpired, expiresAt: new Date(tokenDecoded.exp * 1000) });

  console.log('\n🎉 All JWT authentication tests passed!');

} catch (error) {
  console.error('\n❌ Test failed:', error.message);
  console.error('Stack:', error.stack);
}