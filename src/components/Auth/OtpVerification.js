import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/img/logo.svg';
import FloatingCoins from '../FloatingCoins';
import AuthService from '../Services/AuthService';

const OtpVerification = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is supposed to be on this page
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      navigate('/login');
    }
    
    // Start countdown for resend option
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!otp.trim()) {
      setError('Please enter the OTP code');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      const response = await AuthService.verifyOtp(otp);
      console.log('OTP verification successful:', response);
      
      setSuccess('OTP verified successfully! Redirecting to dashboard...');
      
      // Short delay before redirect
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
    } catch (error) {
      console.error('OTP verification failed:', error);
      setError(error.message || 'OTP verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    
    try {
      setIsLoading(true);
      await AuthService.resendOtp();
      setSuccess('OTP resent successfully!');
      setCountdown(30);
      
      // Restart countdown
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);
      
    } catch (error) {
      console.error('Failed to resend OTP:', error);
      setError(error.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-darkblue text-white overflow-hidden">
      <FloatingCoins />
      
      
      
      <div className="backdrop-blur-md bg-darkblue/30 p-8 rounded-lg shadow-lg w-full max-w-md border border-white/20 z-10">
        <div className="flex flex-row items-center justify-center text-3xl font-bold text-center mb-6">
          <img src={Logo} alt='logo' className='h-10 inline-block ml-2'/>
        </div>
        
        <h2 className="text-xl font-bold text-center mb-6">Two-Factor Authentication</h2>
        <p className="text-center text-gray-300 mb-6">Enter the verification code sent to your email or authentication app</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP Code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            maxLength={6}
            className="w-full px-3 py-2 bg-gray-700/50 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-center text-xl tracking-widest"
          />
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-md font-bold transition duration-300 disabled:bg-opacity-10 disabled:cursor-not-allowed"
          >
            {isLoading ? <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div> : 'Verify OTP'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
            {error && (
            <div className="text-red-500 animate-fade-in-down">
                <p>{error}</p>
            </div>
            )}
            {success && (
            <div className="text-green-500 animate-fade-in-down">
                <p>{success}</p>
            </div>
            )}
          <button 
            onClick={handleResendOtp}
            disabled={countdown > 0 || isLoading}
            className="text-sm text-blue-400 hover:underline disabled:text-gray-500 disabled:no-underline"
          >
            {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend code'}
          </button>
        </div>
        
        <div className="mt-4 text-center">
          <button 
            onClick={() => AuthService.logout()}
            className="text-sm text-gray-400 hover:underline"
          >
            Cancel and Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification; 