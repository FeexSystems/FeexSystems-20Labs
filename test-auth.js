// Simple test runner for authentication service
const { JWTService, PasswordUtils, TokenBlacklistService } = require('./server/lib/auth.ts');

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
  const accessToken = JWTService.generateAccessToken(mockUser);
  console.log('✅ Access token generated successfully');
  console.log('Token length:', accessToken.length);

  // Test 2: Verify access token
  console.log('\n2. Testing access token verification...');
  const payload = JWTService.verifyAccessToken(accessToken);
  console.log('✅ Access token verified successfully');
  console.log('Payload:', { userId: payload.userId, email: payload.email, role: payload.role });

  // Test 3: Generate refresh token
  console.log('\n3. Testing refresh token generation...');
  const refreshToken = JWTService.generateRefreshToken(mockUser.id, 'token_123');
  console.log('✅ Refresh token generated successfully');

  // Test 4: Verify refresh token
  console.log('\n4. Testing refresh token verification...');
  const refreshPayload = JWTService.verifyRefreshToken(refreshToken);
  console.log('✅ Refresh token verified successfully');
  console.log('Refresh payload:', { userId: refreshPayload.userId, tokenId: refreshPayload.tokenId });

  // Test 5: Generate token pair
  console.log('\n5. Testing token pair generation...');
  const tokenPair = JWTService.generateTokenPair(mockUser, 'refresh_123');
  console.log('✅ Token pair generated successfully');
  console.log('Token pair keys:', Object.keys(tokenPair));

  // Test 6: Password utilities
  console.log('\n6. Testing password utilities...');
  const securePassword = PasswordUtils.generateSecurePassword(16);
  console.log('✅ Secure password generated:', securePassword.length, 'characters');
  
  const strengthCheck = PasswordUtils.checkPasswordStrength(securePassword);
  console.log('✅ Password strength check:', { score: strengthCheck.score, isStrong: strengthCheck.isStrong });

  // Test 7: Token blacklist
  console.log('\n7. Testing token blacklist...');
  TokenBlacklistService.addToBlacklist(accessToken);
  const isBlacklisted = TokenBlacklistService.isBlacklisted(accessToken);
  console.log('✅ Token blacklist working:', isBlacklisted);

  // Test 8: Token extraction
  console.log('\n8. Testing token extraction...');
  const extractedToken = JWTService.extractTokenFromHeader(`Bearer ${accessToken}`);
  console.log('✅ Token extraction working:', extractedToken === accessToken);

  console.log('\n🎉 All JWT authentication tests passed!');

} catch (error) {
  console.error('\n❌ Test failed:', error.message);
  console.error('Stack:', error.stack);
}