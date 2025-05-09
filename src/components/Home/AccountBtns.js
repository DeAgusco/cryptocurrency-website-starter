import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../Services/AuthService';
import { FiLogIn, FiUserPlus, FiLogOut, FiGrid } from 'react-icons/fi';

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
    <div className="flex items-center font-medium space-x-4">
      {isAuthenticated ? (
        <>
          <button 
            onClick={handleLogout} 
            className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 text-blue-300 hover:text-white px-4 py-2 rounded-xl transition-all duration-300"
          >
            <FiLogOut className="text-lg" />
            <span>Logout</span>
          </button>
          
          <button 
            onClick={handleDashboard} 
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-blue-600/20 transition-all duration-300"
          >
            <FiGrid className="text-lg" />
            <span>Dashboard</span>
          </button>
        </>
      ) : (
        <>
          <button 
            onClick={handleLogin} 
            className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 text-blue-300 hover:text-white px-4 py-2 rounded-xl transition-all duration-300"
          >
            <FiLogIn className="text-lg" />
            <span>Login</span>
          </button>
          
          <button 
            onClick={handleSignup} 
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-blue-600/20 transition-all duration-300"
          >
            <FiUserPlus className="text-lg" />
            <span>Sign Up</span>
          </button>
        </>
      )}
    </div>
  );
};

export default AccountBtns;
