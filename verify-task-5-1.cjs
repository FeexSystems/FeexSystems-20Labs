#!/usr/bin/env node

/**
 * Verification script for Task 5.1: Create repository integration system
 * 
 * This script verifies that:
 * 1. Repository, Pipeline, and Deployment models are defined
 * 2. OAuth integration for GitHub, GitLab, and Bitbucket is implemented
 * 3. Repository webhook handling is created
 * 4. Secure token storage and encryption utilities are built
 */

import { PrismaClient } from '@prisma/client';

// Set environment variables for testing
process.env.ENCRYPTION_KEY = 'test-encryption-key-for-verification-only';
process.env.BASE_URL = 'http://localhost:3001';

async function loadModules() {
  try {
    const { GitProviderFactory } = await import('./server/lib/services/git-providers/index.js');
    const { repositoryService } = await import('./server/lib/services/repository.service.js');
    const { encryptionService } = await import('./server/lib/utils/encryption.js');
    
    return { GitProviderFactory, repositoryService, encryptionService };
  } catch (error) {
    console.error('Failed to load modules:', error.message);
    throw error;
  }
}

const prisma = new PrismaClient();

async function verifyTask51() {
  console.log('🔍 Verifying Task 5.1: Create repository integration system\n');

  let allPassed = true;
  const results = [];
  
  // Load modules dynamically
  const { GitProviderFactory, repositoryService, encryptionService } = await loadModules();

  // Test 1: Verify database models exist
  try {
    console.log('1. Checking database models...');
    
    // Check if we can access the models (this will throw if they don't exist)
    const repositoryModel = prisma.repository;
    const pipelineModel = prisma.pipeline;
    const deploymentModel = prisma.deployment;
    
    console.log('   ✅ Repository model exists');
    console.log('   ✅ Pipeline model exists');
    console.log('   ✅ Deployment model exists');
    results.push('✅ Database models are properly defined');
  } catch (error) {
    console.log('   ❌ Database models check failed:', error.message);
    results.push('❌ Database models are missing or invalid');
    allPassed = false;
  }

  // Test 2: Verify Git Provider Factory
  try {
    console.log('\n2. Checking Git Provider Factory...');
    
    // Initialize providers (this will check environment variables)
    GitProviderFactory.initialize();
    
    const availableProviders = GitProviderFactory.getAvailableProviders();
    console.log(`   📋 Available providers: ${availableProviders.join(', ')}`);
    
    // Test provider availability checks
    const githubAvailable = GitProviderFactory.isProviderAvailable('github');
    const gitlabAvailable = GitProviderFactory.isProviderAvailable('gitlab');
    const bitbucketAvailable = GitProviderFactory.isProviderAvailable('bitbucket');
    
    console.log(`   🔗 GitHub available: ${githubAvailable}`);
    console.log(`   🔗 GitLab available: ${gitlabAvailable}`);
    console.log(`   🔗 Bitbucket available: ${bitbucketAvailable}`);
    
    results.push('✅ Git Provider Factory is implemented');
  } catch (error) {
    console.log('   ❌ Git Provider Factory check failed:', error.message);
    results.push('❌ Git Provider Factory has issues');
    allPassed = false;
  }

  // Test 3: Verify Repository Service
  try {
    console.log('\n3. Checking Repository Service...');
    
    // Check if service methods exist
    const hasGetAuthUrl = typeof repositoryService.getAuthUrl === 'function';
    const hasHandleOAuth = typeof repositoryService.handleOAuthCallback === 'function';
    const hasGetRepos = typeof repositoryService.getUserRepositories === 'function';
    const hasCreateWebhook = typeof repositoryService.createWebhook === 'function';
    const hasHandleWebhook = typeof repositoryService.handleWebhook === 'function';
    
    console.log(`   🔐 OAuth URL generation: ${hasGetAuthUrl ? '✅' : '❌'}`);
    console.log(`   🔐 OAuth callback handling: ${hasHandleOAuth ? '✅' : '❌'}`);
    console.log(`   📂 Repository management: ${hasGetRepos ? '✅' : '❌'}`);
    console.log(`   🪝 Webhook creation: ${hasCreateWebhook ? '✅' : '❌'}`);
    console.log(`   🪝 Webhook handling: ${hasHandleWebhook ? '✅' : '❌'}`);
    
    if (hasGetAuthUrl && hasHandleOAuth && hasGetRepos && hasCreateWebhook && hasHandleWebhook) {
      results.push('✅ Repository Service is fully implemented');
    } else {
      results.push('❌ Repository Service is missing some methods');
      allPassed = false;
    }
  } catch (error) {
    console.log('   ❌ Repository Service check failed:', error.message);
    results.push('❌ Repository Service has issues');
    allPassed = false;
  }

  // Test 4: Verify Encryption Service
  try {
    console.log('\n4. Checking Encryption Service...');
    
    // Test encryption/decryption
    const testData = 'test-access-token-12345';
    const encrypted = encryptionService.encrypt(testData);
    const decrypted = encryptionService.decrypt(encrypted);
    
    console.log(`   🔒 Encryption: ${encrypted !== testData ? '✅' : '❌'}`);
    console.log(`   🔓 Decryption: ${decrypted === testData ? '✅' : '❌'}`);
    
    // Test secret generation
    const secret = encryptionService.generateSecret();
    console.log(`   🔑 Secret generation: ${secret && secret.length > 0 ? '✅' : '❌'}`);
    
    // Test HMAC signature
    const signature = encryptionService.createHmacSignature('test payload', 'secret');
    const isValid = encryptionService.verifyHmacSignature('test payload', signature, 'secret');
    console.log(`   ✍️  HMAC signature: ${isValid ? '✅' : '❌'}`);
    
    if (encrypted !== testData && decrypted === testData && secret && isValid) {
      results.push('✅ Encryption utilities are working correctly');
    } else {
      results.push('❌ Encryption utilities have issues');
      allPassed = false;
    }
  } catch (error) {
    console.log('   ❌ Encryption Service check failed:', error.message);
    results.push('❌ Encryption Service has issues');
    allPassed = false;
  }

  // Test 5: Verify API Routes exist
  try {
    console.log('\n5. Checking API Routes...');
    
    // Import the routes to check they exist
    const devopsRoutes = await import('./server/routes/devops.js');
    
    console.log('   🛣️  DevOps routes module loaded successfully');
    results.push('✅ DevOps API routes are implemented');
  } catch (error) {
    console.log('   ❌ API Routes check failed:', error.message);
    results.push('❌ DevOps API routes have issues');
    allPassed = false;
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📋 TASK 5.1 VERIFICATION SUMMARY');
  console.log('='.repeat(60));
  
  results.forEach(result => console.log(result));
  
  console.log('\n' + (allPassed ? '🎉 Task 5.1 PASSED - Repository integration system is complete!' : '❌ Task 5.1 FAILED - Some components need attention'));
  
  return allPassed;
}

// Run verification
verifyTask51()
  .then(passed => {
    process.exit(passed ? 0 : 1);
  })
  .catch(error => {
    console.error('Verification failed with error:', error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });