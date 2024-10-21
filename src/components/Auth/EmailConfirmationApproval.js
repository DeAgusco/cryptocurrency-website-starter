import React, { useState } from 'react';
import Logo from '../../assets/img/logo.svg';
import FloatingCoins from '../FloatingCoins';
import AuthService from '../Services/AuthService';

const EmailConfirmationApproval = () => {
  const [isApproving, setIsApproving] = useState(false);
  const [error, setError] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleApprove = async () => {
    setIsApproving(true);
    try {

      const activation_token = window.location.pathname.split('/').pop();
      const response = await AuthService.verify(activation_token);
      console.log('Email confirmation approved:', response);
      setIsConfirmed(true);
    } catch (error) {
      console.error('Failed to approve email confirmation:', error);
      setError('Failed to approve email confirmation. ' + error.message);
    } finally {
      setTimeout(() => {
        setIsApproving(false);
      }, 4000);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-darkblue text-white overflow-hidden">
      <FloatingCoins />
      <div className="backdrop-blur-md bg-darkblue/30 p-8 rounded-lg shadow-lg w-full max-w-md border border-white/20 z-10">
        <div className="flex flex-row items-center justify-center text-3xl font-bold text-center mb-6">
          <img src={Logo} alt='logo' className='h-10 inline-block ml-2'/>
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">Confirm Your Email</h2>
        <p className="text-center mb-6">Please click the button below to confirm your email address.</p>
        {error && <p className="text-red-500 text-center mb-6">{error}</p>}
        <button
          onClick={handleApprove}
          disabled={isApproving || isConfirmed}
          className={`w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-md font-bold text-white transition duration-300 disabled:bg-gray-500/50 disabled:cursor-not-allowed ${isConfirmed ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isApproving ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          ) : isConfirmed ? (
            <>
              <svg className="w-6 h-6 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Email Confirmed
            </>
          ) : (
            'Confirm Email'
          )}
        </button>
      </div>
    </div>
  );
};

export default EmailConfirmationApproval;
