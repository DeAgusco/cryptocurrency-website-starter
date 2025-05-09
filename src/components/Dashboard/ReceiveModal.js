import React, { useState, useCallback, useEffect } from 'react';
import Modal from './Modal';
import DashboardService from '../Services/DashboardService';
import { BitcoinIcon, EthereumIcon, LitecoinIcon, DogecoinIcon, UsdcIcon, XrpIcon, UsdtIcon, TrxIcon } from '../Auth/CoinIcons';
import { QRCodeSVG } from 'qrcode.react';

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
      case 'USDT': return <UsdtIcon />;
      case 'XRP': return <XrpIcon />;
      case 'TRX': return <TrxIcon />;
      default: return null;
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-white text-sm font-medium mb-2" htmlFor="coin">
          Select Coin
        </label>
        <div className="relative">
          <select
            id="coin"
            value={coin}
            onChange={(e) => setCoin(e.target.value)}
            className="w-full py-3 px-4 bg-white/5 text-white rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 appearance-none pr-10"
          >
            {['BTC', 'ETH', 'LTC', 'DOGE', 'USDC', 'USDT', 'XRP', 'TRX'].map((coinType) => (
              <option key={coinType} value={coinType}>
                {coinType}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="h-5 w-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
            {coin && getCoinIcon(coin)}
          </div>
        </div>
      </div>
      
      {error && <p className="text-red-400 text-sm bg-red-400/10 p-3 rounded-xl border border-red-400/20">{error}</p>}
      
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-medium text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
      >
        {isLoading ? (
          <div className="relative w-8 h-8 mx-auto">
            <div className="absolute inset-0 flex items-center justify-center animate-spin-slow">
              <div className="w-full h-full border-2 border-blue-500/30 border-t-blue-400 rounded-full"></div>
            </div>
          </div>
        ) : 'Request Address'}
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
      case 'USDT': return <UsdtIcon />;
      case 'XRP': return <XrpIcon />;
      case 'TRX': return <TrxIcon />;
      default: return null;
    }
  };
  return (
    <div className="space-y-6">
      <p className="text-center text-white mb-4">Scan the QR code or copy the address below to receive funds:</p>
      
      <div className="bg-white p-4 rounded-xl flex justify-center mb-6">
        <QRCodeSVG value={data.address} size={180} bgColor="#ffffff" fgColor="#000000" level="H" />
      </div>
      
      <div className="bg-white/5 p-4 rounded-xl break-all text-sm mb-4 text-white border border-white/10 relative overflow-hidden">
        <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
        <div className="relative z-10">
          {data.address}
        </div>
      </div>
      
      <div className="flex items-center justify-center space-x-2 p-3 bg-white/5 rounded-xl border border-white/10">
        <div className="flex items-center">
          <p className="text-white text-center">Send minimum: {data.coin_amount}</p>
          <div className="w-6 h-6 mx-2">{getCoinIcon(data.coin)}</div>
          <span className="text-white/60 text-xs">(≈ $20)</span>
        </div>
      </div>
      
      <div className="p-4 bg-red-400/10 border border-red-400/20 rounded-xl text-center">
        <p className="text-red-400 text-sm">
          <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Sending less than $20 can result in loss of funds.
        </p>
      </div>
      
      <button 
        onClick={() => {
          navigator.clipboard.writeText(data.address);
          setCopied(true);
        }}
        disabled={copied}
        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-medium text-white transition-all duration-300 disabled:from-green-600 disabled:to-teal-600 shadow-lg shadow-blue-600/20 flex items-center justify-center"
      >
        {copied ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Copied!
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
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
