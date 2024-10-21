import React from 'react';

const BalanceCard = ({ balance, showBalance, toggleBalance }) => {
  const formattedBalance = balance
    ? Number(balance).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    : '$0.00';

  return (
    <div className="bg-none md:backdrop-blur-md md:bg-darkblue/30 p-8 rounded-lg shadow-lg md:border md:border-white/20 z-10 h-40">
      <h2 className="text-xl font-semibold mb-4 text-white text-center">Account Balance</h2>
      <div className="flex flex-row justify-center items-center space-x-2">
        <p className={`text-3xl font-bold text-white balance-text`}>
          {showBalance ? formattedBalance : '********'}
        </p>
        <svg 
          className="w-6 h-6 text-white opacity-50 hover:opacity-100 cursor-pointer transition-opacity duration-200" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
          onClick={toggleBalance}
        >
          {showBalance ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          ) : (
            <>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </>
          )}
        </svg>
      </div>
    </div>
  );
};

export default BalanceCard;
