import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/';

const DashboardService = {
  getWallet: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/main-wallet/`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching wallet:', error);
      throw error;
    }
  },

  requestAddress: async (coin) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/request-address/`, 
        { coin },
        {
          headers: {
            'Authorization': `Token ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error requesting address:', error);
      throw error;
    }
  },
  getTransactions: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/transactions/`, { headers: { 'Authorization': `Token ${token}` } });
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },
  swap: async (data) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/swap-coin/`, data, { headers: { 'Authorization': `Token ${token}` } });
      return response.data;
    } catch (error) {
      console.error('Error swapping:', error);
      throw error;
    }
  },
  getSwap: async (coin_from, coin_to, amount) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/swap-coin/`, { coin_from, coin_to, amount }, { headers: { 'Authorization': `Token ${token}` } });
      return response.data;
    } catch (error) {
      console.error('Error fetching swap:', error);
      throw error;
    }
  }
};

export default DashboardService;
