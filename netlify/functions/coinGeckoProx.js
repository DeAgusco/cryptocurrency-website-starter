const axios = require('axios');

// Simple in-memory store for rate limiting
let lastRequestTime = 0;
const minTimeBetweenRequests = 6000; // 6 seconds, to stay under 10 requests per minute

// Simple in-memory cache
const cache = {
  data: {},
  TTL: 15 * 60 * 1000, // 15 minutes cache TTL for images and market data
};

// Check if a cache entry is still valid
const isCacheValid = (timestamp) => {
  return Date.now() - timestamp < cache.TTL;
};

exports.handler = async function(event, context) {
  const { path } = event.queryStringParameters;

  if (!path) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Path parameter is required' })
    };
  }

  // Check cache first
  if (cache.data[path] && isCacheValid(cache.data[path].timestamp)) {
    console.log(`Serving cached response for: ${path}`);
    return {
      statusCode: 200,
      body: JSON.stringify(cache.data[path].data)
    };
  }

  // Add default days parameter if it's a market chart request and days is not provided
  let url = `https://api.coingecko.com/api/v3/${path}`;
  if (path.includes('market_chart') && !path.includes('days=')) {
    url += (url.includes('?') ? '&' : '?') + 'days=7';  // Default to 7 days if not specified
  }

  // Implement rate limiting
  const now = Date.now();
  const timeUntilNextRequest = lastRequestTime + minTimeBetweenRequests - now;
  
  if (timeUntilNextRequest > 0) {
    await new Promise(resolve => setTimeout(resolve, timeUntilNextRequest));
  }
  
  lastRequestTime = Date.now();

  try {
    const response = await axios.get(url);
    
    // Cache the response
    cache.data[path] = {
      timestamp: Date.now(),
      data: response.data
    };
    
    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    return {
      statusCode: error.response ? error.response.status : 500,
      body: JSON.stringify({ error: error.response ? error.response.data : error.message })
    };
  }
};
