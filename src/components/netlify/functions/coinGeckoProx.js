const axios = require('axios');

exports.handler = async function(event, context) {
  const { path } = event.queryStringParameters;

  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/${path}`);
    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    return {
      statusCode: error.response ? error.response.status : 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

