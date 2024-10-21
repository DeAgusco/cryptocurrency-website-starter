import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import WalletService from '../Services/WalletService';
import { BitcoinIcon, EthereumIcon, LitecoinIcon, DogecoinIcon, UsdtIcon } from '../Auth/CoinIcons';
import VerificationModal from './VerificationModal';


const Step1 = ({ goToNextStep }) => {
  const [coins, setCoins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        setIsLoading(true);
        const wallets = await WalletService.getWallets();
        setCoins(wallets);
      } catch (error) {
        console.error('Error fetching wallets:', error);
        // Handle error (e.g., show error message to user)
      } finally {
        setIsLoading(false);
      }
    };

    fetchWallets();
  }, []);

  const handleCoinSelect = (coin) => {
    goToNextStep({ senderCoin: coin, senderWallet: coins.find(c => c.coin === coin) });
  };

  return (
    <div className="space-y-4">
      <p className="text-white text-center mb-4">Select wallet:</p>
      {isLoading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
      ) : coins.filter(coin => coin.balance > 0).length > 0 ? (
        coins.filter(coin => coin.balance > 0).map((coin) => (
          <button
            key={coin.coin}
            onClick={() => handleCoinSelect(coin.coin)}
            className="w-full py-2 px-4 bg-blue-500/20 hover:bg-blue-500/40 rounded-md font-bold text-white transition duration-300 flex items-center justify-between"
          >
            <div className="flex items-center">
              {coin.coin === 'BTC' && <BitcoinIcon />}
              {coin.coin === 'ETH' && <EthereumIcon />}
              {coin.coin === 'LTC' && <LitecoinIcon />}
              {coin.coin === 'DOGE' && <DogecoinIcon />}
              {coin.coin === 'USDT' && <UsdtIcon />}
              <span className="ml-2">{coin.coin}</span>
            </div>
            <span className="text-xs text-gray-400">{coin.balance} {coin.coin}</span>
          </button>
        ))
      ) : (
        <p className="text-white text-center">You have no coins available to send.</p>
      )}
    </div>
  );
};

const Step2 = ({ goToNextStep, data }) => {
  const coins = ['BTC', 'ETH', 'LTC', 'DOGE', 'USDT'];
  const [recipientCoin, setRecipientCoin] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (recipientCoin && address) {
      goToNextStep({ recipientCoin, address });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-white text-sm font-bold mb-2" htmlFor="recipientCoin">
          Select recipient's coin:
        </label>
        <select
          id="recipientCoin"
          value={recipientCoin}
          onChange={(e) => setRecipientCoin(e.target.value)}
          className="w-full py-2 px-3 bg-darkblue-secondary text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a coin</option>
          {coins.map((coin) => (
            <option key={coin} value={coin}>{coin}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-white text-sm font-bold mb-2" htmlFor="address">
          Recipient's address:
        </label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full py-2 px-3 bg-darkblue-secondary text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter recipient's address"
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-md font-bold text-white transition duration-300"
        disabled={!recipientCoin || !address}
      >
        Next
      </button>
    </form>
  );
};

const Step3 = ({ goToNextStep, data }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount && parseFloat(amount) > 0 && parseFloat(amount) <= data.senderWallet.balance) {
      goToNextStep({ amount });
    } else if (parseFloat(amount) > data.senderWallet.balance) {
      setError('Insufficient balance');
    } else {
      setError('Please enter a valid amount');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-white text-sm font-bold mb-2" htmlFor="amount">
          Amount to send:
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full py-2 px-3 bg-darkblue-secondary text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter amount"
          step="0.00000001"
        />
        <p className="text-sm text-gray-400 mt-2">
          Available: {data.senderWallet.balance} {data.senderWallet.coin}
        </p>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-md font-bold text-white transition duration-300"
        disabled={!amount}
      >
        Next
      </button>
    </form>
  );
};

const Step4 = ({ goToNextStep, data }) => {
  return (
    <div className="space-y-4">
      <p className="text-white text-center mb-4">Please verify yourself to send funds:</p>
      <div className="bg-darkblue-secondary p-4 rounded-md text-white">
        <p>Sending {data.amount} {data.senderWallet.coin}</p>
        <p>To: {data.address} ({data.recipientCoin})</p>
      </div>
      <button
        onClick={() => goToNextStep()}
        className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-md font-bold text-white transition duration-300"
      >
        Verify and Send
      </button>
    </div>
  );
};

const Step5 = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleVerify = () => {
    setShowVerificationModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="text-white">Processing your request...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-red-500 text-center">Error: You are not verified</p>
      <button
        onClick={handleVerify}
        className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-md font-bold text-white transition duration-300"
      >
        Click here to verify
      </button>
      {showVerificationModal && (
        <VerificationModal
          isOpen={showVerificationModal}
          onClose={() => setShowVerificationModal(false)}
        />
      )}
    </div>
  );
};

const SendModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [sendData, setSendData] = useState({});

  const steps = [
    {
      title: "Select Your Wallet",
      component: Step1,
    },
    {
      title: "Select Recipient's Address",
      component: Step2,
    },
    {
      title: "Enter Amount",
      component: Step3,
    },
    {
      title: "Verify and Send",
      component: Step4,
    },
    {
      title: "Processing",
      component: Step5,
    },
  ];

  const goToNextStep = (stepData) => {
    setSendData((prevData) => ({ ...prevData, ...stepData }));
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleClose = () => {
    setCurrentStep(0);
    setSendData({});
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
          data: sendData,
          onClose: handleClose
        }),
      }))}
      currentStep={currentStep}
    />
  );
};

export default SendModal;
