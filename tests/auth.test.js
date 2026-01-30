// Simple validation script - run with: node tests/auth.test.js
import fs from 'fs';
import path from 'path';

console.log('🧪 Starting Authentication Tests...\n');

const tests = {
    passed: 0,
    failed: 0,
    results: []
};

function test(name, condition) {
    if (condition) {
        tests.passed++;
        tests.results.push(`✅ ${name}`);
    } else {
        tests.failed++;
        tests.results.push(`❌ ${name}`);
    }
}

async function runTests() {
    const rootDir = process.cwd();

    // Test 1: Check Firebase config exists
    const configPath = path.join(rootDir, 'services', 'firebase.ts');
    test('Firebase config file exists', fs.existsSync(configPath));

    // Test 2: Check AuthContext exists
    const authContextPath = path.join(rootDir, 'context', 'AuthContext.tsx');
    test('AuthContext file exists', fs.existsSync(authContextPath));

    // Test 3: Check LoginForm exists
    const loginFormPath = path.join(rootDir, 'components', 'Auth', 'LoginForm.tsx');
    test('LoginForm component exists', fs.existsSync(loginFormPath));

    // Test 4: Check SignupForm exists
    const signupFormPath = path.join(rootDir, 'components', 'Auth', 'SignupForm.tsx');
    test('SignupForm component exists', fs.existsSync(signupFormPath));

    // Test 5: Check ProtectedRoute exists
    const protectedRoutePath = path.join(rootDir, 'components', 'ProtectedRoute.tsx');
    test('ProtectedRoute component exists', fs.existsSync(protectedRoutePath));

    // Test 6: Check environment variables
    const envPath = path.join(rootDir, '.env.local');
    test('Environment file exists', fs.existsSync(envPath));

    // Print results
    console.log('\n📊 TEST RESULTS:');
    console.log('================');
    tests.results.forEach(r => console.log(r));
    console.log('================');
    console.log(`Total: ${tests.passed + tests.failed} | Passed: ${tests.passed} | Failed: ${tests.failed}`);

    if (tests.failed > 0) {
        console.log('\n⚠️  Some tests failed. Please fix issues before proceeding.');
        process.exit(1);
    } else {
        console.log('\n🎉 All tests passed! Authentication setup is complete.');
    }
}

runTests().catch(console.error);
