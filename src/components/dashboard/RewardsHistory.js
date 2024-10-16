import React from 'react';

const RewardsHistory = () => {
  const rewards = [
    { date: '2023-05-01', amount: '0.0012 ETH' },
    { date: '2023-04-30', amount: '0.0015 ETH' },
    { date: '2023-04-29', amount: '0.0011 ETH' },
  ];

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Rewards History</h2>
      <ul className="space-y-2">
        {rewards.map((reward, index) => (
          <li key={index} className="flex justify-between">
            <span>{reward.date}</span>
            <span>{reward.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RewardsHistory;