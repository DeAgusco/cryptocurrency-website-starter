import axios from 'axios';
import useSWR from 'swr';
import AuthService from './AuthService';
import ApiService from './ApiService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/';

// Define a fetcher that uses ApiService for authenticated requests
// ApiService is already configured with the baseURL and auth interceptor
const authedFetcherForService = (path, config = {}) => {
  console.log("Fetching path:", path);
  const token = localStorage.getItem('token');
  const updatedConfig = {
    ...config,
    headers: {
      ...config.headers,
      'Authorization': `Token ${token}`
    }
  };
  
  // If path is a full URL, use axios directly instead of ApiService
  if (path.startsWith('http')) {
    return axios.get(path, updatedConfig).then(res => {
      console.log("Axios response for full URL:", path, res.data);
      return res.data;
    });
  }
  
  return ApiService.get(path, updatedConfig).then(res => {
    console.log("ApiService response for:", path, res);
    return res.data;
  });
};

// Custom hook for fetching wallet data
export const useDashboardWalletData = () => {
  const isLoggedIn = AuthService.isLoggedIn();
  const { data, error } = useSWR(
    isLoggedIn ? `${API_URL}/main-wallet/` : null, 
    url => authedFetcherForService(url)
  );

  console.log("Wallet data from SWR:", data);
  
  return {
    walletData: data,
    walletError: error,
    isLoadingWallet: isLoggedIn && !data && !error,
  };
};

// Custom hook for fetching transactions data
export const useDashboardTransactionsData = () => {
  const isLoggedIn = AuthService.isLoggedIn();
  const { data, error } = useSWR(
    isLoggedIn ? `${API_URL}/transactions/` : null, 
    url => authedFetcherForService(url)
  );

  console.log("Transactions data from SWR:", data);
  
  // Ensure transactions data is always an array with a fallback
  const safeTransactionsData = data ? 
    (Array.isArray(data) ? data : (data.results || data.transactions || [])) : 
    [];
  
  return {
    transactionsData: safeTransactionsData,
    transactionsError: error,
    isLoadingTransactions: isLoggedIn && !data && !error,
  };
};

const DashboardService = {
  getWallet: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/main-wallet/`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      console.log("getWallet direct axios call response:", response.data);
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
