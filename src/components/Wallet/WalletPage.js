import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import WalletService from '../Services/WalletService';
import ReceiveModal from '../Dashboard/ReceiveModal';
import { BitcoinIcon, EthereumIcon, LitecoinIcon, DogecoinIcon, UsdtIcon, XrpIcon, ShibIcon, AdaIcon, BnbIcon, DotIcon, UsdcIcon, XlmIcon, TrxIcon} from '../Auth/CoinIcons';
import DashboardService from '../Services/DashboardService';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

// Helper for responsive price formatting
const formatPrice = (price, isMobile = false) => {
  return price.toLocaleString('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: isMobile ? 0 : 2,
    maximumFractionDigits: isMobile ? 0 : 2
  });
};

const getCoinIcon = (coin) => {
  switch (coin) {
    case 'BTC': return <BitcoinIcon />;
    case 'ETH': return <EthereumIcon />;
    case 'LTC': return <LitecoinIcon />;
    case 'DOGE': return <DogecoinIcon />;
    case 'USDT': return <UsdtIcon />;
    case 'XRP': return <XrpIcon />;
    case 'SHIB': return <ShibIcon />;
    case 'ADA': return <AdaIcon />;
    case 'BNB': return <BnbIcon />;
    case 'DOT': return <DotIcon />;
    case 'USDC': return <UsdcIcon />;
    case 'XLM': return <XlmIcon />;
    case 'TRX': return <TrxIcon />;
    default: return null;
  }
};

