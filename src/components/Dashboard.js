// Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie,} from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [coins, setCoins] = useState([]);
  const [trendingCoins, setTrendingCoins] = useState([]);
  const [showBalance, setShowBalance] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all coin data
        const response = await axios.get('/.netlify/functions/coinGeckoProx?path=coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=true');
        setCoins(response.data);

        // Fetch trending coins
        const trendingResponse = await axios.get('/.netlify/functions/coinGeckoProx?path=search/trending');
        const trendingCoinsData = trendingResponse.data.coins.map(coin => ({
          ...coin.item,
          current_price: 0,
          price_change_percentage_24h: 0
        }));
        setTrendingCoins(trendingCoinsData);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const toggleBalance = () => {
    setShowBalance(!showBalance);
  };

  const assetDistributionData = {
    labels: ['Bitcoin', 'Ethereum', 'Cardano', 'Polkadot', 'Other'],
    datasets: [
      {
        data: [30, 25, 15, 10, 20],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: 'white'
        }
      }
    }
  };

  return (
    <div className="p-6 bg-darkblue text-white">
      {/* ... (keep the existing JSX for Portfolio Value, Quick Actions, Recent Transactions) ... */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Portfolio Value Card */}
        <div className="bg-none md:bg-blue-500 md:bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-2xl shadow p-6 h-40">
          <h2 className="text-xl font-semibold mb-4 text-white text-center">Account Balance</h2>
          <div className="flex flex-row justify-center items-center space-x-2">
            <p className="text-3xl font-bold text-white">
              {showBalance ? '$25,678.52' : '********'}
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
                <>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </>
              ) : (
                <>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </>
              )}
            </svg>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="relative bg-blue-500 bg-opacity-10 rounded-2xl shadow p-6 overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-semibold mb-4 text-white">Quick Actions</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { name: 'Sell', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                { name: 'Buy', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                { name: 'Swap', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
                { name: 'Deposit', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
                { name: 'Send', icon: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8' },
                { name: 'Cashout', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
              ].map((action, index) => (
                <button key={index} className="relative overflow-hidden rounded-xl p-4 hover:bg-opacity-30 transform hover:-translate-y-1 transition-all duration-200 shadow-lg">
                  <div className="relative z-10 flex flex-col items-center justify-center text-white">
                    <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                    </svg>
                    <span>{action.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions Card */}
        <div className="relative bg-blue-500 bg-opacity-10 rounded-2xl shadow p-6 overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-semibold mb-4 text-white">Recent Transactions</h2>
            <ul className="space-y-2">
              {[
                { action: 'Bought BTC', amount: '+0.0025 BTC', color: 'text-green-400' },
                { action: 'Sold ETH', amount: '-1.5 ETH', color: 'text-red-400' },
              ].map((transaction, index) => (
                <li key={index} className="relative rounded-xl p-4 overflow-hidden">
                  <div className="absolute inset-0 bg-darkblue opacity-20"></div>
                  <div className="absolute inset-0 backdrop-filter backdrop-blur-md"></div>
                  <div className="relative z-10 flex justify-between items-center text-white">
                    <span>{transaction.action}</span>
                    <span className={transaction.color}>{transaction.amount}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {/* Asset Distribution Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <div className="mt-8 relative bg-blue-500 h-96 bg-opacity-10 rounded-2xl shadow p-6 overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-semibold mb-4 text-white">Asset Distribution</h2>
            <div className="relative h-64 rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-darkblue opacity-20"></div>
              <div className="absolute inset-0 backdrop-filter backdrop-blur-md"></div>
              <div className="relative z-10 h-full">
                <Pie data={assetDistributionData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>

        {/* Market Trends */}
        <div className="mt-8 relative bg-blue-500 bg-opacity-10 rounded-2xl shadow p-6 overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-semibold mb-4 text-white">Market Trends</h2>
            <div className="space-y-4">
              {trendingCoins.slice(0, 3).map((coin) => (
                <div key={coin.id} className="relative rounded-xl overflow-hidden bg-darkblue bg-opacity-50 p-4">
                  <div className="flex justify-between items-center text-white mb-2">
                    <div className="flex items-center">
                      <img src={coin.thumb} alt={coin.name} className="w-6 h-6 mr-2" />
                      <span>{coin.name} ({coin.symbol.toUpperCase()})</span>
                    </div>
                    <span>${coin.current_price.toLocaleString()}</span>
                    <span className={coin.price_change_percentage_24h > 0 ? 'text-green-400' : 'text-red-400'}>
                      {coin.price_change_percentage_24h.toFixed(2)}%
                    </span>
                  </div>
                  <div className="h-20 mt-3">
                    <img 
                      src={`https://www.coingecko.com/coins/${coin.coin_id}/sparkline.svg`} 
                      alt={`${coin.name} price trend`}
                      className="w-full h-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Trending Coins */}
      <div className="mt-8 relative bg-blue-500 bg-opacity-10 rounded-2xl shadow p-6 overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-xl font-semibold mb-4 text-white">Top Trending Coins</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingCoins.slice(0, 6).map((coin) => (
              <div key={coin.id} className="relative rounded-xl p-4 overflow-hidden">
                <div className="relative z-10 flex items-center">
                  <img src={coin.thumb} alt={coin.name} className="w-10 h-10 mr-3" />
                  <div>
                    <h3 className="font-semibold">{coin.name}</h3>
                    <p className="text-sm text-gray-300">{coin.symbol.toUpperCase()}</p>
                  </div>
                  <div className="ml-auto">
                    <p className="text-sm">Rank: {coin.market_cap_rank}</p>
                    <p className="text-sm">
                      Score: {coin.score}
                    </p>
                  </div>
                </div>
                <div className="h-20 mt-3">
                  <img 
                    src={`https://www.coingecko.com/coins/${coin.coin_id}/sparkline.svg`} 
                    alt={`${coin.name} price trend`}
                    className="w-full h-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All Coins Table */}
      <div className="mt-8 relative bg-blue-500 bg-opacity-10 rounded-2xl shadow p-6 overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-xl font-semibold mb-4 text-white">All Coins</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-full table-auto">
              <thead className="hidden sm:table-header-group">
                <tr className="text-left text-white">
                  <th className="pb-2 pr-2">Coin</th>
                  <th className="pb-2 pr-2">Price</th>
                  <th className="pb-2 pr-2">24h Change</th>
                  <th className="pb-2 pr-2">Market Cap</th>
                  <th className="pb-2">Trade</th>
                </tr>
              </thead>
              <tbody>
                {coins.slice(0, 30).map((coin) => (
                  <tr key={coin.id} className="border-b border-gray-700 flex flex-col sm:table-row mb-4 sm:mb-0">
                    <td className="py-2 pr-2 flex items-center justify-between sm:table-cell">
                      <div className="flex items-center">
                        <img src={coin.image} alt={coin.name} className="w-6 h-6 mr-2" />
                        <span className="truncate max-w-[100px]">{coin.name}</span>
                      </div>
                      <span className="sm:hidden text-sm">${coin.current_price.toLocaleString()}</span>
                    </td>
                    <td className="pr-2 hidden sm:table-cell">${coin.current_price.toLocaleString()}</td>
                    <td className={`pr-2 ${coin.price_change_percentage_24h > 0 ? 'text-green-400' : 'text-red-400'} flex justify-between sm:table-cell`}>
                      <span className="sm:hidden text-sm">24h Change:</span>
                      <span className="text-sm">{coin.price_change_percentage_24h.toFixed(2)}%</span>
                    </td>
                    <td className="pr-2 flex justify-between sm:table-cell">
                      <span className="sm:hidden text-sm">Market Cap:</span>
                      <span className="text-sm">${coin.market_cap.toLocaleString()}</span>
                    </td>
                    <td className="sm:table-cell p-2">
                      <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Trade</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className='h-40 lg:h-16 bg-darkblue'></div>
    </div>
  );
};

export default Dashboard;