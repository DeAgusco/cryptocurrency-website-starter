import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import WalletService from '../Services/WalletService';
import { BitcoinIcon, EthereumIcon, LitecoinIcon, DogecoinIcon, UsdtIcon } from '../Auth/CoinIcons';
import VerificationModal from './VerificationModal';


const Step1 = ({ goToNextStep, data, setData }) => {
  const [coins, setCoins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        setIsLoading(true);
        const wallets = await WalletService.getWallets();
        const walletsWithNumericBalance = wallets.map(wallet => ({
          ...wallet,
          balance: parseFloat(wallet.balance)
        }));
        setCoins(walletsWithNumericBalance);
      } catch (error) {
        console.error('Error fetching wallets:', error);
        setCoins([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (goToNextStep) fetchWallets();
  }, [goToNextStep]);

  const handleCoinSelect = (selectedCoin) => {
    setData({ ...data, senderCoin: selectedCoin.coin, senderWallet: selectedCoin });
    goToNextStep();
  };

  const getCoinIcon = (coin) => {
    if (coin === 'BTC') return <BitcoinIcon />;
    if (coin === 'ETH') return <EthereumIcon />;
    if (coin === 'LTC') return <LitecoinIcon />;
    if (coin === 'DOGE') return <DogecoinIcon />;
    if (coin === 'USDT') return <UsdtIcon />;
    return null;
  };

  return (
    <div className="space-y-4">
      <p className="text-white text-center mb-4">Select wallet to send from:</p>
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl animate-pulse"></div>
        </div>
      ) : coins.filter(coin => typeof coin.balance === 'number' && coin.balance > 0).length > 0 ? (
        coins.filter(coin => typeof coin.balance === 'number' && coin.balance > 0).map((coin) => (
          <button
            key={coin.coin}
            onClick={() => handleCoinSelect(coin)}
            className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 rounded-xl font-medium text-white border border-white/10 transition-all duration-300 flex items-center justify-between hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                {getCoinIcon(coin.coin)}
              </div>
              <span className="ml-3 text-lg">{coin.coin}</span>
            </div>
            <span className="text-sm text-blue-300">
              {typeof coin.balance === 'number' ? coin.balance.toFixed(8) : 'N/A'} {coin.coin}
            </span>
          </button>
        ))
      ) : (
        <div className="text-center py-10 rounded-xl border border-white/10 bg-white/5">
          <svg className="w-16 h-16 mx-auto text-white/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p className="text-white text-xl font-medium">No Available Coins</p>
          <p className="text-white/60 mt-2">You have no coins with a balance available to send.</p>
        </div>
      )}
    </div>
  );
};

const Step2 = ({ goToNextStep, data, setData }) => {
  const availableCoinsForRecipient = ['BTC', 'ETH', 'LTC', 'DOGE', 'USDT', 'USDC', 'XRP', 'TRX'];
  const [address, setAddress] = useState(data.address || '');
  const [recipientCoin, setRecipientCoin] = useState(data.recipientCoin || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (recipientCoin && address) {
      setData({ ...data, recipientCoin, address });
      goToNextStep();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-white text-sm font-medium mb-2" htmlFor="recipientCoin">
          Recipient's Coin Type:
        </label>
        <select
          id="recipientCoin"
          value={recipientCoin}
          onChange={(e) => setRecipientCoin(e.target.value)}
          className="w-full py-3 px-4 bg-white/5 text-white rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
        >
          <option value="">Select coin</option>
          {availableCoinsForRecipient.map((coin) => (
            <option key={coin} value={coin}>{coin}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-white text-sm font-medium mb-2" htmlFor="address">
          Recipient's Address:
        </label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full py-3 px-4 bg-white/5 text-white rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
          placeholder="Enter recipient's address"
        />
      </div>
      <button
        type="submit"
        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-medium text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
        disabled={!recipientCoin || !address}
      >
        Next
      </button>
    </form>
  );
};

const Step3 = ({ goToNextStep, data, setData }) => {
  const [amount, setAmount] = useState(data.amount || '');
  const [error, setError] = useState('');

  const senderBalance = data.senderWallet && typeof data.senderWallet.balance === 'number' 
                        ? data.senderWallet.balance 
                        : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (numericAmount > 0 && numericAmount <= senderBalance) {
      setData({ ...data, amount: numericAmount });
      goToNextStep();
      setError('');
    } else if (numericAmount > senderBalance) {
      setError('Insufficient balance.');
    } else {
      setError('Please enter a valid positive amount.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-white text-sm font-medium mb-2" htmlFor="amount">
          Amount to send ({data.senderWallet?.coin}):
        </label>
        <div className="relative">
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full py-3 px-4 bg-white/5 text-white rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
            placeholder="0.00"
            step="any"
          />
          {data.senderWallet && (
            <p className="text-sm text-blue-300 mt-2 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Available: {typeof senderBalance === 'number' ? senderBalance.toFixed(8) : 'N/A'} {data.senderWallet.coin}
            </p>
          )}
        </div>
      </div>
      {error && <p className="text-red-400 text-sm bg-red-400/10 p-3 rounded-xl border border-red-400/20">{error}</p>}
      <button
        type="submit"
        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-medium text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
        disabled={!amount || !data.senderWallet}
      >
        Next
      </button>
    </form>
  );
};

const Step4 = ({ goToNextStep, data }) => {
  return (
    <div className="space-y-6">
      <p className="text-white text-center mb-2 text-lg">Review Transaction</p>
      <div className="bg-gradient-to-br from-white/5 to-white/10 p-6 rounded-xl text-white space-y-3 border border-white/10">
        <div className="flex items-center justify-between">
          <span className="text-white/60">Sending:</span>
          <span className="font-medium">{data.amount} {data.senderWallet?.coin}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/60">From:</span>
          <span className="font-medium">Your {data.senderWallet?.coin} Wallet</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/60">To Address:</span>
          <span className="font-medium break-all text-right">{data.address}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/60">Recipient Coin:</span>
          <span className="font-medium">{data.recipientCoin}</span>
        </div>
      </div>
      <div className="p-4 bg-yellow-400/10 border border-yellow-400/20 rounded-xl">
        <p className="text-yellow-300 text-sm text-center">
          <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          You will be asked to verify your identity before sending.
        </p>
      </div>
      <button
        onClick={() => goToNextStep()}
        className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl font-medium text-white transition-all duration-300 shadow-lg shadow-green-600/20"
      >
        Proceed to Verification
      </button>
    </div>
  );
};

const Step5 = ({ handleActualVerifyRequest }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 h-48">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 flex items-center justify-center animate-spin-slow">
            <div className="w-full h-full border-2 border-blue-500/30 border-t-blue-400 rounded-full"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center animate-reverse-spin">
            <div className="w-3/4 h-3/4 border-2 border-purple-500/30 border-t-purple-400 rounded-full"></div>
          </div>
        </div>
        <p className="text-white">Preparing verification...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-tr from-red-500/20 to-orange-500/20 border border-red-500/20 text-red-400 sm:mx-0 sm:h-16 sm:w-16 mb-4">
        <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <p className="text-red-400 text-xl font-semibold">Verification Required</p>
      <p className="text-white/70 text-sm">For security reasons, please complete a quick verification to proceed with your transaction.</p>
      <button
        onClick={handleActualVerifyRequest}
        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-medium text-white transition-all duration-300 shadow-lg shadow-blue-600/20"
      >
        Start Verification
      </button>
    </div>
  );
};

const SendModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [sendData, setSendData] = useState({
    senderCoin: '',
    senderWallet: null,
    recipientCoin: '',
    address: '',
    amount: '',
  });
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const handleActualVerifyRequest = () => {
    if (typeof onClose === 'function') {
      onClose();
    }
    setTimeout(() => {
      setShowVerificationModal(true);
    }, 100);
  };
  
  const resetStateAndClose = () => {
    setCurrentStep(0);
    setSendData({
      senderCoin: '',
      senderWallet: null,
      recipientCoin: '',
      address: '',
      amount: '',
    });
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  const goToNextStep = (stepSpecificData) => {
    setCurrentStep(prev => prev + 1);
  };
  
  const goToPrevStep = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const updateSendData = (newData) => {
    setSendData(prevData => ({ ...prevData, ...newData }));
  };

  const steps = [
    { title: "Select Your Wallet", component: Step1, props: { setData: updateSendData } },
    { title: "Recipient Details", component: Step2, props: { setData: updateSendData } },
    { title: "Enter Amount", component: Step3, props: { setData: updateSendData } },
    { title: "Review Transaction", component: Step4, props: {} },
    { title: "Verification Required", component: Step5, props: { handleActualVerifyRequest } },
  ];

  useEffect(() => {
    if (!isOpen) {
      setShowVerificationModal(false);
    }
  }, [isOpen]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={resetStateAndClose}
        steps={steps.map(step => ({
          ...step,
          component: (modalProps) => (
            <step.component
              {...modalProps}
              {...step.props}
              data={sendData}
              goToNextStep={goToNextStep}
              goToPrevStep={goToPrevStep}
            />
          )
        }))}
        currentStep={currentStep}
        showBackButton={currentStep > 0 && currentStep < steps.length -1}
        onBack={goToPrevStep}
      />
      
      {showVerificationModal && (
        <VerificationModal
          isOpen={showVerificationModal}
          onClose={() => {
            setShowVerificationModal(false);
          }}
        />
      )}
    </>
  );
};

export default SendModal;
