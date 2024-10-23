import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/img/logo.svg';
import FloatingCoins from '../FloatingCoins';
import AuthService from '../Services/AuthService';

const PasswordReset = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    const passwordResetToken = new URLSearchParams(window.location.search).get('token');
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      setIsLoading(true);
      // Assuming you have a method in AuthService to handle password reset
      await AuthService.resetPassword(password, passwordResetToken);
      navigate('/signin');
    } catch (error) {
      console.error('Password reset failed:', error);
      setError('Password reset failed. ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-darkblue text-white overflow-hidden">
      <FloatingCoins />
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg animate-fade-in-down">
          {error}
        </div>
      )}
      <div className="backdrop-blur-md bg-darkblue/30 p-8 rounded-lg shadow-lg w-full max-w-md border border-white/20 z-10">
        <div className="flex flex-row items-center justify-center text-3xl font-bold text-center mb-6">
          <img src={Logo} alt='logo' className='h-10 inline-block ml-2'/>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 bg-gray-700/50 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-3 py-2 bg-gray-700/50 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-md font-bold transition duration-300 disabled:bg-opacity-10 disabled:cursor-not-allowed"
          >
            {isLoading ? <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div> : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;