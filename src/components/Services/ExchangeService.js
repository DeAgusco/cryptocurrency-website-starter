import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/';

const ExchangeService = {
    getExchangeInfo: async (fromCoin, toCoin, amount) => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`${API_URL}/swap-coin/`, {
            params: {
              from_coin: fromCoin,
              to_coin: toCoin,
              amount: amount || ''
            },
            headers: {
              'Authorization': `Token ${token}`
            }
          });
          return response.data;
        } catch (error) {
          console.error('Error fetching exchange info:', error);
          throw error;
        }
      },

  executeExchange: async (data) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/swap-coin/`, {
        from_coin: data.fromCoin,
        to_coin: data.toCoin,
        from_amount: data.fromAmount,
        to_amount: data.toAmount
      }, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error executing exchange:', error);
      throw error;
    }
  }
};

export default ExchangeService;
