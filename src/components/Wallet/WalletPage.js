import React, { useState, useEffect, useMemo } from 'react';
import useSWR from 'swr';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from 'chart.js';
import ReceiveModal from '../Dashboard/ReceiveModal';
import DashboardService from '../Services/DashboardService';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/';

const fetcher = url => axios.get(url).then(res => res.data);

const authedFetcher = async (url) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('User not authenticated. Token not found.');
  }
  const response = await axios.get(url, {
    headers: {
      'Authorization': `Token ${token}`
    }
  });
  return response.data;
};

// Helper for responsive price formatting
const formatPrice = (price, isMobile = false) => {
  return price.toLocaleString('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 3
  });
};

const WalletPage = () => {
  const [wallets, setWallets] = useState([]);
  const [expandedWallets, setExpandedWallets] = useState({});
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState('');
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('balance');
  const [sortDirection, setSortDirection] = useState('desc');
  const [coinImageUrls, setCoinImageUrls] = useState({});

  const supportedCoinsForImages = useMemo(() => [
    { id: 'bitcoin', symbol: 'BTC' },
    { id: 'ethereum', symbol: 'ETH' },
    { id: 'litecoin', symbol: 'LTC' },
    { id: 'dogecoin', symbol: 'DOGE' },
    { id: 'tether', symbol: 'USDT' },
    { id: 'ripple', symbol: 'XRP' },
    { id: 'shiba-inu', symbol: 'SHIB' },
    { id: 'cardano', symbol: 'ADA' },
    { id: 'binancecoin', symbol: 'BNB' },
    { id: 'polkadot', symbol: 'DOT' },
    { id: 'usd-coin', symbol: 'USDC' },
    { id: 'stellar', symbol: 'XLM' },
    { id: 'tron', symbol: 'TRX' },
  ], []);

  const coinGeckoApiUrl = supportedCoinsForImages.length > 0 
    ? `/.netlify/functions/coinGeckoProx?path=coins/markets?vs_currency=usd&ids=${supportedCoinsForImages.map(c => c.id).join(',')}&sparkline=false`
    : null;

  const { 
    data: swrCoinData, 
    error: swrCoinError, 
    isValidating: coinImagesIsValidating 
  } = useSWR(
    coinGeckoApiUrl, 
    fetcher, 
    {
      dedupingInterval: 300000,
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    if (swrCoinData) {
      const imageUrls = {};
      const dataToProcess = Array.isArray(swrCoinData) ? swrCoinData : Object.entries(swrCoinData).map(([key, value]) => ({ symbol: key, image: value }));
      dataToProcess.forEach(coin => {
        if (coin.symbol) {
          imageUrls[coin.symbol.toLowerCase()] = coin.image;
        } else if (coin.id) {
          const foundCoin = supportedCoinsForImages.find(c => c.id === coin.id);
          if (foundCoin) {
            imageUrls[foundCoin.symbol.toLowerCase()] = coin.image;
          }
        }
      });
      setCoinImageUrls(imageUrls);
    }
    if (swrCoinError) {
      console.error('Error fetching coin images with SWR:', swrCoinError);
      setCoinImageUrls({});
    }
  }, [swrCoinData, swrCoinError, supportedCoinsForImages]);
  
  const walletsApiUrl = `${API_URL}/wallets/`;
  const { 
    data: swrWalletsData, 
    error: swrWalletsError, 
    isValidating: walletsIsValidating 
  } = useSWR(
    walletsApiUrl, 
    authedFetcher, 
    {
      revalidateOnFocus: true,
    }
  );

  useEffect(() => {
    if (swrWalletsData) {
      setWallets(swrWalletsData);
    } else if (swrWalletsError) {
      console.error('Error fetching wallets with SWR:', swrWalletsError);
      setWallets([]); 
    } else if (swrWalletsData === undefined && walletsIsValidating) {
      setWallets([]);
    }
    else if (swrWalletsData === undefined && !walletsIsValidating && !swrWalletsError) {
        if (!Array.isArray(wallets)) setWallets([]);
    }
  }, [swrWalletsData, swrWalletsError, walletsIsValidating, wallets]);

  useEffect(() => {
    const ensureMainWallet = async () => {
      try {
        await DashboardService.getWallet();
      } catch (error) {
        // console.error("Error calling DashboardService.getWallet() for warm-up:", error);
      }
    };
    if (isAuthenticated()) {
        ensureMainWallet();
    }
  }, []);
  
  const isAuthenticated = () => !!localStorage.getItem('token');

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

  const filteredWallets = Array.isArray(wallets) ? wallets.filter(wallet => {
    if (searchQuery && !wallet.coin.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return parseFloat(wallet.balance) > 0;
    if (activeTab === 'inactive') return parseFloat(wallet.balance) <= 0;
    return true;
  }) : [];

  const sortedWallets = [...filteredWallets].sort((a, b) => {
    if (sortBy === 'name') {
      return a.coin.localeCompare(b.coin) * (sortDirection === 'asc' ? 1 : -1);
    }
    if (sortBy === 'balance') {
      return (parseFloat(a.balance) - parseFloat(b.balance)) * (sortDirection === 'asc' ? 1 : -1);
    }
    if (sortBy === 'value') {
      return (parseFloat(a.balance_usd) - parseFloat(b.balance_usd)) * (sortDirection === 'asc' ? 1 : -1);
    }
    return 0;
  });

  const totalBalance = Array.isArray(wallets) ? wallets.reduce((sum, wallet) => sum + parseFloat(wallet.balance_usd || 0), 0) : 0;
  
  const portfolioAllocation = useMemo(() => {
    if (!Array.isArray(wallets)) return [];
    return wallets
      .filter(wallet => parseFloat(wallet.balance_usd) > 0)
      .map(wallet => ({
        coin: wallet.coin,
        percentage: totalBalance > 0 ? (parseFloat(wallet.balance_usd) / totalBalance) * 100 : 0,
        imageUrl: coinImageUrls[wallet.coin.toLowerCase()] || ''
      }))
      .sort((a, b) => b.percentage - a.percentage);
  }, [wallets, totalBalance, coinImageUrls]);

  const isPageLoading = 
    (swrWalletsData === undefined && !swrWalletsError && walletsIsValidating) || 
    (swrCoinData === undefined && !swrCoinError && coinImagesIsValidating);

  if (isPageLoading) {
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
              <p className="text-2xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
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
                  <img 
                    src={item.imageUrl} 
                    alt={item.coin} 
                    className="w-8 h-8 rounded-full"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
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
        {sortedWallets.length === 0 && !isPageLoading ? (
          <div className="py-12 text-center bg-white/5 rounded-3xl">
            <svg className="w-16 h-16 mx-auto text-white/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <h3 className="text-xl font-medium text-white/70">No assets found</h3>
            <p className="text-white/50 mt-2">Try adjusting your search or filters, or wait for assets to load.</p>
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
                  <img 
                    src={coinImageUrls[wallet.coin.toLowerCase()]} 
                    alt={wallet.coin} 
                    className="w-12 h-12 mr-4 rounded-full" 
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{wallet.coin}</h3>
                    <p className="text-sm text-white/60">{wallet.exchange_rate ? formatPrice(parseFloat(wallet.exchange_rate), false) : "N/A"}</p>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-xl font-medium">{parseFloat(wallet.balance).toLocaleString('en-US')} {wallet.coin}</p>
                </div>
                <div className="flex-1">
                  <p className="text-xl font-medium text-green-400">
                    {wallet.balance_usd ? formatPrice(parseFloat(wallet.balance_usd), false) : "N/A"}
                  </p>
                </div>
                <div className="w-1/4 flex items-center justify-end space-x-3" onClick={() => handleReceive(wallet.coin)}>
                  <button 
                    onClick={() => handleReceive(wallet.coin)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-green-500/80 text-white/80 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="#10B981" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Mobile view */}
              <div className="lg:hidden p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <img 
                      src={coinImageUrls[wallet.coin.toLowerCase()]} 
                      alt={wallet.coin} 
                      className="w-10 h-10 mr-3 rounded-full"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{wallet.coin}</h3>
                      <p className="text-xs text-white/60">{wallet.exchange_rate ? formatPrice(parseFloat(wallet.exchange_rate), true) : "N/A"}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-medium">{parseFloat(wallet.balance).toLocaleString('en-US')} {wallet.coin}</p>
                    <p className="text-sm font-medium text-green-400">
                      {wallet.balance_usd ? formatPrice(parseFloat(wallet.balance_usd), true) : "N/A"}
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
                  <div className="flex space-x-2" onClick={() => handleReceive(wallet.coin)}>
                    <button 
                      onClick={() => handleReceive(wallet.coin)}
                      className="p-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Address list (expanded view) */}
              {expandedWallets[wallet.id] && (
                <div className="px-6 pb-6 -mt-2">
                  <div className="border-t border-white/10 pt-4 space-y-3">
                    {wallet.address && wallet.address.length > 0 ? (
                      wallet.address.map((addressObj, index) => (
                        <div key={index} className="bg-white/5 p-4 rounded-xl flex items-center justify-between">
                          <div className="bg-white/5 p-4 rounded-xl break-all text-sm mb-4 text-white border border-white/10 relative overflow-hidden">
                            <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
                            <div className="relative z-10">
                              {addressObj.address}
                            </div>
                          </div>
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
