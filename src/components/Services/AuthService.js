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
      const ws = new WebSocket(`${process.env.REACT_APP_WS_BASE_URL || 'ws://localhost:8000'}/ws/verify/${user_id}/`);

      ws.onopen = () => {
        console.log('WebSocket connection established');
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.message === 'activated' && data.token) {
          // Store the token in localStorage
          localStorage.setItem('token', data.token);
          console.log('Token set in localStorage:', data.token);
          resolve(true);
        } else {
          console.warn('Activation failed or token not received');
          resolve(false);
        }
        ws.close();
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject(error);
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
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
        password,
        token
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

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }
};

export default AuthService;
