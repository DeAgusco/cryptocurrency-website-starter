import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/';

const UserService = {
  getUserSettings: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/user/settings/`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user settings:', error);
      throw error;
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/user/change-password/`, {
        current_password: currentPassword,
        new_password: newPassword
      }, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },

  toggleTwoFactor: async (enabled) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/user/toggle-two-factor/`, {
        enabled: enabled
      }, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error toggling two-factor authentication:', error);
      throw error;
    }
  },

  updateNotificationPreferences: async (preferences) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/user/update-notifications/`, preferences, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  }
};

export default UserService;
