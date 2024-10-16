const axios = require('axios');

// Simple in-memory store for rate limiting
let lastRequestTime = 0;
const minTimeBetweenRequests = 6000; // 6 seconds, to stay under 10 requests per minute

exports.handler = async function(event, context) {
  const { path } = event.queryStringParameters;

  if (!path) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Path parameter is required' })
    };
  }

  // Add default days parameter if it's a market chart request and days is not provided
  let url = `https://api.coingecko.com/api/v3/${path}`;
  if (path.includes('market_chart') && !path.includes('days=')) {
    url += (url.includes('?') ? '&' : '?') + 'days=7';  // Default to 7 days if not specified
  }

  try {
    const response = await axios.get(url);
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
