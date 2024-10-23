import React, { useState } from 'react';
import AuthService from '../Services/AuthService';

const EmailInputStep = ({ onNext, error }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
    // Assuming you have a method in AuthService to handle email submission
        const response = await AuthService.sendPasswordResetEmail(email);
        
        if (response.message !== "We could not find your email") {
            console.log('Email found');
            console.log('Response:', response);
        onNext(null);
        } else {
            onNext('Email not found');
            console.error('Email not found');
        }
        } catch (error) {
        console.error('Email submission failed:', error);
        onNext('Email submission failed. ' + error.message);
        } finally {
        setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-3 py-2 bg-gray-700/50 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-md font-bold transition duration-300 disabled:bg-opacity-10 disabled:cursor-not-allowed"
      >
        {isLoading ? <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div> : 'Submit'}
      </button>
    </form>
  );
};

export default EmailInputStep;