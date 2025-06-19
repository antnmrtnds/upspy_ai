const http = require('http');

// Test 1: Invalid UUID
const testInvalidUUID = () => {
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/competitors/invalid-uuid',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log('=== Test 1: Invalid UUID ===');
    console.log(`Status Code: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Response:', data);
      console.log('');
      
      // Test 2: Valid endpoint
      testValidEndpoint();
    });
  });

  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
  });

  req.end();
};

// Test 2: Valid endpoint
const testValidEndpoint = () => {
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/competitors',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log('=== Test 2: Valid GET Request ===');
    console.log(`Status Code: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Response length:', data.length);
      console.log('');
      
      // Test 3: Invalid POST data
      testInvalidPostData();
    });
  });

  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
  });

  req.end();
};

// Test 3: Invalid POST data (should trigger validation)
const testInvalidPostData = () => {
  const postData = JSON.stringify({
    name: 'A', // Too short (should be min 2 chars)
    website: 'not-a-url' // Invalid URL
  });

  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/competitors',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    console.log('=== Test 3: Invalid POST Data ===');
    console.log(`Status Code: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Response:', data);
      console.log('');
      console.log('Tests completed!');
    });
  });

  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
  });

  req.write(postData);
  req.end();
};

// Start tests
console.log('Starting validation tests...\n');
testInvalidUUID(); 