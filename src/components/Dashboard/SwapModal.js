import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { BitcoinIcon, EthereumIcon, LitecoinIcon, DogecoinIcon, UsdtIcon } from '../Auth/CoinIcons';
import ExchangeService from '../Services/ExchangeService';

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

// Our custom coin data
const coinData = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
  { id: 'litecoin', name: 'Litecoin', symbol: 'LTC' },
  { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE' },
  { id: 'tether', name: 'Tether', symbol: 'USDT' },
];

const Step1 = ({ goToNextStep, coins, fromCoin, setFromCoin, toCoin, setToCoin, fromBalance, toBalance }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (fromCoin && toCoin && fromCoin !== toCoin) {
      goToNextStep({ fromCoin, toCoin });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-white text-sm font-bold mb-2" htmlFor="fromCurrency">
          From Currency:
        </label>
        <div className="relative">
          <select
            id="fromCurrency"
          value={fromCoin}
          onChange={(e) => setFromCoin(e.target.value)}
          className="w-full py-2 px-3 bg-darkblue-secondary text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
        >
          <option value="">Select a coin</option>
          {coins.map((coin) => (
            <option key={coin.id} value={coin.symbol}>{coin.name} ({coin.symbol})</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            {fromCoin && <div className="icon-container">{getCoinIcon(fromCoin)}</div>}
          </div>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          Available: {fromBalance.toFixed(8)} {fromCoin}
        </p>
      </div>
      <div>
        <label className="block text-white text-sm font-bold mb-2" htmlFor="toCurrency">
          To Currency:
        </label>
        <div className="relative">
          <select
            id="toCurrency"
            value={toCoin}
            onChange={(e) => setToCoin(e.target.value)}
            className="w-full py-2 pl-3 pr-10 bg-darkblue-secondary text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            <option value="">Select a coin</option>
            {coins.filter(coin => coin.symbol !== fromCoin).map((coin) => (
              <option key={coin.id} value={coin.symbol}>{coin.name} ({coin.symbol})</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            {toCoin && <div className="icon-container">{getCoinIcon(toCoin)}</div>}
          </div>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          Available: {toBalance.toFixed(8)} {toCoin}
        </p>
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-md font-bold text-white transition duration-300"
        disabled={!fromCoin || !toCoin || fromCoin === toCoin}
      >
        Next
      </button>
    </form>
  );
};

const Step2 = ({ goToNextStep, data, amount, setAmount, estimatedAmount, exchangeRate, fromBalance, error, setError }) => {
  const [isLoading, setIsLoading] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (amount && estimatedAmount) {
      try {
        setIsLoading(true)
        console.log(data);
        await ExchangeService.executeExchange({
          fromCoin: data.fromCoin,
          toCoin: data.toCoin,
          fromAmount: amount,
          toAmount: estimatedAmount
        });
        goToNextStep({ amount, estimatedAmount});
      } catch (error) {
        console.error('Error executing exchange:', error);
        setError('Failed to execute exchange. Please try again later.');
        goToNextStep({amount,estimatedAmount, error})
      } finally {
        setIsLoading(false)
      }
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= fromBalance)) {
      setAmount(value);
      setError('');
    } else {
      setError('Insufficient balance');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-white text-sm font-bold mb-2" htmlFor="amount">
          Amount to swap:
        </label>
        <div className="flex items-center">
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={handleAmountChange}
            className="w-full py-2 px-3 bg-darkblue-secondary text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Enter amount in ${data.fromCoin}`}
            step="0.00000001"
          />
          <span className="ml-2">{getCoinIcon(data.fromCoin)}</span>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          Available: {fromBalance.toFixed(8)} {data.fromCoin}
        </p>
      </div>
      {estimatedAmount !== null && (
        <div className="bg-darkblue-secondary p-4 rounded-md text-white">
          <p>You will receive approximately:</p>
          <div className="flex items-center space-x-2">
            <p className="text-2xl font-bold">{estimatedAmount}</p>
            {getCoinIcon(data.toCoin)}
          </div>
        </div>
      )}
      {exchangeRate && (
        <p className="text-center mt-4">
          1 {data.fromCoin} = {exchangeRate.toFixed(8)} {data.toCoin}
        </p>
      )}
      {error && (
        <p className="text-red-500 text-center">{error}</p>
      )}
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-md font-bold text-white transition duration-300 disabled:opacity-50"
        disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > fromBalance || !estimatedAmount || isLoading}
      >
        {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div> : 'Swap'}
      </button>
    </form>
  );
};

const Step3 = ({ data, error }) => {
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    // Simulate a confirmation process
    setTimeout(() => {
      setIsConfirmed(true)
    }, 3000);
  }, [data]);

  return (
    <div className="space-y-4">
      {error && (
        <p className="text-red-500 text-center">{error}</p>
      )}
      {(!isConfirmed && !error) && (
        <>
          <h3 className="text-white text-xl font-bold text-center">
            {isConfirmed ? 'Swap Confirmed!' : 'Confirming Swap...'}
          </h3>
          <div className="bg-darkblue-secondary p-4 rounded-md text-white">
            <div className={`flex items-center space-x-2 ${!isConfirmed ? 'animate-snake-bounce' : ''}`}>   
              <p>Swapping {data.amount} </p>{getCoinIcon(data.fromCoin)}
            </div>
            <div className={`flex items-center space-x-2 ${!isConfirmed ? 'animate-snake-bounce' : ''}`}>
              <p>For approximately {data.estimatedAmount}</p>{getCoinIcon(data.toCoin)}
            </div>
          </div>
        </>
      )}
      {!isConfirmed && !error && (
        <div className="flex justify-center mt-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      {isConfirmed && (
        <div className="mt-4">
          <svg className="w-16 h-16 mx-auto text-green-500 animate-[checkmark_0.5s_ease-in-out_forwards]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
      )}
    </div>
  );
};

const SwapModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [swapData, setSwapData] = useState({});
  const [fromCoin, setFromCoin] = useState('');
  const [toCoin, setToCoin] = useState('');
  const [amount, setAmount] = useState('');
  const [estimatedAmount, setEstimatedAmount] = useState('');
  const [fromBalance, setFromBalance] = useState(0);
  const [toBalance, setToBalance] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [error, setError] = useState('');

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
    if (amount && exchangeRate) {
      const estimated = (parseFloat(amount) * exchangeRate).toFixed(8);
      setEstimatedAmount(estimated);
    } else {
      setEstimatedAmount(null);
    }
  }, [amount, exchangeRate]);

  const steps = [
    {
      title: "Select Currencies",
      component: Step1,
    },
    {
      title: "Enter Amount",
      component: Step2,
    },
    {
      title: "Confirm Swap",
      component: Step3,
    },
  ];

  const goToNextStep = (stepData) => {
    setSwapData((prevData) => ({ ...prevData, ...stepData }));
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleClose = () => {
    setCurrentStep(0);
    setSwapData({});
    setAmount('');
    setEstimatedAmount('');
    setError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      steps={steps.map((step, index) => ({
        ...step,
        component: () => step.component({ 
          goToNextStep, 
          data: swapData,
          coins: coinData,
          fromCoin,
          setFromCoin,
          toCoin,
          setToCoin,
          amount,
          setAmount,
          estimatedAmount,
          exchangeRate,
          fromBalance,
          toBalance,
          error,
          setError
        }),
      }))}
      currentStep={currentStep}
    />
  );
};

export default SwapModal;
