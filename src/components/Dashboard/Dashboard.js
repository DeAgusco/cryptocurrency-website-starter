// Dashboard.js
import React, { useState, useEffect, useMemo } from 'react';
import useSWR from 'swr';
import { useDashboardWalletData, useDashboardTransactionsData } from '../Services/DashboardService';
import AssetDistribution from './AssetDistribution';
import ReceiveModal from './ReceiveModal';
import SendModal from './SendModal';
import SwapModal from './SwapModal';
import ComingSoonModal from './ComingSoonModal';
import coinGeckoFetcher from '../../utils/coinGeckoFetcher';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

// --- Fetcher function for unauthenticated CoinGecko calls ---

// Helper for responsive price formatting
const formatPrice = (price, isMobile = false) => {
  if (typeof price !== 'number' || isNaN(price)) {
    return 'N/A'; // Or some other placeholder like $0.00
  }
  return price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: price < 0.01 ? 6 : (price < 1 ? 4 : 2) // More precision for smaller values
  });
};

// --- Skeleton Components ---
const SkeletonTextLine = ({ width = 'w-full', height = 'h-4', className = '' }) => (
  <div className={`bg-white/5 animate-pulse rounded-md ${width} ${height} ${className}`}></div>
);

const SkeletonBalanceDisplay = () => (
  <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-4 sm:p-6 lg:p-8 rounded-3xl shadow-[0_0_15px_rgba(101,121,248,0.2)] backdrop-blur-lg border border-white/10 animate-pulse">
    <SkeletonTextLine width="w-1/3" height="h-5 sm:h-6" className="mb-3 sm:mb-4" />
    <SkeletonTextLine width="w-2/3" height="h-8 sm:h-10" className="mb-2" />
    <SkeletonTextLine width="w-1/4" height="h-3 sm:h-4" />
  </div>
);

const SkeletonTransactionItem = () => (
  <div className="bg-white/5 rounded-xl p-3 sm:p-4 animate-pulse mb-3 flex">
    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 mr-2 sm:mr-3"></div>
    <div className="flex-1">
      <SkeletonTextLine width="w-1/3" height="h-3 sm:h-4" className="mb-2" />
      <SkeletonTextLine width="w-2/3" height="h-2 sm:h-3" />
    </div>
    <div className="w-16 sm:w-20">
      <SkeletonTextLine width="w-full" height="h-3 sm:h-4" className="mb-2" />
      <SkeletonTextLine width="w-2/3" height="h-2 sm:h-3" />
    </div>
  </div>
);

const SkeletonActionCard = () => (
  <div className="bg-white/5 rounded-xl p-3 sm:p-4 animate-pulse flex flex-col items-center justify-center h-24 sm:h-32">
    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 mb-2"></div>
    <SkeletonTextLine width="w-12 sm:w-16" height="h-3 sm:h-4" className="mb-2" />
    <SkeletonTextLine width="w-20 sm:w-24" height="h-2 sm:h-3" />
  </div>
);

const SkeletonCoinItem = () => (
  <div className="bg-white/5 rounded-xl p-3 sm:p-4 animate-pulse mb-3">
    {/* Desktop layout */}
    <div className="hidden sm:flex items-center">
      <div className="w-10 h-10 rounded-full bg-white/10 mr-3"></div>
      <div className="flex-1">
        <SkeletonTextLine width="w-20" height="h-4" className="mb-2" />
        <SkeletonTextLine width="w-16" height="h-3" />
      </div>
      <div className="w-24 text-right">
        <SkeletonTextLine width="w-full" height="h-4" className="mb-2" />
        <SkeletonTextLine width="w-16 ml-auto" height="h-3" />
      </div>
    </div>
    
    {/* Mobile layout */}
    <div className="sm:hidden">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-white/10 mr-2"></div>
          <SkeletonTextLine width="w-16" height="h-3" />
        </div>
        <SkeletonTextLine width="w-16" height="h-3" />
      </div>
      <div className="flex justify-between items-center">
        <SkeletonTextLine width="w-12" height="h-2" />
        <SkeletonTextLine width="w-20" height="h-2" />
      </div>
    </div>
  </div>
);
// --- End Skeleton Components ---

