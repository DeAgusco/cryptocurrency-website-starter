import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { BitcoinIcon, EthereumIcon, LitecoinIcon, DogecoinIcon, UsdtIcon, XrpIcon, TrxIcon } from '../Auth/CoinIcons';
import ExchangeService from '../Services/ExchangeService';

const getCoinIcon = (coin) => {
  switch (coin) {
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

// Our custom coin data
const coinData = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
  { id: 'litecoin', name: 'Litecoin', symbol: 'LTC' },
  { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE' },
  { id: 'tether', name: 'Tether', symbol: 'USDT' },
  { id: 'ripple', name: 'XRP', symbol: 'XRP' },
  { id: 'tron', name: 'Tron', symbol: 'TRX' },
];

const Step1 = ({ goToNextStep, coins, fromCoin, setFromCoin, toCoin, setToCoin, fromBalance, toBalance }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (fromCoin && toCoin && fromCoin !== toCoin) {
      goToNextStep({ fromCoin, toCoin });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-white text-sm font-medium mb-2" htmlFor="fromCurrency">
          From Currency:
        </label>
        <div className="relative">
          <select
            id="fromCurrency"
            value={fromCoin}
            onChange={(e) => setFromCoin(e.target.value)}
            className="w-full py-3 px-4 bg-white/5 text-white rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 appearance-none pr-10"
          >
            <option value="">Select a coin</option>
            {coins.map((coin) => (
              <option key={coin.id} value={coin.symbol}>{coin.name} ({coin.symbol})</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            {fromCoin ? (
              <div className="w-6 h-6">{getCoinIcon(fromCoin)}</div>
            ) : (
              <svg className="h-5 w-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </div>
        </div>
        <p className="text-sm text-blue-300 mt-2 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Available: {fromBalance.toFixed(8)} {fromCoin}
        </p>
      </div>

      {/* Arrow Separator */}
      <div className="flex justify-center items-center py-2">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
          <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      <div>
        <label className="block text-white text-sm font-medium mb-2" htmlFor="toCurrency">
          To Currency:
        </label>
        <div className="relative">
          <select
            id="toCurrency"
            value={toCoin}
            onChange={(e) => setToCoin(e.target.value)}
            className="w-full py-3 px-4 bg-white/5 text-white rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 appearance-none pr-10"
          >
            <option value="">Select a coin</option>
            {coins.filter(coin => coin.symbol !== fromCoin).map((coin) => (
              <option key={coin.id} value={coin.symbol}>{coin.name} ({coin.symbol})</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            {toCoin ? (
              <div className="w-6 h-6">{getCoinIcon(toCoin)}</div>
            ) : (
              <svg className="h-5 w-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </div>
        </div>
        <p className="text-sm text-blue-300 mt-2 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Available: {toBalance.toFixed(8)} {toCoin}
        </p>
      </div>
      <button
        type="submit"
        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-medium text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
        disabled={!fromCoin || !toCoin || fromCoin === toCoin}
      >
        Next
      </button>
    </form>
  );
};

const Step2 = ({ goToNextStep, data, amount, setAmount, estimatedAmount, exchangeRate, displayExchangeRate, fromBalance, error, setError }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Calculate actualToAmount using the current `amount` prop (from input) and original `exchangeRate`
    const actualToAmount = (parseFloat(amount) * exchangeRate).toFixed(8);

    console.log('[DEBUG] Step2 handleSubmit triggered.');
    console.log('[DEBUG] Current amount (from input):', amount, typeof amount);
    console.log('[DEBUG] Calculated actualToAmount:', actualToAmount, typeof actualToAmount);
    console.log('[DEBUG] Original exchangeRate:', exchangeRate, typeof exchangeRate);

    // Check against the current input `amount`
    if (amount && parseFloat(amount) > 0 && actualToAmount && parseFloat(actualToAmount) > 0) {
      setIsLoading(true);
      const payload = {
        fromCoin: data.fromCoin, // fromCoin comes from Step1 selection via data prop
        toCoin: data.toCoin,     // toCoin comes from Step1 selection via data prop
        fromAmount: amount,      // Use the current input amount 
        toAmount: actualToAmount 
      };
      console.log('[DEBUG] Payload object to send to service:', payload);
      
      try {
        await ExchangeService.executeExchange(payload);
        goToNextStep({ 
          amount, // Pass current input amount
          estimatedAmount, // Pass displayed estimated amount
          actualToAmount,  // Pass calculated actual amount
          fromCoin: data.fromCoin, // Ensure fromCoin/toCoin are in data for Step3
          toCoin: data.toCoin,
          error: null 
        });
      } catch (errorLogging) {
        console.error('Error executing exchange:', errorLogging);
        goToNextStep({ 
          amount, 
          estimatedAmount, 
          actualToAmount, 
          fromCoin: data.fromCoin,
          toCoin: data.toCoin,
          error: 'Failed to execute exchange. Please try again later.' 
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      console.warn('[DEBUG] handleSubmit condition not met. Amount or actualToAmount invalid.', { amount, actualToAmount });
      setError('Please enter a valid amount to swap.'); // Provide more generic error if needed
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

  // Log values for the disabled condition
  const isButtonDisabled = !amount || parseFloat(amount) <= 0 || parseFloat(amount) > fromBalance || !estimatedAmount || isLoading;
  if (isLoading || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > fromBalance || !estimatedAmount) {
      console.log('[DEBUG] Swap button disabled state check:', {
        amount,
        isAmountPositive: parseFloat(amount) > 0,
        isAmountLessThanBalance: parseFloat(amount) <= fromBalance,
        fromBalance,
        estimatedAmountPresent: !!estimatedAmount,
        isLoading,
        calculatedIsButtonDisabled: isButtonDisabled
      });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-white text-sm font-medium mb-2" htmlFor="amount">
          Amount to swap:
        </label>
        <div className="relative">
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={handleAmountChange}
            className="w-full py-3 px-4 bg-white/5 text-white rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 pr-12"
            placeholder={`Enter amount in ${data.fromCoin}`}
            step="0.00000001"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <div className="w-6 h-6">{getCoinIcon(data.fromCoin)}</div>
          </div>
        </div>
        <p className="text-sm text-blue-300 mt-2 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Available: {fromBalance.toFixed(8)} {data.fromCoin}
        </p>
      </div>

      {estimatedAmount !== null && (
        <div className="bg-gradient-to-br from-white/5 to-white/10 p-5 rounded-xl text-white border border-white/10 relative overflow-hidden">
          <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
          <div className="relative z-10">
            <p className="text-white/60 mb-2">You will receive approximately:</p>
            <div className="flex items-center space-x-2">
              <p className="text-2xl font-bold text-white">{estimatedAmount}</p>
              <div className="w-7 h-7">{getCoinIcon(data.toCoin)}</div>
            </div>
          </div>
        </div>
      )}

      {exchangeRate && (
        <div className="bg-gradient-to-br from-white/5 to-white/10 p-4 rounded-xl text-white border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-6 h-6 mr-2">{getCoinIcon(data.fromCoin)}</div>
              <p>1 {data.fromCoin}</p>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-white/40 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <p>{displayExchangeRate !== null ? displayExchangeRate.toFixed(8) : 'N/A'} {data.toCoin}</p>
              <div className="w-6 h-6 ml-2">{getCoinIcon(data.toCoin)}</div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="text-red-400 text-sm bg-red-400/10 p-3 rounded-xl border border-red-400/20 flex items-center">
          <svg className="w-5 h-5 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </p>
      )}

      <button
        type="submit"
        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-medium text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20 flex justify-center items-center"
        disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > fromBalance || !estimatedAmount || isLoading}
      >
        {isLoading ? (
          <div className="relative w-6 h-6">
            <div className="absolute inset-0 flex items-center justify-center animate-spin-slow">
              <div className="w-full h-full border-2 border-white/30 border-t-white rounded-full"></div>
            </div>
          </div>
        ) : ( 
          'Swap'
        )}
      </button>
    </form>
  );
};

const Step3 = ({ data, error }) => {
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    // Simulate a confirmation process or check for actual error passed in data
    if (data.error) {
      setIsConfirmed(false); // Ensure not confirmed if there was an error
    } else {
      setTimeout(() => {
        setIsConfirmed(true)
      }, 3000);
    }
  }, [data]);

  // data.estimatedAmount is the one calculated with displayExchangeRate (what user saw for estimation)
  // data.actualToAmount is calculated with the original rate (what was actually swapped)

  return (
    <div className="space-y-6">
      {data.error && (
        <div className="p-4 bg-red-400/10 border border-red-400/20 rounded-xl text-center">
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-tr from-red-500/20 to-orange-500/20 border border-red-500/20 text-red-400 mb-4">
            <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-400 text-lg font-semibold mb-2">Swap Failed</p>
          <p className="text-red-400">{data.error}</p>
        </div>
      )}

      {!data.error && (
        <div className="text-center">
          {!isConfirmed ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl animate-pulse"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center animate-spin-slow">
                  <div className="w-full h-full border-2 border-blue-500/30 border-t-blue-400 rounded-full"></div>
                </div>
              </div>
              <p className="text-white">Processing your swap...</p>
            </div>
          ) : (
            <>
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-tr from-green-500/20 to-emerald-500/20 border border-green-500/20 text-green-400 mb-4">
                <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">Swap Successful</h3>
              <div className="bg-gradient-to-br from-white/5 to-white/10 p-6 rounded-xl text-white space-y-3 border border-white/10 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">You sent:</span>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">{data.amount} {data.fromCoin}</span>
                    <div className="w-5 h-5">{getCoinIcon(data.fromCoin)}</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">You received:</span>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">{data.actualToAmount || data.estimatedAmount} {data.toCoin}</span>
                    <div className="w-5 h-5">{getCoinIcon(data.toCoin)}</div>
                  </div>
                </div>
              </div>
              <p className="text-white/60 text-sm">
                Transaction ID: {Math.random().toString(36).substring(2, 15)}
              </p>
            </>
          )}
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
  const [displayExchangeRate, setDisplayExchangeRate] = useState(null);
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
          const fetchedRate = parseFloat(data.exchange_rate);
          setExchangeRate(fetchedRate);

          // Adjust displayExchangeRate for XRP and TRX
          if (fromCoin.toLowerCase() === 'xrp' || fromCoin.toLowerCase() === 'trx') {
            setDisplayExchangeRate(fetchedRate * 1.3);
          } else if (toCoin.toLowerCase() === 'xrp' || toCoin.toLowerCase() === 'trx') {
            setDisplayExchangeRate(fetchedRate / 1.3);
          } else {
            setDisplayExchangeRate(fetchedRate);
          }

        } catch (error) {
          console.error('Error fetching exchange info:', error);
          setError('Failed to fetch exchange information. Please try again later.');
        }
      }
    };

    fetchBalances();
  }, [fromCoin, toCoin]);

  useEffect(() => {
    if (amount && exchangeRate !== null) {
      if (displayExchangeRate !== null) {
        const displayEstimated = (parseFloat(amount) * displayExchangeRate).toFixed(8);
        setEstimatedAmount(displayEstimated);
      } else {
        setEstimatedAmount(null);
      }
    } else {
      setEstimatedAmount(null);
    }
  }, [amount, exchangeRate, displayExchangeRate, fromCoin, toCoin]);

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
          displayExchangeRate,
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
