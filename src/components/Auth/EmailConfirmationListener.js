import React, { useState, useEffect } from 'react';
import Logo from '../../assets/img/logo.svg';
import FloatingCoins from '../FloatingCoins';
import AuthService from '../Services/AuthService';
import { useNavigate } from 'react-router-dom';

const EmailConfirmationListener = ({ setIsAuthenticated }) => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user_id = localStorage.getItem('user_id');
    if (!user_id) {
      console.error('No user_id found in localStorage');
      return;
    }

    const verifyEmail = async () => {
      try {
        const isVerified = await AuthService.verifyWebSocket(user_id);
        if (isVerified) {
          setIsConfirmed(true);
          setIsAuthenticated(true);
          setTimeout(() => {
            navigate('/dashboard');
          }, 5000);
        } else {
          console.error('Email verification failed');
        }
      } catch (error) {
        console.error('Error during email verification:', error);
      }
    };

    verifyEmail();

    // No need for a cleanup function as the WebSocket is closed in the verifyWebSocket method
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-darkblue text-white overflow-hidden">
      <FloatingCoins />
      <div className="backdrop-blur-md bg-darkblue/30 p-8 rounded-lg shadow-lg w-full max-w-md border border-white/20 z-10">
        <div className="flex flex-row items-center justify-center text-3xl font-bold text-center mb-6">
          <img src={Logo} alt='logo' className='h-10 inline-block ml-2'/>
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">Email Confirmation Status</h2>
        {isConfirmed ? (
          <div className="text-center">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-blue-400 animate-[checkmark_0.5s_ease-in-out_forwards]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <p className="text-blue-400 font-bold mb-4 animate-[fadeIn_0.5s_ease-in-out]">Email Confirmed Successfully!</p>
            <p className="animate-[fadeIn_0.5s_ease-in-out_0.3s_both]">You can now close this window and return to the application.</p>
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-4">Waiting for email confirmation...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailConfirmationListener;
