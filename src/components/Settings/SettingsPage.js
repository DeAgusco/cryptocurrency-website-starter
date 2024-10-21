import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import UserService from '../Services/UserService';

const SettingsPage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const settings = await UserService.getUserSettings();
        setTwoFactorEnabled(settings.twoFactorEnabled);
        setEmailNotifications(settings.emailNotifications);
        setSmsNotifications(settings.smsNotifications);
      } catch (error) {
        console.error('Error fetching user settings:', error);
        toast.error('Failed to load user settings');
      }
    };

    fetchUserSettings();
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      await UserService.changePassword(currentPassword, newPassword);
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFactorToggle = async () => {
    setIsLoading(true);
    try {
      await UserService.toggleTwoFactor(!twoFactorEnabled);
      setTwoFactorEnabled(!twoFactorEnabled);
      toast.success(`Two-factor authentication ${twoFactorEnabled ? 'disabled' : 'enabled'}`);
    } catch (error) {
      console.error('Error toggling two-factor authentication:', error);
      toast.error('Failed to update two-factor authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationChange = async (type, value) => {
    setIsLoading(true);
    try {
      await UserService.updateNotificationPreferences({ [type]: value });
      if (type === 'email') setEmailNotifications(value);
      if (type === 'sms') setSmsNotifications(value);
      toast.success('Notification preferences updated');
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      toast.error('Failed to update notification preferences');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-darkblue text-white">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-darkblue-secondary p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
          <form onSubmit={handlePasswordChange}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="currentPassword">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-2 bg-darkblue text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="newPassword">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 bg-darkblue text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="confirmPassword">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 bg-darkblue text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-md font-bold text-white transition duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>

        <div className="bg-darkblue-secondary p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Security Settings</h2>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={twoFactorEnabled}
                onChange={handleTwoFactorToggle}
                className="form-checkbox h-5 w-5 text-blue-500"
                disabled={isLoading}
              />
              <span className="ml-2 text-sm">Enable Two-Factor Authentication</span>
            </label>
          </div>
          <h2 className="text-2xl font-semibold mb-4 mt-8">Notification Preferences</h2>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => handleNotificationChange('email', e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-500"
                disabled={isLoading}
              />
              <span className="ml-2 text-sm">Email Notifications</span>
            </label>
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={smsNotifications}
                onChange={(e) => handleNotificationChange('sms', e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-500"
                disabled={isLoading}
              />
              <span className="ml-2 text-sm">SMS Notifications</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
