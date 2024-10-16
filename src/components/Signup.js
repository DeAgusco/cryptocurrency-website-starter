import React, { useState } from 'react';
import Web3 from 'web3';
import Logo from '../assets/img/logo.svg';
import { Link } from 'react-router-dom';


const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    // Handle form submission (e.g., create user account)
    console.log('Sign up with:', email, password);
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        console.log('Wallet connected:', accounts[0]);
      } else {
        alert('Please install MetaMask to connect your wallet');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
    setIsConnecting(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="backdrop-blur-md bg-white/10 p-8 rounded-lg shadow-lg w-full max-w-md border border-white/20">
      <div className="flex flex-row items-center justify-center text-3xl font-bold text-center mb-6"><img src={Logo} alt='logo' className='h-10 inline-block ml-2'/></div>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-md font-bold transition duration-300"
          >
            Sign Up
          </button>
        </form>
        <div className="text-center my-4 text-gray-300">or</div>
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-md font-bold text-white transition duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
        <div className="mt-4 text-center text-sm">
          <span className="text-gray-300">Already have an account? </span>
          <Link to="/login" className="hover:underline">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
