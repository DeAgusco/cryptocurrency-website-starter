import React, { useState, useEffect } from 'react';
import Logo from '../../assets/img/logo.svg';
import FloatingCoins from '../FloatingCoins';

const EmailConfirmationListener = () => {
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    // Here we'll later implement the WebSocket logic to listen for the approval
    const simulateConfirmation = () => {
      setTimeout(() => {
        setIsConfirmed(true);
      }, 5000); // Simulate a 5-second wait for demonstration
    };

    simulateConfirmation();

    // Clean up function (will be replaced with WebSocket disconnect later)
    return () => clearTimeout(simulateConfirmation);
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
