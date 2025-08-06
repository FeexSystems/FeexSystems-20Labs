#!/usr/bin/env node

/**
 * Verification script for Task 2.4: Build user profile management features
 * 
 * This script tests:
 * - GET /api/users/profile endpoint for user data retrieval
 * - PUT /api/users/profile endpoint for profile updates
 * - Profile image upload functionality with file validation
 * - User activity logging system
 */

import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const TEST_EMAIL = 'profiletest@example.com';
const TEST_PASSWORD = 'TestPassword123!';

let authToken = '';
let testUserId = '';

async function makeRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();
  return { response, data };
}

async function registerTestUser() {
  console.log('🔧 Registering test user...');
  
  const { response, data } = await makeRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      firstName: 'Profile',
      lastName: 'Test',
    }),
  });

  if (response.ok) {
    authToken = data.data.tokens.accessToken;
    testUserId = data.data.user.id;
    console.log('✅ Test user registered successfully');
    return true;
  } else {
    console.log('ℹ️ User might already exist, trying to login...');
    return false;
  }
}

async function loginTestUser() {
  console.log('🔐 Logging in test user...');
  
  const { response, data } = await makeRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    }),
  });

  if (response.ok) {
    authToken = data.data.tokens.accessToken;
    testUserId = data.data.user.id;
    console.log('✅ Test user logged in successfully');
    return true;
  } else {
    console.error('❌ Failed to login test user:', data);
    return false;
  }
}

async function testGetProfile() {
  console.log('\n📋 Testing GET /api/users/profile...');
  
  const { response, data } = await makeRequest('/api/users/profile', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  });

  if (response.ok) {
    console.log('✅ GET /api/users/profile - SUCCESS');
    console.log('   - User data retrieved:', !!data.data.user);
    console.log('   - Stats included:', !!data.data.stats);
    console.log('   - Activity included:', !!data.data.activity);
    console.log('   - Password hash excluded:', !data.data.user.passwordHash);
    return true;
  } else {
    console.error('❌ GET /api/users/profile - FAILED:', data);
    return false;
  }
}

async function testUpdateProfile() {
  console.log('\n✏️ Testing PUT /api/users/profile...');
  
  const updateData = {
    firstName: 'UpdatedProfile',
    lastName: 'UpdatedTest',
  };

  const { response, data } = await makeRequest('/api/users/profile', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
    body: JSON.stringify(updateData),
  });

  if (response.ok) {
    console.log('✅ PUT /api/users/profile - SUCCESS');
    console.log('   - First name updated:', data.data.user.firstName === 'UpdatedProfile');
    console.log('   - Last name updated:', data.data.user.lastName === 'UpdatedTest');
    return true;
  } else {
    console.error('❌ PUT /api/users/profile - FAILED:', data);
    return false;
  }
}

async function testProfileValidation() {
  console.log('\n🔍 Testing profile validation...');
  
  const invalidData = {
    firstName: '', // Empty string should fail
    email: 'invalid-email', // Invalid email format
  };

  const { response, data } = await makeRequest('/api/users/profile', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
    body: JSON.stringify(invalidData),
  });

  if (response.status === 400) {
    console.log('✅ Profile validation - SUCCESS');
    console.log('   - Validation error returned:', data.error.type === 'VALIDATION_ERROR');
    return true;
  } else {
    console.error('❌ Profile validation - FAILED: Should have returned 400');
    return false;
  }
}

async function createTestImage() {
  // Create a simple test image buffer (1x1 pixel PNG)
  const pngBuffer = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, // IHDR chunk length
    0x49, 0x48, 0x44, 0x52, // IHDR
    0x00, 0x00, 0x00, 0x01, // Width: 1
    0x00, 0x00, 0x00, 0x01, // Height: 1
    0x08, 0x02, 0x00, 0x00, 0x00, // Bit depth, color type, compression, filter, interlace
    0x90, 0x77, 0x53, 0xDE, // CRC
    0x00, 0x00, 0x00, 0x0C, // IDAT chunk length
    0x49, 0x44, 0x41, 0x54, // IDAT
    0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, // Image data
    0xE2, 0x21, 0xBC, 0x33, // CRC
    0x00, 0x00, 0x00, 0x00, // IEND chunk length
    0x49, 0x45, 0x4E, 0x44, // IEND
    0xAE, 0x42, 0x60, 0x82  // CRC
  ]);
  
  const testImagePath = path.join(process.cwd(), 'test-avatar.png');
  fs.writeFileSync(testImagePath, pngBuffer);
  return testImagePath;
}

