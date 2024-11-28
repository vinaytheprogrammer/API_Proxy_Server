const axios = require('axios');

async function testAPI(i) {
    const url = 'http://localhost:3001/proxy/weather?location=Mumbai&apiKey=abcd';
    
    try {
        const response = await axios.get(url);
        console.log(`Request ${i}:`, response.data);
    } catch (error) {
        if (error.response) {
            console.error(`Request ${i} Error:`, error.response.status, error.response.data);
        } else {
            console.error(`Request ${i} Network Error:`, error.message);
        }
    }
}

async function testRateLimit() {
    console.log('Testing Rate Limit...');
    for (let i = 1; i <= 6; i++) {
        await testAPI(i);
    }
}

testRateLimit();
