import ApiService from './ApiService';

const AuthService = {
  async register(username, email, password) {
    try {
      const response = await ApiService.post('/account/register/', {
        username,
        email,
        password
      });
      if (response && response.id && response.username && response.email) {
        localStorage.setItem('user_id', response.id);
        localStorage.setItem('username', response.username);
        localStorage.setItem('email', response.email);
        return response;
      } else {
        throw new Error(response.message || 'Invalid response from server');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  async login(email, password) {
    try {
      const response = await ApiService.post('/account/login/', {
        email,
        password
      });
      if (response && response.id && response.username && response.email) {
        localStorage.setItem('user_id', response.id);
        localStorage.setItem('username', response.username);
        localStorage.setItem('email', response.email);
        return response;
      } else {
        throw new Error(response.message || 'Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async verifyWebSocket(user_id) {
    return new Promise((resolve, reject) => {
      // Always use secure websockets
      const baseUrl = process.env.REACT_APP_WS_BASE_URL;
      
      // Create WebSocket connection 
      const ws = new WebSocket(`${baseUrl}/ws/verify/${user_id}/`);
      
      // Add connection timeout (5 seconds)
      const connectionTimeout = setTimeout(() => {
        console.error('WebSocket connection timeout');
        ws.close();
        reject(new Error('WebSocket connection timeout'));
      }, 5000);

      ws.onopen = () => {
        console.log('WebSocket connection established');
        clearTimeout(connectionTimeout);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.message === 'activated' && data.token) {
            // Store the token in localStorage
            localStorage.setItem('token', data.token);
            console.log('Token set in localStorage:', data.token);
            resolve(true);
          } else {
            console.warn('Activation failed or token not received:', data);
            resolve(false);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          reject(error);
        } finally {
          ws.close();
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        clearTimeout(connectionTimeout);
        reject(error);
      };

      ws.onclose = (event) => {
        console.log('WebSocket connection closed', event.code, event.reason);
        clearTimeout(connectionTimeout);
        // If connection was never established properly
        if (event.code !== 1000 && !localStorage.getItem('token')) {
          reject(new Error(`WebSocket closed unexpectedly: ${event.code}`));
        }
      };
    });
  },

  async verify(activation_token) {
    try {
      const response = await ApiService.post('/account/verify/', {
        activation_token
      });
      return response;
    } catch (error) {
      console.error('Verification error:', error);
      throw error;
    }
  },

  async sendPasswordResetEmail(email) {
    try {
      const response = await ApiService.post('/account/password-reset/', {
        email
      });
      return response;
    } catch (error) {
      console.error('Password reset email error:', error);
      throw error;
    }
  },
  async resetPassword(password,token) {
    try {
      const response = await ApiService.post('/account/password-reset-confirm/', {
        new_password:password,
        token:token
      });
      return response;
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('user_id');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    // Dispatch a custom event
    window.dispatchEvent(new Event('authChange'));
  },

  getCurrentUser() {
    return localStorage.getItem('user_id');
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }
};

export default AuthService;
