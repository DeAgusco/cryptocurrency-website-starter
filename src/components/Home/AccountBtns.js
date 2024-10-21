import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../Services/AuthService';

const AccountBtns = ({ isAuthenticated, checkAuthStatus }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleLogout = () => {
    AuthService.logout();
    checkAuthStatus();  // Call this to update the auth state immediately
    navigate('/login');
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className='flex items-center font-medium'>
      {isAuthenticated ? (
        <>
          <button onClick={handleLogout} className='border border-blue text-blue px-5 py-2 rounded-lg hover:bg-blue hover:text-white transition-all duration-300'>Logout</button>
          <span className='mx-3'>|</span>
          <button onClick={handleDashboard} className='bg-blue text-white px-5 py-2 rounded-lg hover:scale-105 transition-all duration-300'>Dashboard</button>
        </>
      ) : (
        <>
          <button onClick={handleLogin} className='border border-blue text-blue px-5 py-2 rounded-lg hover:bg-blue hover:text-white transition-all duration-300'>Login</button>
          <span className='mx-3'>|</span>
          <button onClick={handleSignup} className='bg-blue text-white px-5 py-2 rounded-lg hover:scale-105 transition-all duration-300'>Sign Up</button>
        </>
      )}
    </div>
  );
};

export default AccountBtns;
