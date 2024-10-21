import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/';

const ApiService = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
ApiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
ApiService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access (e.g., redirect to login)
      console.log('Unauthorized access. Redirecting to login...');
      // Implement your logout logic here
    }
    return Promise.reject(error);
  }
);

const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('API Error:', error.response.data);
    return error.response.data;
  } else if (error.request) {
    // The request was made but no response was received
    console.error('No response received:', error.request);
    return { error: 'No response from server' };
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Request setup error:', error.message);
    return { error: 'Request setup failed' };
  }
};

const apiServiceMethods = {
  async get(url, config = {}) {
    try {
      const response = await ApiService.get(url, config);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async post(url, data = {}, config = {}) {
    try {
      const response = await ApiService.post(url, data, config);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async put(url, data = {}, config = {}) {
    try {
      const response = await ApiService.put(url, data, config);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async delete(url, config = {}) {
    try {
      const response = await ApiService.delete(url, config);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Add more methods as needed
};

export default apiServiceMethods;
