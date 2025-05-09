import React, { useState, useEffect } from 'react';
import { BitcoinIcon, EthereumIcon, LitecoinIcon, DogecoinIcon, UsdtIcon, XrpIcon, TrxIcon } from '../Auth/CoinIcons';
import ExchangeService from '../Services/ExchangeService';
import BalanceCard from '../Dashboard/BalanceCard';
import DashboardService from '../Services/DashboardService';

// Helper for responsive price formatting
const formatPrice = (price, isMobile = false) => {
  return price.toLocaleString('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: isMobile ? 0 : 2,
    maximumFractionDigits: isMobile ? 0 : 2
  });
};

const getCoinIcon = (coinType) => {
  switch (coinType) {
    case 'BTC': return <BitcoinIcon />;
    case 'ETH': return <EthereumIcon />;
    case 'LTC': return <LitecoinIcon />;
    case 'DOGE': return <DogecoinIcon />;
    case 'USDT': return <UsdtIcon />;
    case 'XRP': return <XrpIcon />;
    case 'TRX': return <TrxIcon />;
    default: return null;
  }
};

// Our predefined coin data
const coinData = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
  { id: 'litecoin', name: 'Litecoin', symbol: 'LTC' },
  { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE' },
  { id: 'tether', name: 'Tether', symbol: 'USDT' },
  { id: 'ripple', name: 'XRP', symbol: 'XRP' },
  { id: 'tron', name: 'Tron', symbol: 'TRX' },
];

// Helper function to get adjusted price for XRP and TRX
const getAdjustedPrice = (symbol, originalPrice) => {
  if (!originalPrice) return 0;
  const lowerSymbol = symbol.toLowerCase();
  if (lowerSymbol === 'xrp' || lowerSymbol === 'trx') {
    return originalPrice * 1.3;
  }
  return originalPrice;
};

