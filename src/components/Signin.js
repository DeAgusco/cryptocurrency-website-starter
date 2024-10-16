import React, { useState } from 'react';
import Logo from '../assets/img/logo.svg';
import Web3 from 'web3';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission (e.g., authenticate user)
    console.log('Sign in with:', email, password);
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
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-md font-bold transition duration-300"
          >
            Sign In
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
        <div className="mt-4 flex justify-between text-sm">
          <a href="/forgot-password" className="hover:underline">Forgot Password?</a>
          <a href="/signup" className="hover:underline">Create an Account</a>
        </div>
      </div>
    </div>
  );
};

export default Signin;
