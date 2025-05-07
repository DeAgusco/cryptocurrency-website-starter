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
        <div className="flex justify-center items-center h-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : coins.filter(coin => typeof coin.balance === 'number' && coin.balance > 0).length > 0 ? (
        coins.filter(coin => typeof coin.balance === 'number' && coin.balance > 0).map((coin) => (
          <button
            key={coin.coin}
            onClick={() => handleCoinSelect(coin)}
            className="w-full py-3 px-4 bg-darkblue-secondary hover:bg-blue-700/30 rounded-md font-bold text-white transition duration-300 flex items-center justify-between"
          >
            <div className="flex items-center">
              {getCoinIcon(coin.coin)}
              <span className="ml-3 text-lg">{coin.coin}</span>
            </div>
            <span className="text-sm text-gray-300">
              {typeof coin.balance === 'number' ? coin.balance.toFixed(8) : 'N/A'} {coin.coin}
            </span>
          </button>
        ))
      ) : (
        <p className="text-white text-center">You have no coins with a balance available to send.</p>
      )}
    </div>
  );
};

const Step2 = ({ goToNextStep, data, setData }) => {
  const availableCoinsForRecipient = ['BTC', 'ETH', 'LTC', 'DOGE', 'USDT', 'USDC', 'XRP'];
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-white text-sm font-bold mb-2" htmlFor="recipientCoin">
          Recipient's Coin Type:
        </label>
        <select
          id="recipientCoin"
          value={recipientCoin}
          onChange={(e) => setRecipientCoin(e.target.value)}
          className="w-full py-2 px-3 bg-darkblue-secondary text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select coin</option>
          {availableCoinsForRecipient.map((coin) => (
            <option key={coin} value={coin}>{coin}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-white text-sm font-bold mb-2" htmlFor="address">
          Recipient's Address:
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
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md font-bold text-white transition duration-300 disabled:opacity-50"
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-white text-sm font-bold mb-2" htmlFor="amount">
          Amount to send ({data.senderWallet?.coin}):
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full py-2 px-3 bg-darkblue-secondary text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="0.00"
          step="any"
        />
        {data.senderWallet && (
          <p className="text-sm text-gray-400 mt-1">
            Available: {typeof senderBalance === 'number' ? senderBalance.toFixed(8) : 'N/A'} {data.senderWallet.coin}
          </p>
        )}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md font-bold text-white transition duration-300 disabled:opacity-50"
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
      <div className="bg-darkblue-secondary p-4 rounded-md text-white space-y-2">
        <p><strong>Sending:</strong> {data.amount} {data.senderWallet?.coin}</p>
        <p><strong>From:</strong> Your {data.senderWallet?.coin} Wallet</p>
        <p className="break-all"><strong>To Address:</strong> {data.address}</p>
        <p><strong>Recipient Coin:</strong> {data.recipientCoin}</p>
      </div>
      <p className="text-yellow-400 text-xs text-center">You will be asked to verify your identity before sending.</p>
      <button
        onClick={() => goToNextStep()}
        className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 rounded-md font-bold text-white transition duration-300"
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
      <div className="flex flex-col items-center justify-center space-y-4 h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="text-white">Preparing verification...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-center">
      <p className="text-red-400 text-lg">Verification Required</p>
      <p className="text-white text-sm">For security reasons, please complete a quick verification to proceed with your transaction.</p>
      <button
        onClick={handleActualVerifyRequest}
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-md font-bold text-white transition duration-300"
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
