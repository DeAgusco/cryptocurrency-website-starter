// Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BalanceCard from './BalanceCard';
import RecentTransactions from './RecentTransactions';
import AssetDistribution from './AssetDistribution';
import ReceiveModal from './ReceiveModal';
import SendModal from './SendModal';
import SwapModal from './SwapModal';
import DashboardService from '../Services/DashboardService';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [coins, setCoins] = useState([]);
  const [trendingCoins, setTrendingCoins] = useState([]);
  const [showBalance, setShowBalance] = useState(true);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [walletData, setWalletData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  
  
  const handleSend = (address, amount) => {
    console.log(`Sending ${amount} to ${address}`);
    // Implement your send logic here
  };

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

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const wallet = await DashboardService.getWallet();
        setWalletData(wallet);
        
        const transactionsData = await DashboardService.getTransactions();
        setTransactions(transactionsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchWalletData();
  }, []);

  const toggleBalance = () => {
    setShowBalance(!showBalance);
  };


  return (
    <div className="p-6 bg-darkblue text-white">
      {/* ... (keep the existing JSX for Portfolio Value, Quick Actions, Recent Transactions) ... */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Portfolio Value Card */}
        <BalanceCard 
          balance={walletData?.balance} 
          showBalance={showBalance} 
          toggleBalance={toggleBalance} 
        />

        {/* Quick Actions Card */}
        <div className="relative backdrop-blur-md bg-darkblue/30 p-8 rounded-lg shadow-lg border border-white/20 z-10">
          <div className="relative z-10">
            <h2 className="text-xl text-center font-semibold mb-4 text-white">Quick Actions</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { name: 'Swap', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
                { name: 'Send', icon: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8' },
                { name: 'Receive', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' },
              ].map((action, index) => (
                <button key={index} 
                className="relative overflow-hidden rounded-xl p-4 hover:bg-opacity-30 transform hover:-translate-y-1 transition-all duration-200 shadow-lg" 
                onClick={action.name === 'Receive' ? () => setShowReceiveModal(true) : action.name === 'Send' ? () => setShowSendModal(true) : action.name === 'Swap' ? () => setShowSwapModal(true) : null}>
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
        <RecentTransactions transactions={transactions} />
      </div>
      {/* Asset Distribution Chart */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6'>
      <AssetDistribution walletData={walletData} />
      {/* Market Trends */}
      <div className="mt-8 relative backdrop-blur-md bg-darkblue/30 p-8 rounded-lg shadow-lg border border-white/20 z-10">
          <div className="relative z-10">
            <h2 className="text-xl font-semibold mb-4 text-white">Market Trends</h2>
            <div className="space-y-4">
              {trendingCoins.slice(0, 3).map((coin) => (
                <div key={coin.id} className="relative rounded-xl overflow-hidden bg-blue-500 bg-opacity-10 p-4">
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
      <div className="mt-8 relative backdrop-blur-md bg-darkblue/30 p-8 rounded-lg shadow-lg border border-white/20 z-10">
        <div className="relative z-10">
          <h2 className="text-xl font-semibold mb-4 text-white">Top Trending Coins</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingCoins.slice(0, 6).map((coin) => (
              <div key={coin.id} className="relative rounded-xl p-4 bg-blue-500 bg-opacity-10 overflow-hidden">
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
      <div className="mt-8 relative backdrop-blur-md bg-darkblue/30 p-8 rounded-lg shadow-lg border border-white/20 z-10">
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ReceiveModal
        isOpen={showReceiveModal}
        onClose={() => setShowReceiveModal(false)}
      />

      <SendModal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
        onSend={handleSend}
      />
      <SwapModal
        isOpen={showSwapModal}
        onClose={() => setShowSwapModal(false)}
      />
      
    </div>
  );
};

export default Dashboard;
