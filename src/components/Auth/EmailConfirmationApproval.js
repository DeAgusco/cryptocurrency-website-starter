import React, { useState } from 'react';
import Logo from '../../assets/img/logo.svg';
import FloatingCoins from '../FloatingCoins';

const EmailConfirmationApproval = () => {
  const [isApproving, setIsApproving] = useState(false);

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      // Here we'll later implement the WebSocket logic to send the approval
      console.log('Approval sent');
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (error) {
      console.error('Failed to send approval:', error);
    }
    setIsApproving(false);
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
        <button
          onClick={handleApprove}
          disabled={isApproving}
          className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-md font-bold text-white transition duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {isApproving ? 'Confirming...' : 'Confirm Email'}
        </button>
      </div>
    </div>
  );
};

export default EmailConfirmationApproval;