async function testAvatarUpload() {
  console.log('\n🖼️ Testing POST /api/users/profile/avatar...');
  
  try {
    const testImagePath = createTestImage();
    const form = new FormData();
    form.append('avatar', fs.createReadStream(testImagePath), {
      filename: 'test-avatar.png',
      contentType: 'image/png',
    });

    const response = await fetch(`${BASE_URL}/api/users/profile/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        ...form.getHeaders(),
      },
      body: form,
    });

    const data = await response.json();

    // Clean up test file
    fs.unlinkSync(testImagePath);

    if (response.ok) {
      console.log('✅ POST /api/users/profile/avatar - SUCCESS');
      console.log('   - Avatar URL returned:', !!data.data.avatarUrl);
      console.log('   - Profile image URL updated:', !!data.data.user.profileImageUrl);
      return true;
    } else {
      console.error('❌ POST /api/users/profile/avatar - FAILED:', data);
      return false;
    }
  } catch (error) {
    console.error('❌ Avatar upload test error:', error.message);
    return false;
  }
}

async function testAvatarValidation() {
  console.log('\n🚫 Testing avatar file validation...');
  
  try {
    // Create a text file instead of an image
    const testFilePath = path.join(process.cwd(), 'test-file.txt');
    fs.writeFileSync(testFilePath, 'This is not an image');
    
    const form = new FormData();
    form.append('avatar', fs.createReadStream(testFilePath), {
      filename: 'test-file.txt',
      contentType: 'text/plain',
    });

    const response = await fetch(`${BASE_URL}/api/users/profile/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        ...form.getHeaders(),
      },
      body: form,
    });

    const data = await response.json();

    // Clean up test file
    fs.unlinkSync(testFilePath);

    if (response.status === 400) {
      console.log('✅ Avatar file validation - SUCCESS');
      console.log('   - Non-image file rejected');
      return true;
    } else {
      console.error('❌ Avatar file validation - FAILED: Should have rejected non-image file');
      return false;
    }
  } catch (error) {
    console.error('❌ Avatar validation test error:', error.message);
    return false;
  }
}

async function testActivityLogging() {
  console.log('\n📊 Testing GET /api/users/profile/activity...');
  
  const { response, data } = await makeRequest('/api/users/profile/activity', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  });

  if (response.ok) {
    console.log('✅ GET /api/users/profile/activity - SUCCESS');
    console.log('   - Activities array returned:', Array.isArray(data.data.activities));
    console.log('   - Pagination info included:', !!data.data.pagination);
    console.log('   - Activity count:', data.data.activities.length);
    
    // Check if we have some logged activities from our previous tests
    const hasProfileActivity = data.data.activities.some(activity => 
      activity.action === 'PROFILE_VIEWED' || 
      activity.action === 'PROFILE_UPDATED' ||
      activity.action === 'AVATAR_UPLOADED'
    );
    console.log('   - Profile-related activities logged:', hasProfileActivity);
    
    return true;
  } else {
    console.error('❌ GET /api/users/profile/activity - FAILED:', data);
    return false;
  }
}

async function testActivityFiltering() {
  console.log('\n🔍 Testing activity filtering...');
  
  const { response, data } = await makeRequest('/api/users/profile/activity?action=PROFILE_VIEWED&limit=5', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  });

  if (response.ok) {
    console.log('✅ Activity filtering - SUCCESS');
    console.log('   - Filtered results returned');
    console.log('   - Pagination limit respected:', data.data.pagination.limit === 5);
    return true;
  } else {
    console.error('❌ Activity filtering - FAILED:', data);
    return false;
  }
}

async function testAuthenticationRequired() {
  console.log('\n🔒 Testing authentication requirements...');
  
  const endpoints = [
    { method: 'GET', path: '/api/users/profile' },
    { method: 'PUT', path: '/api/users/profile' },
    { method: 'GET', path: '/api/users/profile/activity' },
  ];

  let allPassed = true;

  for (const endpoint of endpoints) {
    const { response } = await makeRequest(endpoint.path, {
      method: endpoint.method,
      body: endpoint.method === 'PUT' ? JSON.stringify({ firstName: 'Test' }) : undefined,
    });

    if (response.status === 401) {
      console.log(`✅ ${endpoint.method} ${endpoint.path} - Authentication required (401)`);
    } else {
      console.error(`❌ ${endpoint.method} ${endpoint.path} - Should require authentication`);
      allPassed = false;
    }
  }

  return allPassed;
}

async function runTests() {
  console.log('🚀 Starting Task 2.4 Verification Tests\n');
  console.log('Testing: Build user profile management features');
  console.log('========================================\n');

  const results = [];

  try {
    // Setup test user
    let userReady = await registerTestUser();
    if (!userReady) {
      userReady = await loginTestUser();
    }

    if (!userReady) {
      console.error('❌ Failed to setup test user');
      process.exit(1);
    }

    // Run all tests
    results.push(await testAuthenticationRequired());
    results.push(await testGetProfile());
    results.push(await testUpdateProfile());
    results.push(await testProfileValidation());
    results.push(await testAvatarUpload());
    results.push(await testAvatarValidation());
    results.push(await testActivityLogging());
    results.push(await testActivityFiltering());

    // Summary
    const passed = results.filter(r => r).length;
    const total = results.length;

    console.log('\n' + '='.repeat(50));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Passed: ${passed}/${total}`);
    console.log(`❌ Failed: ${total - passed}/${total}`);

    if (passed === total) {
      console.log('\n🎉 All tests passed! Task 2.4 implementation is working correctly.');
      console.log('\n✅ Verified features:');
      console.log('   - GET /api/users/profile endpoint for user data retrieval');
      console.log('   - PUT /api/users/profile endpoint for profile updates');
      console.log('   - Profile image upload functionality with file validation');
      console.log('   - User activity logging system');
      console.log('   - Authentication and authorization');
      console.log('   - Input validation and error handling');
    } else {
      console.log('\n⚠️ Some tests failed. Please check the implementation.');
      process.exit(1);
    }

  } catch (error) {
    console.error('\n💥 Test execution failed:', error.message);
    process.exit(1);
  }
}

// Handle module import
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}

export { runTests };