const WalletPage = () => {
  const [wallets, setWallets] = useState([]);
  const [expandedWallets, setExpandedWallets] = useState({});
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState('');
  const [walletData, setWalletData] = useState(null);
  const [showBalance, setShowBalance] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('balance'); // 'balance', 'name', 'value'
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc', 'desc'

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        setLoading(true);
        const wallet = await DashboardService.getWallet();
        setWalletData(wallet);
        const fetchedWallets = await WalletService.getWallets();
        setWallets(fetchedWallets);
      } catch (error) {
        console.error('Error fetching wallets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWallets();
  }, []);

  const toggleBalance = () => {
    setShowBalance(!showBalance);
  };

  const handleToggleAddresses = (walletId) => {
    setExpandedWallets(prev => ({
      ...prev,
      [walletId]: !prev[walletId]
    }));
  };

  const handleReceive = (coin) => {
    setSelectedCoin(coin);
    setIsReceiveModalOpen(true);
  };

  const handleSend = (coin) => {
    // Handle send functionality
    console.log(`Send ${coin}`);
  };

  const handleSwap = (coin) => {
    // Handle swap functionality
    console.log(`Swap ${coin}`);
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const handleSort = (criteria) => {
    if (sortBy === criteria) {
      toggleSortDirection();
    } else {
      setSortBy(criteria);
      setSortDirection('desc');
    }
  };

  const filteredWallets = wallets.filter(wallet => {
    // Filter by search query
    if (searchQuery && !wallet.coin.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by active tab
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return parseFloat(wallet.balance) > 0;
    if (activeTab === 'inactive') return parseFloat(wallet.balance) <= 0;
    
    return true;
  });

  const sortedWallets = [...filteredWallets].sort((a, b) => {
    if (sortBy === 'name') {
      return sortDirection === 'asc' 
        ? a.coin.localeCompare(b.coin) 
        : b.coin.localeCompare(a.coin);
    }
    if (sortBy === 'balance') {
      return sortDirection === 'asc' 
        ? parseFloat(a.balance) - parseFloat(b.balance) 
        : parseFloat(b.balance) - parseFloat(a.balance);
    }
    if (sortBy === 'value') {
      return sortDirection === 'asc' 
        ? parseFloat(a.balance_usd) - parseFloat(b.balance_usd) 
        : parseFloat(b.balance_usd) - parseFloat(a.balance_usd);
    }
    return 0;
  });

  const totalBalance = wallets.reduce((sum, wallet) => sum + parseFloat(wallet.balance_usd || 0), 0);
  
  // Calculate portfolio allocation percentages
  const portfolioAllocation = wallets
    .filter(wallet => parseFloat(wallet.balance_usd) > 0)
    .map(wallet => ({
      coin: wallet.coin,
      percentage: (parseFloat(wallet.balance_usd) / totalBalance) * 100
    }))
    .sort((a, b) => b.percentage - a.percentage);

  if (loading) {
  return (
      <div className="min-h-screen bg-gradient-to-br from-black to-darkblue text-white p-8">
        <div className="animate-pulse">
          <div className="h-32 bg-white/5 rounded-3xl mb-8"></div>
          <div className="flex gap-4 mb-8">
            <div className="h-12 bg-white/5 rounded-xl w-20"></div>
            <div className="h-12 bg-white/5 rounded-xl w-20"></div>
            <div className="h-12 bg-white/5 rounded-xl w-20"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-white/5 rounded-3xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-darkblue text-white p-8">
      {/* Hero section with total balance */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-3xl p-8 mb-8 backdrop-blur-lg border border-white/10 shadow-[0_0_15px_rgba(101,121,248,0.3)]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-medium text-blue-100 mb-2">Total Balance</h2>
            <div className="flex items-center space-x-3">
              <p className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                {showBalance 
                  ? `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : '********'
                }
              </p>
              <button 
                onClick={toggleBalance}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                {showBalance ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className="hidden lg:block">
            <h3 className="text-xl font-medium text-blue-100 mb-4">Portfolio Allocation</h3>
            <div className="flex flex-col space-y-2">
              {portfolioAllocation.slice(0, 4).map(item => (
                <div key={item.coin} className="flex items-center space-x-2">
                  <div className="w-8 h-8">{getCoinIcon(item.coin)}</div>
                  <div className="flex-1">
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-full" 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium">{item.percentage.toFixed(1)}%</span>
                  <span className="text-sm font-medium">{item.coin}</span>
                </div>
              ))}
              {portfolioAllocation.length > 4 && (
                <div className="text-xs text-blue-300 text-right mt-1">
                  +{portfolioAllocation.length - 4} more
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -bottom-12 -right-12 w-56 h-56 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-12 -left-12 w-56 h-56 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Action buttons and filters */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setActiveTab('all')} 
            className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
              activeTab === 'all' 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                : 'bg-white/5 hover:bg-white/10 text-white/70'
            }`}
          >
            All Assets
          </button>
          <button 
            onClick={() => setActiveTab('active')} 
            className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
              activeTab === 'active' 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                : 'bg-white/5 hover:bg-white/10 text-white/70'
            }`}
          >
            Active
          </button>
          <button 
            onClick={() => setActiveTab('inactive')} 
            className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
              activeTab === 'inactive' 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                : 'bg-white/5 hover:bg-white/10 text-white/70'
            }`}
          >
            Zero Balance
          </button>
        </div>
        <div className="relative w-full lg:w-auto">
          <input
            type="text"
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full lg:w-64 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          <svg className="absolute right-3 top-3 w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>

      {/* Sort options */}
      <div className="hidden lg:flex items-center bg-white/5 rounded-xl mb-4 p-2 text-sm">
        <div className="flex-1 px-4 py-2 flex items-center">
          <button onClick={() => handleSort('name')} className="flex items-center">
            Asset
            {sortBy === 'name' && (
              <svg className={`w-4 h-4 ml-1 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path>
              </svg>
            )}
          </button>
        </div>
        <div className="flex-1 px-4 py-2 flex items-center">
          <button onClick={() => handleSort('balance')} className="flex items-center">
            Balance
            {sortBy === 'balance' && (
              <svg className={`w-4 h-4 ml-1 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path>
              </svg>
            )}
          </button>
        </div>
        <div className="flex-1 px-4 py-2 flex items-center">
          <button onClick={() => handleSort('value')} className="flex items-center">
            Value
            {sortBy === 'value' && (
              <svg className={`w-4 h-4 ml-1 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path>
              </svg>
            )}
          </button>
        </div>
        <div className="w-1/4 px-4 py-2">
          Actions
        </div>
      </div>

      {/* Wallets */}
      <div className="space-y-4">
        {sortedWallets.length === 0 ? (
          <div className="py-12 text-center bg-white/5 rounded-3xl">
            <svg className="w-16 h-16 mx-auto text-white/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <h3 className="text-xl font-medium text-white/70">No assets found</h3>
            <p className="text-white/50 mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          sortedWallets.map(wallet => (
            <div 
              key={wallet.id}
              className="bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 backdrop-blur-md rounded-3xl transition-all duration-300 group relative overflow-hidden"
            >
              {/* Desktop view */}
              <div className="hidden lg:flex items-center p-6">
                <div className="flex-1 flex items-center">
                  <div className="w-12 h-12 mr-4 flex items-center justify-center">
                    {getCoinIcon(wallet.coin)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{wallet.coin}</h3>
                    <p className="text-sm text-white/60">{formatPrice(parseFloat(wallet.exchange_rate), false)}</p>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-xl font-medium">{parseFloat(wallet.balance).toLocaleString('en-US')} {wallet.coin}</p>
                </div>
                <div className="flex-1">
                  <p className="text-xl font-medium text-green-400">
                    {formatPrice(parseFloat(wallet.balance_usd), false)}
                  </p>
                </div>
                <div className="w-1/4 flex items-center justify-end space-x-3">
                  <button 
                    onClick={() => handleReceive(wallet.coin)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-green-500/80 text-white/80 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleSend(wallet.coin)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-blue-500/80 text-white/80 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"></path>
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleSwap(wallet.coin)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-purple-500/80 text-white/80 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleToggleAddresses(wallet.id)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Mobile view */}
              <div className="lg:hidden p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 mr-3">{getCoinIcon(wallet.coin)}</div>
                    <div>
                      <h3 className="text-lg font-semibold">{wallet.coin}</h3>
                      <p className="text-xs text-white/60">{formatPrice(parseFloat(wallet.exchange_rate), true)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-medium">{parseFloat(wallet.balance).toLocaleString('en-US')} {wallet.coin}</p>
                    <p className="text-sm font-medium text-green-400">
                      {formatPrice(parseFloat(wallet.balance_usd), true)}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <button 
                    onClick={() => handleToggleAddresses(wallet.id)}
                    className="text-sm text-blue-400 underline"
                  >
                    {expandedWallets[wallet.id] ? 'Hide Addresses' : 'Show Addresses'}
                  </button>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleReceive(wallet.coin)}
                      className="p-1.5 rounded-lg bg-green-500/20 text-green-400"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleSend(wallet.coin)}
                      className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"></path>
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleSwap(wallet.coin)}
                      className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Address list (expanded view) */}
              {expandedWallets[wallet.id] && (
                <div className="px-6 pb-6 -mt-2">
                  <div className="border-t border-white/10 pt-4 space-y-3">
                    {wallet.address.length > 0 ? (
                      wallet.address.map((addressObj, index) => (
                        <div key={index} className="bg-white/5 p-4 rounded-xl flex items-center justify-between">
                          <p className="text-white/90 font-mono text-sm break-all">{addressObj.address}</p>
                          <button className="ml-2 p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-white/50">
                        No addresses found for this wallet
                      </div>
                    )}
                    <button 
                      onClick={() => handleReceive(wallet.coin)}
                      className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-medium text-white transition-all"
                    >
                      Generate New Address
                    </button>
                  </div>
                </div>
              )}

              {/* Decorative elements */}
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          ))
      )}
      </div>

      <ReceiveModal
        isOpen={isReceiveModalOpen}
        onClose={() => setIsReceiveModalOpen(false)}
        initialCoin={selectedCoin}
      />
    </div>
  );
};

export default WalletPage;