const Dashboard = () => {
  const [coins, setCoins] = useState([]);
  const [trendingCoins, setTrendingCoins] = useState([]);
  const [showBalance, setShowBalance] = useState(true);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [comingSoonFeature, setComingSoonFeature] = useState('');
  const [walletData, setWalletData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [adjustedWalletDataForChart, setAdjustedWalletDataForChart] = useState(null);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [visibleCoinsCount, setVisibleCoinsCount] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  // Force disable loading after 5 seconds
  const [forceDisableLoading, setForceDisableLoading] = useState(false);

  // --- SWR Hooks for CoinGecko Data ---
  const { data: coinsApiData, error: coinsError } = useSWR(
    '/.netlify/functions/coinGeckoProx?path=coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=true',
    coinGeckoFetcher,
    { 
      dedupingInterval: 60000, // 1 minute
      revalidateOnFocus: false
    }
  );
  const { data: trendingApiData, error: trendingError } = useSWR(
    '/.netlify/functions/coinGeckoProx?path=search/trending',
    coinGeckoFetcher,
    { 
      dedupingInterval: 60000, // 1 minute
      revalidateOnFocus: false
    }
  );
  // --- End SWR Hooks for CoinGecko Data ---

  // --- SWR Hooks for Authenticated Data (using custom hooks from DashboardService) ---
  const { walletData: walletApiDataFromHook, walletError, isLoadingWallet } = useDashboardWalletData();
  const { transactionsData: transactionsApiDataFromHook, transactionsError, isLoadingTransactions } = useDashboardTransactionsData();
  // --- End SWR Hooks for Authenticated Data ---

  // Debug logs
  useEffect(() => {
    console.log("walletApiDataFromHook updated:", walletApiDataFromHook);
    console.log("walletData state:", walletData);
    console.log("adjustedWalletDataForChart state:", adjustedWalletDataForChart);
    console.log("transactionsApiDataFromHook:", transactionsApiDataFromHook);
    console.log("transactions state:", transactions);
  }, [walletApiDataFromHook, walletData, adjustedWalletDataForChart, transactionsApiDataFromHook, transactions]);

  // Update local states from SWR/custom hook data
  useEffect(() => {
    if (coinsApiData) {
      console.log("Setting coins from API data:", coinsApiData.length, "items");
      setCoins(coinsApiData);
    }
  }, [coinsApiData]);

  useEffect(() => {
    if (trendingApiData && trendingApiData.coins) {
      // Use coinsApiData for BTC price if available, otherwise it might be slightly delayed
      // This assumes trendingApiData might arrive before/simultaneously with coinsApiData
      const btcPrice = coinsApiData?.find(c => c.symbol === 'btc')?.current_price || 50000; // Fallback BTC price

      const processedTrendingCoins = trendingApiData.coins.map(coin => {
        const priceData = coin.item.data;
        return {
          ...coin.item,
          current_price: parseFloat(priceData?.price || (coin.item.price_btc * btcPrice) || 0),
          price_change_percentage_24h: parseFloat(priceData?.price_change_percentage_24h?.usd || 0),
          coin_id: coin.item.id, // Ensure coin_id exists
          sparkline: priceData?.sparkline, // Corrected path
          thumb: coin.item.thumb, // Ensure thumb is passed
        };
      });
      setTrendingCoins(processedTrendingCoins);
    }
  }, [trendingApiData, coinsApiData]); // Depend on coinsApiData for btcPrice

  // Update walletData state when API data changes
  useEffect(() => {
    if (walletApiDataFromHook) {
      console.log("Setting walletData from API:", walletApiDataFromHook);
      setWalletData(walletApiDataFromHook);
    }
  }, [walletApiDataFromHook]);

  // Update transactions state when API data changes
  useEffect(() => {
    if (transactionsApiDataFromHook) {
      console.log("Setting transactions from API:", 
        Array.isArray(transactionsApiDataFromHook) 
          ? `Array with ${transactionsApiDataFromHook.length} items` 
          : `Not an array: ${JSON.stringify(transactionsApiDataFromHook).substring(0, 100)}...`
      );
      
      // Create a safe array of transactions
      let transactionsArray = [];
      
      if (Array.isArray(transactionsApiDataFromHook)) {
        transactionsArray = transactionsApiDataFromHook;
      } else if (transactionsApiDataFromHook && typeof transactionsApiDataFromHook === 'object') {
        // Try to get transactions from various possible formats
        if (Array.isArray(transactionsApiDataFromHook.results)) {
          transactionsArray = transactionsApiDataFromHook.results;
        } else if (Array.isArray(transactionsApiDataFromHook.transactions)) {
          transactionsArray = transactionsApiDataFromHook.transactions;
        }
      }
      
      console.log("Final transactions array length:", transactionsArray.length);
      setTransactions(transactionsArray);
    } else {
      // If no transaction data, set to empty array
      if (isLoadingTransactions === false) {
        console.log("No transaction data and not loading, setting empty array");
        setTransactions([]);
      }
    }
  }, [transactionsApiDataFromHook, isLoadingTransactions]);
  
  const coinImagesMap = useMemo(() => {
    if (!coinsApiData) return {};
    const imagesMap = {};
    coinsApiData.forEach(c => {
      if (c.symbol) { // Ensure symbol exists
        imagesMap[c.symbol.toLowerCase()] = c.image;
      }
    });
    return imagesMap;
  }, [coinsApiData]);

  // Force disable loading after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setForceDisableLoading(true);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  // Derived loading and error states
  const isLoadingCoins = !forceDisableLoading && !coinsApiData && !coinsError;
  const isLoadingTrending = !forceDisableLoading && !trendingApiData && !trendingError;
  
  // Add data presence checks to avoid getting stuck in loading state
  /* eslint-disable no-unused-vars */
  const dashboardLoading = !forceDisableLoading && 
                         ((isLoadingCoins && !coins.length) || 
                          (isLoadingTrending && !trendingCoins.length) || 
                          (isLoadingWallet && !walletData) || 
                          (isLoadingTransactions && !transactions.length));
  /* eslint-enable no-unused-vars */
  const pageError = coinsError || trendingError || walletError || transactionsError;
  // --- End Derived States ---

  const getDisplayPrice = (coin) => {
    if (!coin || typeof coin.current_price === 'undefined') return 0;
    let price = parseFloat(coin.current_price);
    if (isNaN(price)) return (coin.current_price || 0); 

    if (coin.symbol && coin.symbol.toLowerCase() === 'xrp') {
      return price * 1.3;
    } else if (coin.symbol && coin.symbol.toLowerCase() === 'trx') {
      return price * 1.3;
    }
    return price;
  };

  const handleSend = (address, amount) => {
    console.log(`Sending ${amount} to ${address}`);
    // Implement send logic here
  };

  useEffect(() => {
    if (walletData && walletData.other_wallet_balances) {
      console.log("Adjusting wallet data for chart with XRP/TRX boost");
      const newAdjustedData = JSON.parse(JSON.stringify(walletData)); // Deep copy
      let xrpBalanceKey = Object.keys(newAdjustedData.other_wallet_balances).find(key => key.toLowerCase() === 'xrp');
      let trxBalanceKey = Object.keys(newAdjustedData.other_wallet_balances).find(key => key.toLowerCase() === 'trx');
      
      if (xrpBalanceKey) {
        const originalXrpValue = parseFloat(newAdjustedData.other_wallet_balances[xrpBalanceKey]);
        if (!isNaN(originalXrpValue)) {
          newAdjustedData.other_wallet_balances[xrpBalanceKey] = originalXrpValue * 1.3;
        }
      }
      
      if (trxBalanceKey) {
        const originalTrxValue = parseFloat(newAdjustedData.other_wallet_balances[trxBalanceKey]);
        if (!isNaN(originalTrxValue)) {
          newAdjustedData.other_wallet_balances[trxBalanceKey] = originalTrxValue * 1.3;
        }
      }
      console.log("Setting adjusted wallet data:", newAdjustedData);
      setAdjustedWalletDataForChart(newAdjustedData);
    } else if (walletData) { // Handle case where other_wallet_balances might be null or undefined
      console.log("Setting adjusted wallet data (no other_wallet_balances):", walletData);
      setAdjustedWalletDataForChart(JSON.parse(JSON.stringify(walletData)));
    } else {
      console.log("No wallet data to adjust");
      setAdjustedWalletDataForChart(null);
    }
  }, [walletData]);

  const toggleBalance = () => {
    console.log("Current showBalance:", showBalance);
    console.log("Setting showBalance to:", !showBalance);
    setShowBalance(!showBalance);
  };

  const handleQuickAction = (actionType, coinSymbol = null) => { // Changed coin to coinSymbol for consistency
    // If action needs full coin object, select from 'coins' state
    const fullCoin = coinSymbol ? coins.find(c => c.symbol === coinSymbol) : null;
    setSelectedCoin(fullCoin || { symbol: coinSymbol }); // Pass at least symbol

    if (actionType === 'receive') setShowReceiveModal(true);
    else if (actionType === 'send') setShowSendModal(true);
    else if (actionType === 'swap') setShowSwapModal(true);
    else {
      setComingSoonFeature(actionType.charAt(0).toUpperCase() + actionType.slice(1));
      setShowComingSoonModal(true);
    }
  };

  const handleLoadMore = () => {
    setVisibleCoinsCount(prevCount => prevCount + 10);
  };
  
  const filteredCoins = useMemo(() => {
    if (!Array.isArray(coins)) return [];
    return coins.filter(coin => 
      (coin.name && coin.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
      (coin.symbol && coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [coins, searchQuery]);

  if (pageError) {
    return (
      <div className="min-h-screen text-white p-2 sm:p-4 lg:p-8 flex flex-col justify-center items-center">
        <h2 className="text-2xl font-semibold mb-4 text-red-400">Oops! Something went wrong.</h2>
        <p className="text-lg text-gray-300 mb-2">We couldn't load all the dashboard data.</p>
        <p className="text-sm text-gray-500">Error details: {pageError.message || String(pageError) || 'Unknown error'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-2 sm:p-4 lg:p-8">
      {/* Hero section with main balance */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-3xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 backdrop-blur-lg border border-white/10 shadow-[0_0_15px_rgba(101,121,248,0.3)]">
        <div className="absolute -bottom-12 -right-12 w-32 sm:w-56 h-32 sm:h-56 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-12 -left-12 w-32 sm:w-56 h-32 sm:h-56 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="hidden sm:block">
          {!walletData ? (
            <SkeletonBalanceDisplay />
          ) : (
            <div className="relative z-10">
              <h2 className="text-xl font-medium text-blue-100 mb-2">Total Balance</h2>
              <div className="flex items-center space-x-3">
                <p className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  {showBalance 
                    ? formatPrice(Number(walletData.balance) || 0) 
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
          )}
        </div>

        <div className="sm:hidden">
          {!walletData ? (
            <SkeletonBalanceDisplay />
          ) : (
            <div className="relative z-10">
              <h2 className="text-base font-medium text-blue-100 mb-2">Total Balance</h2>
              <div className="flex items-center space-x-2">
                <p className="text-xl lg:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  {showBalance 
                    ? formatPrice(Number(walletData.balance) || 0, true)
                    : '********'
                  }
                </p>
                 <button 
                  onClick={toggleBalance}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  {showBalance ? ( // Icons for mobile
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 text-white">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
          {!walletData && !coins.length ? (
            [...Array(6)].map((_, index) => <SkeletonActionCard key={index} />)
          ) : (
            <>
              {/* Action Buttons: Ensure handleQuickAction has appropriate coin data if needed */}
              <button onClick={() => handleQuickAction('swap')} className="flex flex-col items-center justify-center p-3 sm:p-4 lg:p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-indigo-600/30 hover:from-indigo-500/20 hover:to-indigo-600/40 backdrop-blur-sm border border-indigo-500/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/20 text-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-2 sm:mb-3">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                </div>
                <p className="font-medium text-sm sm:text-base">Swap</p>
                <p className="text-xs text-white/60 mt-0.5 sm:mt-1 hidden sm:block">Exchange assets</p>
              </button>
              <button onClick={() => handleQuickAction('send')} className="flex flex-col items-center justify-center p-3 sm:p-4 lg:p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/30 hover:from-blue-500/20 hover:to-blue-600/40 backdrop-blur-sm border border-blue-500/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 text-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-2 sm:mb-3">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 15l7-7 7 7" /></svg>
                </div>
                <p className="font-medium text-sm sm:text-base">Send</p>
                <p className="text-xs text-white/60 mt-0.5 sm:mt-1 hidden sm:block">Transfer out</p>
              </button>
              <button onClick={() => handleQuickAction('receive')} className="flex flex-col items-center justify-center p-3 sm:p-4 lg:p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-600/30 hover:from-green-500/20 hover:to-green-600/40 backdrop-blur-sm border border-green-500/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20 text-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-2 sm:mb-3">
                 <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" /></svg>
                </div>
                <p className="font-medium text-sm sm:text-base">Receive</p>
                <p className="text-xs text-white/60 mt-0.5 sm:mt-1 hidden sm:block">Deposit funds</p>
              </button>
              <button onClick={() => handleQuickAction('buy')} className="flex flex-col items-center justify-center p-3 sm:p-4 lg:p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/30 hover:from-amber-500/20 hover:to-amber-600/40 backdrop-blur-sm border border-amber-500/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/20 text-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-2 sm:mb-3">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <p className="font-medium text-sm sm:text-base">Buy</p>
                <p className="text-xs text-white/60 mt-0.5 sm:mt-1 hidden sm:block">Purchase crypto</p>
              </button>
              <button onClick={() => handleQuickAction('stake')} className="flex flex-col items-center justify-center p-3 sm:p-4 lg:p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-600/30 hover:from-purple-500/20 hover:to-purple-600/40 backdrop-blur-sm border border-purple-500/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 text-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-2 sm:mb-3">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <p className="font-medium text-sm sm:text-base">Stake</p>
                <p className="text-xs text-white/60 mt-0.5 sm:mt-1 hidden sm:block">Earn rewards</p>
              </button>
              <button onClick={() => handleQuickAction('analytics')} className="flex flex-col items-center justify-center p-3 sm:p-4 lg:p-6 rounded-2xl bg-gradient-to-br from-rose-500/10 to-rose-600/30 hover:from-rose-500/20 hover:to-rose-600/40 backdrop-blur-sm border border-rose-500/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-rose-500/20 text-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl bg-rose-500/20 flex items-center justify-center mb-2 sm:mb-3">
                 <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                </div>
                <p className="font-medium text-sm sm:text-base">Analytics</p>
                <p className="text-xs text-white/60 mt-0.5 sm:mt-1 hidden sm:block">View insights</p>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Asset Distribution */}
        {!walletData ? (
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-3xl p-8 shadow-[0_0_15px_rgba(101,121,248,0.3)] backdrop-blur-lg border border-white/10">
            <div className="animate-pulse">
              <div className="h-8 w-48 bg-white/10 rounded-md mb-6"></div>
              <div className="flex justify-center items-center h-64">
                <div className="h-48 w-48 rounded-full bg-white/5"></div>
              </div>
            </div>
          </div>
        ) : (
          <AssetDistribution walletData={adjustedWalletDataForChart || walletData} coinImagesMap={coinImagesMap} />
        )}

        {/* Recent Transactions */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-3xl p-8 shadow-[0_0_15px_rgba(101,121,248,0.3)] backdrop-blur-lg border border-white/10">
          <div className="absolute -bottom-12 -right-12 w-56 h-56 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -top-12 -left-12 w-56 h-56 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-white">Recent Transactions</h2>
            </div>
            {isLoadingTransactions ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, index) => <SkeletonTransactionItem key={index} />)}
              </div>
            ) : transactions.length > 0 ? (
              <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                {transactions.map((transaction, index) => (
                  <div key={index} className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mr-3 flex-shrink-0">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {transaction.type === 'send' ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 15l7-7 7 7" /> :
                           transaction.type === 'receive' ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" /> :
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />}
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{transaction.type ? transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1) : 'Transaction'}</p>
                        <p className="text-sm text-white/60">{transaction.date ? new Date(transaction.date).toLocaleDateString() : 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${transaction.type === 'receive' ? 'text-green-400' : 'text-white'}`}>
                          {transaction.type === 'receive' ? '+' : '-'}{transaction.amount || '0.00'} {transaction.coin || ''}
                        </p>
                        <p className="text-sm text-white/60">
                          {(parseFloat(transaction.amount) * parseFloat(transaction.price)) ? formatPrice(parseFloat(transaction.amount) * parseFloat(transaction.price)) : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 px-2 text-white/50 bg-white/5 rounded-xl">
                <svg className="w-16 h-16 mx-auto text-white/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                <h3 className="text-xl font-medium">No Transactions Found</h3>
                <p className="mt-2">Your transaction history will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Market Trends section */}
      <div className="mt-6 sm:mt-8">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white">Market Trends</h2>
        </div>
        {!forceDisableLoading && (isLoadingTrending || isLoadingCoins) && trendingCoins.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {[...Array(6)].map((_, index) => <SkeletonCoinItem key={index} />)}
          </div>
        ) : trendingCoins.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {trendingCoins.slice(0, 6).map((coin) => (
              <div key={coin.id || coin.coin_id} className="p-3 sm:p-4 rounded-xl bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 backdrop-blur-sm transition-all duration-300 border border-white/10 hover:border-white/20 group">
                <div className="flex items-center">
                  {coin.thumb ? <img src={coin.thumb} alt={coin.name} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-2 sm:mr-3" />
                    : <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-700 mr-2 sm:mr-3 flex items-center justify-center"><span className="text-xs">{coin.symbol?.substring(0, 2).toUpperCase()}</span></div>}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm sm:text-base truncate">{coin.name}</h3>
                    <p className="text-xs text-white/60">{coin.symbol?.toUpperCase()}</p>
                  </div>
                  <div className="text-right pl-2">
                    <p className="font-medium text-sm sm:text-base">{formatPrice(getDisplayPrice(coin))}</p>
                    <p className={`text-xs ${parseFloat(coin.price_change_percentage_24h) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {typeof coin.price_change_percentage_24h === 'number' ? `${coin.price_change_percentage_24h >= 0 ? '+' : ''}${coin.price_change_percentage_24h.toFixed(2)}%` : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="mt-3 sm:mt-4 h-12 sm:h-16 w-full overflow-hidden">
                  {coin.sparkline ? <img src={coin.sparkline} alt={`${coin.name} 7d chart`} className="w-full h-full object-contain" />
                    : <div className="w-full h-full bg-white/5 rounded-md flex items-center justify-center"><p className="text-xs text-white/40">No chart data</p></div>}
                </div>
              </div>
            ))}
          </div>
        ) : (
           <div className="text-center py-10 px-2 text-white/50 bg-white/5 rounded-xl mt-4">
            <h3 className="text-lg font-medium">No Trending Coins</h3>
            <p className="mt-1 text-sm">Trending coin data is currently unavailable.</p>
          </div>
        )}
      </div>

      {/* All Coins Table */}
      <div className="mt-6 sm:mt-8 relative overflow-hidden bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-[0_0_15px_rgba(101,121,248,0.3)] backdrop-blur-lg border border-white/10">
        <div className="absolute -bottom-12 -right-12 w-36 sm:w-56 h-36 sm:h-56 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-12 -left-12 w-36 sm:w-56 h-36 sm:h-56 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white mb-3 sm:mb-0">All Coins</h2>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 items-start sm:items-center w-full sm:w-auto">
              <input type="text" placeholder="Search coins..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"/>
            </div>
          </div>
          {!forceDisableLoading && isLoadingCoins && coins.length === 0 ? (
            <div className="overflow-x-auto animate-pulse"> {/* Skeleton for table */}
              <table className="w-full min-w-full table-auto">
                <thead className="text-left text-white border-b border-white/10"><tr>{['Coin', 'Price', '24h Change', 'Market Cap', 'Action'].map((header, i) => <th key={i} className="pb-4 pr-4"><SkeletonTextLine width="w-20" height="h-6" /></th>)}</tr></thead>
                <tbody>{[...Array(8)].map((_, i) => <tr key={i} className="border-b border-white/5"><td className="py-4 pr-4"><div className="flex items-center"><div className="w-8 h-8 mr-3 rounded-full bg-white/10"></div><SkeletonTextLine width="w-24" height="h-4" /></div></td><td className="py-4 pr-4"><SkeletonTextLine width="w-20" height="h-4" /></td><td className="py-4 pr-4"><SkeletonTextLine width="w-16" height="h-4" /></td><td className="py-4 pr-4"><SkeletonTextLine width="w-24" height="h-4" /></td><td className="py-4 pr-4"><div className="flex space-x-2"><div className="w-8 h-8 rounded-lg bg-white/10"></div><div className="w-8 h-8 rounded-lg bg-white/10"></div></div></td></tr>)}</tbody>
              </table>
            </div>
          ) : filteredCoins.length > 0 ? (
            <>
              <div className="hidden sm:block overflow-x-auto pb-1"> {/* Desktop Table */}
                <div className="min-w-full">
                  <table className="w-full table-auto">
                    <thead className="text-left text-white border-b border-white/10 sticky top-0 bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-md z-10">
                      <tr>
                        <th className="pb-3 sm:pb-4 pr-3 sm:pr-4 pt-2 font-semibold text-sm">Coin</th>
                        <th className="pb-3 sm:pb-4 pr-3 sm:pr-4 pt-2 font-semibold text-sm">Price</th>
                        <th className="pb-3 sm:pb-4 pr-3 sm:pr-4 pt-2 font-semibold text-sm">24h Change</th>
                        <th className="pb-3 sm:pb-4 pr-3 sm:pr-4 pt-2 font-semibold text-sm">Market Cap</th>
                        <th className="pb-3 sm:pb-4 pr-3 sm:pr-4 pt-2 font-semibold text-sm">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredCoins.slice(0, visibleCoinsCount).map((coin) => (
                        <tr key={coin.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-3 sm:py-4 pr-3 sm:pr-4">
                            <div className="flex items-center">
                              <img src={coinImagesMap[coin.symbol?.toLowerCase()] || coin.image || './placeholder-coin.png'} alt={coin.name} className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 rounded-full" onError={(e) => { e.target.onerror = null; e.target.src='./placeholder-coin.png'; }} />
                              <div className="min-w-0">
                                <p className="font-medium text-sm sm:text-base truncate">{coin.name}</p>
                                <p className="text-xs text-white/60">{coin.symbol?.toUpperCase()}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 sm:py-4 pr-3 sm:pr-4 font-medium text-sm sm:text-base">{formatPrice(getDisplayPrice(coin))}</td>
                          <td className={`py-3 sm:py-4 pr-3 sm:pr-4 text-sm sm:text-base ${parseFloat(coin.price_change_percentage_24h) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {typeof coin.price_change_percentage_24h === 'number' ? `${coin.price_change_percentage_24h >= 0 ? '+' : ''}${coin.price_change_percentage_24h.toFixed(2)}%` : 'N/A'}
                          </td>
                          <td className="py-3 sm:py-4 pr-3 sm:pr-4 font-medium text-sm sm:text-base">
                            {coin.market_cap ? `$${coin.market_cap.toLocaleString(undefined, {maximumFractionDigits: 0})}` : 'N/A'}
                          </td>
                          <td className="py-3 sm:py-4 pr-3 sm:pr-4">
                            <div className="flex space-x-2">
                              <button onClick={() => handleQuickAction('buy', coin.symbol)} className="p-1.5 sm:p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors" aria-label={`Buy ${coin.name}`}>
                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                              </button>
                              <button onClick={() => handleQuickAction('swap', coin.symbol)} className="p-1.5 sm:p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors" aria-label={`Swap ${coin.name}`}>
                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="sm:hidden"> {/* Mobile Card View */}
                {filteredCoins.slice(0, visibleCoinsCount).map((coin) => (
                  <div key={coin.id} className="bg-white/5 hover:bg-white/10 rounded-xl p-3 mb-3 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <img src={coinImagesMap[coin.symbol?.toLowerCase()] || coin.image || './placeholder-coin.png'} alt={coin.name} className="w-6 h-6 mr-2 rounded-full" onError={(e) => { e.target.onerror = null; e.target.src='./placeholder-coin.png'; }} />
                        <div>
                          <p className="font-medium text-sm">{coin.name}</p>
                          <p className="text-xs text-white/60">{coin.symbol?.toUpperCase()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">{formatPrice(getDisplayPrice(coin))}</p>
                        <p className={`text-xs ${parseFloat(coin.price_change_percentage_24h) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {typeof coin.price_change_percentage_24h === 'number' ? `${coin.price_change_percentage_24h >= 0 ? '+' : ''}${coin.price_change_percentage_24h.toFixed(2)}%` : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-white/60">Market Cap: {coin.market_cap ? `$${coin.market_cap.toLocaleString(undefined, {maximumFractionDigits: 0})}` : 'N/A'}</p>
                      <div className="flex space-x-2">
                        <button onClick={() => handleQuickAction('buy', coin.symbol)} className="p-1.5 rounded-lg bg-green-500/20 text-green-400"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg></button>
                        <button onClick={() => handleQuickAction('swap', coin.symbol)} className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {filteredCoins.length === 0 && searchQuery && (
                <div className="text-center py-8 text-white/60">No coins found matching "{searchQuery}".</div>
              )}
              {filteredCoins.length > visibleCoinsCount && (
                <div className="flex justify-center mt-4 sm:mt-6">
                  <button onClick={handleLoadMore} className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 rounded-xl text-white/70 hover:text-white transition-colors border border-white/5 hover:border-white/10 text-sm sm:text-base">
                    Load More
                  </button>
                </div>
              )}
            </>
          ) : !isLoadingCoins && coins.length === 0 && !searchQuery ? (
            <div className="text-center py-10 px-2 text-white/50 bg-white/5 rounded-xl">
              <h3 className="text-lg font-medium">No Coins Available</h3>
              <p className="mt-1 text-sm">Cryptocurrency data is currently unavailable.</p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Modals */}
      <ReceiveModal isOpen={showReceiveModal} onClose={() => setShowReceiveModal(false)} initialCoin={selectedCoin} />
      <SendModal isOpen={showSendModal} onClose={() => setShowSendModal(false)} onSend={handleSend} initialCoin={selectedCoin} />
      <SwapModal isOpen={showSwapModal} onClose={() => setShowSwapModal(false)} coins={coins} walletData={walletData} />
      <ComingSoonModal isOpen={showComingSoonModal} onClose={() => setShowComingSoonModal(false)} feature={comingSoonFeature} />
    </div>
  );
};

export default Dashboard;
