import React, { useState, useCallback, useEffect } from 'react';
import Modal from './Modal';
import DashboardService from '../Services/DashboardService';
import { BitcoinIcon, EthereumIcon, LitecoinIcon, DogecoinIcon, UsdcIcon, XrpIcon } from '../Auth/CoinIcons';

const Step1 = ({ goToNextStep }) => {
  const [coin, setCoin] = useState('BTC');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await DashboardService.requestAddress(coin);
      goToNextStep(response);
    } catch (error) {
      setError('Failed to request address. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getCoinIcon = (coinType) => {
    switch (coinType) {
      case 'BTC': return <BitcoinIcon />;
      case 'ETH': return <EthereumIcon />;
      case 'LTC': return <LitecoinIcon />;
      case 'DOGE': return <DogecoinIcon />;
      case 'USDC': return <UsdcIcon />;
      case 'XRP': return <XrpIcon />;
      default: return null;
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-white text-sm font-bold mb-2" htmlFor="coin">
          Select Coin
        </label>
        <select
          id="coin"
          value={coin}
          onChange={(e) => setCoin(e.target.value)}
          className="w-full py-2 px-3 bg-darkblue-secondary text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {['BTC', 'ETH', 'LTC', 'DOGE', 'USDC', 'XRP'].map((coinType) => (
            <option key={coinType} value={coinType}>
              {coinType}
            </option>
          ))}
        </select>
        <div className="icon-list">
          {coin && <div className="icon-container">{getCoinIcon(coin)}</div>}
        </div>
      </div>
      
      {error && <p className="text-red-500 text-xs italic">{error}</p>}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-md font-bold text-white transition duration-300 disabled:bg-gray-500/50 disabled:cursor-not-allowed"
      >
        {isLoading ? <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div> : 'Request Address'}
      </button>
    </form>
  );
  
};

const Step2 = ({ data }) => {
  const [copied, setCopied] = useState(false);
  const getCoinIcon = (coinType) => {
    switch (coinType) {
      case 'BTC': return <BitcoinIcon />;
      case 'ETH': return <EthereumIcon />;
      case 'LTC': return <LitecoinIcon />;
      case 'DOGE': return <DogecoinIcon />;
      case 'USDC': return <UsdcIcon />;
      case 'XRP': return <XrpIcon />;
      default: return null;
    }
  };
  return (
  <div className="space-y-4">
    <p className="text-center text-white mb-4">Scan the QR code or copy the address below to receive funds:</p>
    <div className="bg-darkblue-secondary text-center p-3 rounded-md break-all text-sm mb-2 text-white">
      {data.address}
    </div>
    <div className="flex items-center justify-center space-x-2">
      <p className="text-white text-center">Send above: {data.coin_amount}</p>
      {getCoinIcon(data.coin)}<span className="text-xs">|| $20</span>
    </div>
    <p className="text-red-500 text-center">Sending less than $20 can result in loss of funds.</p>
    <button 
      onClick={() => {
        navigator.clipboard.writeText(data.address);
        setCopied(true);
      }}
      disabled={copied}
      className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-md font-bold text-white transition duration-300"
    >
      {copied ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
            <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H6zm3 0a1 1 0 000 2h3a1 1 0 100-2H9zm3 0a1 1 0 000 2h.01a1 1 0 100-2H12zm0 3a1 1 0 000 2h.01a1 1 0 100-2H12zm-3 0a1 1 0 000 2h3a1 1 0 100-2H9zm-3 0a1 1 0 000 2h.01a1 1 0 100-2H6z" />
          </svg>
          Copy Address
        </>
      )}
    </button>
  </div>
  );
};

const ReceiveModal = ({ isOpen, onClose, initialCoin }) => {
  const [addressData, setAddressData] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && initialCoin) {
      fetchAddress(initialCoin);
    }
  }, [isOpen, initialCoin]);

  const fetchAddress = async (coin) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await DashboardService.requestAddress(coin);
      setAddressData(response);
      setCurrentStep(1);
    } catch (error) {
      setError('Failed to fetch address. Please try again.');
      console.error('Error fetching address:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetModal = useCallback(() => {
    setAddressData(null);
    setCurrentStep(0);
    setError('');
  }, []);

  const handleClose = useCallback(() => {
    resetModal();
    onClose();
  }, [onClose, resetModal]);

  const steps = [
    {
      title: "Request Payment Address",
      component: Step1,
    },
    {
      title: "Payment Information",
      component: Step2,
      qrValue: addressData ? addressData.address : '',
    },
  ];

  if (isLoading) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        steps={[{ title: "Requesting Address", component: () => <div className="text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div></div> }]}
        currentStep={0}
      />
    );
  }

  if (error) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        steps={[{ title: "Error", component: () => <div className="text-center text-red-500">{error}</div> }]}
        currentStep={0}
      />
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      steps={steps.map((step, index) => ({
        ...step,
        component: (props) => (
          <step.component
            {...props}
            data={addressData}
            goToNextStep={(data) => {
              setAddressData(data);
              setCurrentStep(1);
            }}
          />
        ),
      }))}
      currentStep={currentStep}
    />
  );
};

export default ReceiveModal;
