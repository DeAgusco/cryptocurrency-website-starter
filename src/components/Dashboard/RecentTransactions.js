import React from 'react';

const RecentTransactions = ({ transactions }) => {
  return (
    <div className="relative backdrop-blur-md bg-darkblue/30 p-8 rounded-lg shadow-lg border border-white/20 z-10">
      <div className="relative z-10">
        <h2 className="text-xl font-semibold mb-4 text-white">Recent Transactions</h2>
        {transactions.length > 0 ? (
          <ul className="space-y-2">
            {transactions.slice(0, 2).map((transaction, index) => (
              <li key={index} className="relative rounded-xl p-4 overflow-hidden">
                <div className="absolute inset-0 bg-darkblue opacity-20"></div>
                <div className="absolute inset-0 backdrop-filter backdrop-blur-md"></div>
                <div className="relative z-10 flex justify-between items-center text-white">
                  <span>{transaction.type}</span>
                  <span className={transaction.amount > 0 ? 'text-green-400' : 'text-red-400'}>
                    {transaction.amount > 0 ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-400">No recent transactions</p>
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;
