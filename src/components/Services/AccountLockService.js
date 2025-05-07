import axios from 'axios';

// Important: hardcode the exact API_URL for AccountLockService
// to ensure it doesn't rely on environment variables
const API_URL = 'https://crypto-backend-n808.onrender.com/';

const AccountLockService = {
  lockAccount: async (payload) => {
    try {
      const token = localStorage.getItem('token');
      // Follow the exact pattern from WalletService.js with template literals
      const response = await axios.post(`${API_URL}/lock-account/`, payload, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error locking account:', error);
      throw error;
    }
  },

  // Add more account-lock-related API calls here as needed
};

export default AccountLockService; 