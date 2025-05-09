import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../Services/AuthService';
import Logo from '../../assets/img/logo.svg';
import VerificationModal from './VerificationModal';
import HelpModal from './HelpModal';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    AuthService.logout();
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-darkblue-secondary/80 to-darkblue/90 backdrop-blur-lg shadow-lg h-full border-b border-white/5">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-48 sm:w-64 h-48 sm:h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-0 right-1/4 w-48 sm:w-64 h-48 sm:h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 relative z-10">
        <div className="flex justify-between h-14 sm:h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              {/* Logo */}
              <img className="h-6 sm:h-8 w-auto" src={Logo} alt="Logo" />
            </div>
          </div>
          
          <div className="flex items-center">
            {/* Notification Bell */}
            <button className="p-1.5 sm:p-2 rounded-full text-blue-300 hover:text-white hover:bg-white/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 mr-1 sm:mr-2">
              <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            {/* User Profile */}
            <div className="ml-1 sm:ml-2 flex items-center relative dropdown-container z-50">
              <button 
                className="flex items-center text-xs sm:text-sm rounded-full bg-white/5 border border-white/10 px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-white/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-0.5 mr-1.5 sm:mr-2">
                  <img
                    className="h-full w-full rounded-full object-cover"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="User profile"
                  />
                </div>
                <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300 hidden xs:inline">{username}</span>
                <svg className={`ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5 text-blue-300 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 sm:w-56 rounded-xl shadow-lg py-1 bg-gradient-to-br from-darkblue/90 to-darkblue-secondary/90 backdrop-blur-md border border-white/10 ring-1 ring-black ring-opacity-5 z-50 shadow-[0_0_15px_rgba(101,121,248,0.2)]">
                  <button onClick={() => setShowVerificationModal(true)} className="flex flex-row justify-between items-center w-full px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-blue-300 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 hover:text-white transition-colors duration-200">
                    Verify Account <span className="text-blue-400">
                      <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                  </button>
                  <button onClick={() => setShowHelpModal(true)} className="flex flex-row justify-between items-center w-full px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-blue-300 border-b border-white/5 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 hover:text-white transition-colors duration-200">
                    Help <span className="text-blue-400">
                      <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M12 21a9 9 0 110-18 9 9 0 010 18z" />
                      </svg>
                    </span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex flex-row justify-between items-center w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-red-400 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 hover:text-red-300 transition-colors duration-200"
                  >
                    Logout <span className="text-red-400">
                      <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <VerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
      />
      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />
    </nav>
  );
};

export default Navbar;
