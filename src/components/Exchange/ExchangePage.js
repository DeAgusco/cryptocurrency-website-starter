import React, { useState, useEffect } from 'react';
import { BitcoinIcon, EthereumIcon, LitecoinIcon, DogecoinIcon, UsdtIcon } from '../Auth/CoinIcons';
import ExchangeService from '../Services/ExchangeService';
import BalanceCard from '../Dashboard/BalanceCard';
import DashboardService from '../Services/DashboardService';

const getCoinIcon = (coin) => {
  switch (coin) {
    case 'BTC': return <BitcoinIcon />;
    case 'ETH': return <EthereumIcon />;
    case 'LTC': return <LitecoinIcon />;
    case 'DOGE': return <DogecoinIcon />;
    case 'USDT': return <UsdtIcon />;
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
];

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
      try {
        const response = await ExchangeService.executeExchange(fromCoin, toCoin, amount, estimatedAmount);
        console.log('Exchange executed:', response);
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

  return (
    <div className="p-6 bg-darkblue text-white">
      <BalanceCard
        balance={walletData?.balance} 
        showBalance={showBalance} 
        toggleBalance={toggleBalance} 
      />
      <h1 className="text-3xl font-bold mb-6 mt-6">Exchange Cryptocurrencies</h1>

      <div className="mt-8 relative backdrop-blur-md bg-darkblue/30 p-8 rounded-lg shadow-lg border border-white/20 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">From</h2>
            <select
              value={fromCoin}
              onChange={(e) => setFromCoin(e.target.value)}
              className="w-full p-2 bg-darkblue-secondary text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            >
              {coinData.map((coin) => (
                <option key={coin.id} value={coin.symbol}>{coin.name} ({coin.symbol})</option>
              ))}
            </select>
            
            <div className="flex items-center mb-4">
              <input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Amount"
                className="w-full p-2 bg-darkblue-secondary text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="ml-2">{getCoinIcon(fromCoin)}</span>
            </div>
            <p className="text-sm text-gray-400">
              Available: {fromBalance.toFixed(8)} {fromCoin}
            </p>
          </div>

          <div className="flex items-center justify-center">
            <button
              onClick={handleSwap}
              className="p-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">To</h2>
            <select
              value={toCoin}
              onChange={(e) => setToCoin(e.target.value)}
              className="w-full p-2 bg-darkblue-secondary text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            >
              {coinData.filter(coin => coin.symbol !== fromCoin).map((coin) => (
                <option key={coin.id} value={coin.symbol}>{coin.name} ({coin.symbol})</option>
              ))}
            </select>
            <div className="flex items-center mb-4">
              <input
                type="text"
                value={estimatedAmount}
                readOnly
                className="w-full p-2 bg-darkblue-secondary text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="ml-2">{getCoinIcon(toCoin)}</span>
            </div>
            <p className="text-sm text-gray-400">
              Available: {toBalance.toFixed(8)} {toCoin}
            </p>
          </div>
        </div>

        {exchangeRate && (
          <p className="text-center mt-4">
            1 {fromCoin} = {exchangeRate.toFixed(8)} {toCoin}
          </p>
        )}

        {error && (
          <p className="text-red-500 text-center mt-4">{error}</p>
        )}
        {isSuccess ? (
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-green-500 animate-[checkmark_0.5s_ease-in-out_forwards]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <p className="text-green-500 text-center mt-4">Exchange successful!</p>
          </div>
        ) : (
          <button
            onClick={handleExchange}
            disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > fromBalance || !estimatedAmount || isLoading}
            className="w-full mt-6 py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-md font-bold text-white transition duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:bg-gray-500/50"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto"></div>
            ) : (
              'Exchange'
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default ExchangePage;
