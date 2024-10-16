import React from 'react';

const MiningStats = () => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Mining Stats</h2>
      <div className="space-y-2">
        <p>Hashrate: 45 MH/s</p>
        <p>Active Workers: 3</p>
        <p>24h Earnings: 0.0025 ETH</p>
      </div>
    </div>
  );
};

export default MiningStats;
