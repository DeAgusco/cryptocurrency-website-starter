import React from 'react';

const WalletBalance = () => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Wallet Balance</h2>
      <p className="text-2xl font-bold">0.1337 ETH</p>
      <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
        Withdraw
      </button>
    </div>
  );
};

export default WalletBalance;