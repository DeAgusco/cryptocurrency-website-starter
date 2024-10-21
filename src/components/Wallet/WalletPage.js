import React, { useState, useEffect } from 'react';
import WalletService from '../Services/WalletService';
import ReceiveModal from '../Dashboard/ReceiveModal';
import { BitcoinIcon, EthereumIcon, LitecoinIcon, DogecoinIcon, UsdtIcon } from '../Auth/CoinIcons';
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

const WalletCard = ({ wallet, onToggleAddresses, onReceive }) => {
  return (
    <div className="relative backdrop-blur-md bg-darkblue/30 p-6 rounded-lg shadow-lg border border-white/20 z-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {getCoinIcon(wallet.coin)}
          <h3 className="text-xl font-semibold text-white ml-2">{wallet.coin} Wallet</h3>
        </div>
        <p className="text-2xl font-bold text-white">{wallet.balance} {wallet.coin}</p>
      </div>
      <div className="flex justify-between items-center space-x-2">
        <button 
          onClick={() => onToggleAddresses(wallet.id)}
          className="w-full py-2 px-4 bg-none hover:scale-105 rounded-md text-blue-500 text- transition duration-300"
        >
          <u>Addresses</u>
        </button>
        <button
          onClick={() => onReceive(wallet.coin)}
          className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-md font-bold text-white transition duration-300"
        >
          Receive
        </button>
      </div>
    </div>
  );
};

const AddressList = ({ addresses }) => {
  return (
    <div className="mt-4 space-y-3">
      {addresses.map((addressObj, index) => (
        <div key={index} className="bg-gradient-to-r from-darkblue/30 to-blue-500/30 p-4 rounded-lg shadow-md border border-white/10 transition-all duration-300 hover:shadow-lg hover:border-white/20">
          <div className="flex items-center justify-between">
            <p className="text-white break-all font-mono text-sm">{addressObj.address}</p>
            <button className="ml-2 p-2 bg-blue-500 hover:bg-blue-600 rounded-full text-white transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const WalletPage = () => {
  const [wallets, setWallets] = useState([]);
  const [expandedWallets, setExpandedWallets] = useState({});
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState('');
  const [walletData, setWalletData] = useState(null);
  const [showBalance, setShowBalance] = useState(false);
  const toggleBalance = () => {
    setShowBalance(!showBalance);
  };

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const wallet = await DashboardService.getWallet();
        setWalletData(wallet);
        const fetchedWallets = await WalletService.getWallets();
        setWallets(fetchedWallets);
      } catch (error) {
        console.error('Error fetching wallets:', error);
      }
    };

    fetchWallets();
  }, []);

  const handleToggleAddresses = (walletId) => {
    setExpandedWallets(prev => ({
      ...prev,
      [walletId]: !prev[walletId]
    }));
  };

  const handleReceive = (coin) => {
    setSelectedCoin(coin);
    setIsReceiveModalOpen(true);
  };

  return (
    <div className="p-6 bg-darkblue text-white">
      <BalanceCard 
        balance={walletData?.balance} 
        showBalance={showBalance} 
        toggleBalance={toggleBalance} 
      />
      <h1 className="mt-3 text-3xl font-bold mb-6">Your Wallets</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wallets.map(wallet => (
          <div key={wallet.id}>
            <WalletCard 
              wallet={wallet} 
              onToggleAddresses={handleToggleAddresses} 
              onReceive={handleReceive}
            />
            {expandedWallets[wallet.id] && <AddressList addresses={wallet.address} />}
          </div>
        ))}
      </div>
      <ReceiveModal
        isOpen={isReceiveModalOpen}
        onClose={() => setIsReceiveModalOpen(false)}
        initialCoin={selectedCoin}
      />
    </div>
  );
};

export default WalletPage;
