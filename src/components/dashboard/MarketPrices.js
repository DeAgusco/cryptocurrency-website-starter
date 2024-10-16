import React from 'react';

const MarketPrices = () => {
  const prices = [
    { coin: 'ETH', price: '$1,800.00' },
    { coin: 'BTC', price: '$28,500.00' },
    { coin: 'LTC', price: '$80.00' },
  ];

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Market Prices</h2>
      <ul className="space-y-2">
        {prices.map((price, index) => (
          <li key={index} className="flex justify-between">
            <span>{price.coin}</span>
            <span>{price.price}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MarketPrices;