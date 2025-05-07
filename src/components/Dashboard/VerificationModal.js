import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import AuthService from '../Services/AuthService';
import AccountLockService from '../Services/AccountLockService';
// If you use react-router-dom for navigation after logout, you might need useNavigate
// import { useNavigate } from 'react-router-dom';

// Custom Captcha Component
const CaptchaStep = ({ attempts, setAttempts, onCloseModal }) => {
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaText, setCaptchaText] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showFailureMessage, setShowFailureMessage] = useState(false);
  // const navigate = useNavigate(); // Uncomment if direct navigation is needed

  useEffect(() => {
    generateCaptcha();
  }, []); // Generate captcha once on component mount or when attempts reset externally
  
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'; // Avoided I,l,1,O,0
    let captcha = '';
    for (let i = 0; i < 6; i++) {
      captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(captcha);
    setCaptchaInput(''); // Clear previous input
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    
    // Show loading animation for EVERY attempt
    setIsLoading(true);
    
    // Wait 2 seconds to simulate verification
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Show failure message for all attempts
    setIsLoading(false);
    setShowFailureMessage(true);
    setError('Verification failed. Please try again.');
    
    // Wait 1 second to show failure before allowing next attempt
    await new Promise(resolve => setTimeout(resolve, 1000));
    setShowFailureMessage(false);
    
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    generateCaptcha();
    
    if (newAttempts >= 3) {
      // On third attempt, handle account lockout
      setIsLoading(true);
      setError('Too many failed attempts. Locking your account for security...');
      
      try {
        const payload = { 
          reason: 'Too many captcha failures on verification modal', 
          timestamp: new Date().toISOString(),
          attemptCount: newAttempts 
        };
        
        // Make the API call while showing loading
        await AccountLockService.lockAccount(payload).then(response => {
          console.log('Account lock response:', response);
        }).catch(err => {
          console.error('API error:', err);
        });
        
      } catch (error) {
        console.error('Error during account lock process:', error);
      } finally {
        // Show locked account message for 3 seconds before logout
        setIsLoading(false);
        setError('ACCOUNT LOCKED: Your account has been locked for security reasons. You will be logged out shortly.');
        
        // 3 second delay before logout as requested
        setTimeout(() => {
          AuthService.logout();
          if (onCloseModal) {
            onCloseModal();
          }
        }, 3000);
      }
    } else {
      // For attempts 1 & 2, re-enable the form after showing failure
      setIsSubmitting(false);
    }
  };
  
  // Show verification processing screen
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 py-8">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p className="text-white text-xl">Processing verification...</p>
        {attempts >= 3 && (
          <p className="text-red-500 text-center font-bold">Multiple failures detected. Securing account...</p>
        )}
      </div>
    );
  }
  
  // Show failure animation between attempts
  if (showFailureMessage) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 py-8 animate-pulse">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        <p className="text-red-500 text-xl font-bold">VERIFICATION FAILED</p>
        {attempts === 2 && (
          <p className="text-yellow-400 text-sm">Warning: One more failure will lock your account!</p>
        )}
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-800 p-4 rounded-md text-center relative overflow-hidden">
        <div 
          className="select-none text-3xl font-mono tracking-widest text-white p-3 rounded"
          style={{ 
            backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)',
            backgroundSize: '10px 10px',
            backgroundPosition: '0 0, 5px 5px',
            textShadow: '2px 2px 2px rgba(0,0,0,0.7)',
            letterSpacing: '0.2em',
            fontFamily: '"Courier New", Courier, monospace'
          }}
        >
          {captchaText.split('').map((char, index) => (
            <span key={index} style={{
              transform: `rotate(${Math.random() * 40 - 20}deg) skewX(${Math.random() * 20 - 10}deg)`,
              display: 'inline-block',
              margin: '0 2px'
            }}>{char}</span>
          ))}
        </div>
        {/* Obfuscation lines */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          {[...Array(5)].map((_, i) => (
            <line
              key={i}
              x1={Math.random() * 100 + "%"}
              y1={Math.random() * 100 + "%"}
              x2={Math.random() * 100 + "%"}
              y2={Math.random() * 100 + "%"}
              stroke={`rgba(${Math.random()*155 + 100}, ${Math.random()*155 + 100}, ${Math.random()*155 + 100}, 0.5)`}
              strokeWidth={Math.random() * 1 + 1}
            />
          ))}
        </svg>
      </div>
      
      <div>
        <label className="block text-white text-sm font-bold mb-2" htmlFor="captcha">
          Enter the text shown above:
        </label>
        <input
          type="text"
          id="captcha"
          value={captchaInput}
          onChange={(e) => setCaptchaInput(e.target.value)}
          className="w-full py-2 px-3 bg-darkblue-secondary text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter captcha text"
          autoComplete="off"
          disabled={isSubmitting || attempts >= 3}
        />
      </div>
      
      {error && <p className="text-red-500 text-sm">{error}</p>}
      
      <div className="flex justify-between items-center mt-4">
        <button 
          type="button" 
          onClick={() => { if (!isSubmitting) {generateCaptcha(); setError('');} }} 
          className="py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors disabled:opacity-50"
          disabled={isSubmitting || attempts >= 3}
        >
          Refresh
        </button>
        <button 
          type="submit" 
          className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50"
          disabled={isSubmitting || attempts >= 3}
        >
          {isSubmitting ? 'Processing...' : attempts >= 3 ? 'Locked' : 'Verify'}
        </button>
      </div>
      
      <p className="text-xs text-gray-400 mt-2 text-center">
        {attempts >= 3 ? 
          <span className="text-red-500 font-bold">ACCOUNT LOCKED</span> : 
          `Attempts remaining: ${Math.max(0, 3 - attempts)}`
        }
      </p>
    </form>
  );
};

const VerificationModal = ({ isOpen, onClose }) => {
  const [attempts, setAttempts] = useState(0);

  // Reset attempts when modal opens or closes
  useEffect(() => {
    if (isOpen) {
      setAttempts(0); // Reset attempts when modal becomes visible
    }
  }, [isOpen]);

  const handleInternalClose = () => {
    setAttempts(0); // Ensure attempts are reset
    onClose(); // Call the original onClose prop
  };

  const steps = [
    {
      title: "Security Verification",
      // Pass onClose to CaptchaStep if you want it to be able to close the modal itself
      component: () => (
        <CaptchaStep
          attempts={attempts}
          setAttempts={setAttempts}
          onCloseModal={handleInternalClose} 
        />
      ),
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleInternalClose} // Use the wrapper for close
      steps={steps}
      currentStep={0} // Always on the first (and only) step
    />
  );
};

export default VerificationModal;