const ExchangePage = () => {
  const [fromCoin, setFromCoin] = useState('');
  const [toCoin, setToCoin] = useState('');
  const [amount, setAmount] = useState('');
  const [estimatedAmount, setEstimatedAmount] = useState('');
  const [fromBalance, setFromBalance] = useState(0);
  const [toBalance, setToBalance] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [walletData, setWalletData] = useState(null);
  const [showBalance, setShowBalance] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [priceData, setPriceData] = useState(null);
  const [priceLoading, setPriceLoading] = useState(true);

  const toggleBalance = () => {
    setShowBalance(!showBalance);
  };

  useEffect(() => {
    // Set initial coins
    setFromCoin(coinData[0].symbol);
    setToCoin(coinData[1].symbol);
  }, []);

  useEffect(() => {
    const fetchBalances = async () => {
      if (fromCoin && toCoin) {
        try {
          const data = await ExchangeService.getExchangeInfo(fromCoin, toCoin);
          setFromBalance(parseFloat(data.coin_from_balance));
          setToBalance(parseFloat(data.coin_to_balance));
          setExchangeRate(parseFloat(data.exchange_rate));
        } catch (error) {
          console.error('Error fetching exchange info:', error);
          setError('Failed to fetch exchange information. Please try again later.');
        }
      }
    };

    fetchBalances();
  }, [fromCoin, toCoin]);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const wallet = await DashboardService.getWallet();
        setWalletData(wallet);
      } catch (error) {
        console.error('Error fetching wallet data:', error);
      }
    };

    fetchWalletData();
  }, []);

  useEffect(() => {
    if (amount && exchangeRate) {
      const estimated = (parseFloat(amount) * exchangeRate).toFixed(8);
      setEstimatedAmount(estimated);
    } else {
      setEstimatedAmount('');
    }
  }, [amount, exchangeRate]);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= fromBalance)) {
      setAmount(value);
      setError('');
    } else {
      setError('Insufficient balance');
    }
  };

  const handleSwap = () => {
    setFromCoin(toCoin);
    setToCoin(fromCoin);
    setAmount('');
    setEstimatedAmount('');
    setError('');
  };

  const handleExchange = async () => {
    if (parseFloat(amount) > 0 && parseFloat(amount) <= fromBalance) {
      setIsLoading(true);
      setError('');
      setIsSuccess(false);
      try {
        const payload = {
          fromCoin: fromCoin,
          toCoin: toCoin,
          fromAmount: amount,
          toAmount: estimatedAmount
        };
        const response = await ExchangeService.executeExchange(payload);
        setIsSuccess(true);
        // Update balances
        const newData = await ExchangeService.getExchangeInfo(fromCoin, toCoin);
        setFromBalance(parseFloat(newData.coin_from_balance));
        setToBalance(parseFloat(newData.coin_to_balance));
        // Reset form
        setAmount('');
        setEstimatedAmount('');
      } catch (error) {
        console.error('Error executing exchange:', error);
        setError('Failed to execute exchange. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else {
      setError('Invalid amount for exchange');
    }
  };

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const data = await ExchangeService.getPriceData(toCoin);
        setPriceData(data);
      } catch (error) {
        console.error('Error fetching price data:', error);
        setError('Failed to fetch price data. Please try again later.');
      } finally {
        setPriceLoading(false);
      }
    };

    fetchPriceData();
  }, [toCoin]);

  // Get price information for coins
  const [coinPrices, setCoinPrices] = useState({});

  useEffect(() => {
    const fetchAllCoinPrices = async () => {
      try {
        const prices = {};
        for (const coin of coinData) {
          try {
            const data = await ExchangeService.getPriceData(coin.symbol);
            prices[coin.symbol.toLowerCase()] = data?.price || 0;
          } catch (error) {
            console.error(`Error fetching price for ${coin.symbol}:`, error);
            prices[coin.symbol.toLowerCase()] = 0;
          }
        }
        setCoinPrices(prices);
      } catch (error) {
        console.error('Error fetching coin prices:', error);
      }
    };

    fetchAllCoinPrices();
  }, []);

  // Calculate values in USD for display, applying adjustments for XRP/TRX
  const fromCoinPrice = coinPrices[fromCoin?.toLowerCase()] || 0;
  const adjustedFromCoinPrice = getAdjustedPrice(fromCoin, fromCoinPrice);
  const fromUsdValue = amount ? parseFloat(amount) * adjustedFromCoinPrice : 0;

  const toCoinPrice = coinPrices[toCoin?.toLowerCase()] || 0;
  const adjustedToCoinPrice = getAdjustedPrice(toCoin, toCoinPrice);
  const toUsdValue = estimatedAmount ? parseFloat(estimatedAmount) * adjustedToCoinPrice : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-darkblue text-white p-8">
      <div className="relative max-w-7xl mx-auto">
        {/* Hero section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-3xl p-8 mb-8 backdrop-blur-lg border border-white/10 shadow-[0_0_15px_rgba(101,121,248,0.3)]">
          {/* Decorative elements */}
          <div className="absolute -bottom-12 -right-12 w-56 h-56 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -top-12 -left-12 w-56 h-56 bg-purple-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-4">Exchange Crypto</h1>
            <p className="text-lg text-blue-100 max-w-2xl">
              Instantly swap between cryptocurrencies at competitive rates with zero hidden fees.
            </p>
          </div>
        </div>

        {/* Balance Card */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-3xl p-8 mb-8 backdrop-blur-lg border border-white/10 shadow-[0_0_15px_rgba(101,121,248,0.2)]">
          <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -top-12 -left-12 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-xl font-medium text-blue-100 mb-2">Total Balance</h2>
            <div className="flex items-center space-x-3">
              <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                {showBalance 
                  ? walletData?.balance?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
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
        </div>

        {/* Exchange Interface */}
        <div className="relative bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-3xl p-8 shadow-[0_0_15px_rgba(101,121,248,0.2)] backdrop-blur-lg border border-white/10">
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* From Currency */}
              <div className="lg:col-span-2">
                <h2 className="text-xl font-medium text-white mb-4">From</h2>
                <div className="relative mb-4">
                  <select
                    value={fromCoin}
                    onChange={(e) => setFromCoin(e.target.value)}
                    className="w-full py-3 px-4 bg-white/5 text-white rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 appearance-none pr-10"
                  >
                    {coinData.map((coin) => (
                      <option key={coin.id} value={coin.symbol}>{coin.name} ({coin.symbol})</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                <div className="relative mb-4">
                  <input
                    type="number"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="Enter amount to exchange"
                    className="w-full py-3 px-4 bg-white/5 text-white rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 pr-12"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <div className="w-7 h-7">{getCoinIcon(fromCoin)}</div>
                  </div>
                </div>
                
                <p className="text-sm text-blue-300 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Available: {fromBalance.toFixed(8)} {fromCoin} (≈ {formatPrice(fromUsdValue, window.innerWidth < 640)})
                </p>
              </div>

              {/* Swap Button */}
              <div className="flex items-center justify-center">
                <button
                  onClick={handleSwap}
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 flex items-center justify-center border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </button>
              </div>

              {/* To Currency */}
              <div className="lg:col-span-2">
                <h2 className="text-xl font-medium text-white mb-4">To</h2>
                <div className="relative mb-4">
                  <select
                    value={toCoin}
                    onChange={(e) => setToCoin(e.target.value)}
                    className="w-full py-3 px-4 bg-white/5 text-white rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 appearance-none pr-10"
                  >
                    {coinData.filter(coin => coin.symbol !== fromCoin).map((coin) => (
                      <option key={coin.id} value={coin.symbol}>{coin.name} ({coin.symbol})</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                <div className="relative mb-4">
                  <input
                    type="text"
                    value={estimatedAmount}
                    readOnly
                    className="w-full py-3 px-4 bg-white/5 text-white rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 pr-12"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <div className="w-7 h-7">{getCoinIcon(toCoin)}</div>
                  </div>
                </div>
                
                <p className="text-sm text-blue-300 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Available: {toBalance.toFixed(8)} {toCoin} (≈ {formatPrice(toUsdValue, window.innerWidth < 640)})
                </p>
              </div>
            </div>

            {/* Exchange Rate */}
            {exchangeRate && (
              <div className="mt-8 p-4 bg-gradient-to-br from-white/5 to-white/10 rounded-xl border border-white/10">
                <div className="flex items-center justify-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-6 h-6 mr-2">{getCoinIcon(fromCoin)}</div>
                    <span>1 {fromCoin}</span>
                  </div>
                  <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  <div className="flex items-center">
                    <span>{exchangeRate.toFixed(8)} {toCoin}</span>
                    <div className="w-6 h-6 ml-2">{getCoinIcon(toCoin)}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 bg-red-400/10 border border-red-400/20 rounded-xl">
                <p className="text-red-400 text-sm flex items-center">
                  <svg className="w-5 h-5 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {error}
                </p>
              </div>
            )}

            {/* Success Message */}
            {isSuccess && (
              <div className="mt-6 p-6 bg-green-400/10 border border-green-400/20 rounded-xl text-center">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-tr from-green-500/20 to-emerald-500/20 border border-green-500/20 text-green-400 mb-4">
                  <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-green-400 mb-2">Exchange Successful!</h3>
                <p className="text-white/60">Your transaction has been completed successfully.</p>
              </div>
            )}

            {/* Exchange Button */}
            {!isSuccess && (
              <button
                onClick={handleExchange}
                disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > fromBalance || !estimatedAmount || isLoading}
                className="w-full mt-8 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-medium text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20 flex justify-center items-center"
              >
                {isLoading ? (
                  <div className="relative w-6 h-6">
                    <div className="absolute inset-0 flex items-center justify-center animate-spin-slow">
                      <div className="w-full h-full border-2 border-white/30 border-t-white rounded-full"></div>
                    </div>
                  </div>
                ) : (
                  'Exchange Now'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExchangePage;
