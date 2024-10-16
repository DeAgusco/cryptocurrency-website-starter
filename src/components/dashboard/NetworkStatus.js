import React from 'react';

const NetworkStatus = () => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Network Status</h2>
      <p>Network: Ethereum Mainnet</p>
      <p>Difficulty: 12.5 TH</p>
      <p>Block Height: 17,234,567</p>
    </div>
  );
};

export default NetworkStatus;