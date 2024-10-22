import React, { useState } from 'react';
import Logo from '../../assets/img/logo.svg';
import { Link } from 'react-router-dom';
import FloatingCoins from '../FloatingCoins';
import AuthService from '../Services/AuthService';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }
    try {
      setIsLoading(true);
      const response = await AuthService.register(username, email, password);
      if (response.error) {
        setError(response.error);
      } else {
        console.log('Registration successful:', response);
        navigate('/email-confirmation');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setError('Registration failed ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-darkblue text-white overflow-hidden">
      <FloatingCoins />
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg animate-fade-in-down">
          {error}
        </div>
      )}
      <div className="backdrop-blur-md bg-darkblue/30 p-8 rounded-lg shadow-lg w-full max-w-md border border-white/20 z-10">
      <div className="flex flex-row items-center justify-center text-3xl font-bold text-center mb-6"><img src={Logo} alt='logo' className='h-10 inline-block ml-2'/></div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-3 py-2 bg-gray-700/50 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 bg-gray-700/50 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 bg-gray-700/50 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-3 py-2 bg-gray-700/50 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-md font-bold transition duration-300 disabled:bg-opacity-10 disabled:cursor-not-allowed"
          >
            {isLoading ? <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div> : 'Sign Up'}
          </button>
        </form>
        <div className="text-center my-4 text-gray-300">or</div>
        <div className="mt-4 text-center text-sm">
          <span className="text-gray-300">Already have an account? </span>
          <Link to="/login" className="hover:underline">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
