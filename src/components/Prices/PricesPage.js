import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const SearchDropdown = ({ coins, onSelect }) => {
  if (coins.length === 0) return null;

  return (
    <div className="absolute z-[100] w-full mt-1 bg-darkblue-secondary rounded-md shadow-lg max-h-60 overflow-auto">
      <table className="w-full">
        <thead>
          <tr className="text-xs text-gray-400 border-b border-gray-700">
            <th className="py-2 px-4 text-left">Coin</th>
            <th className="py-2 px-4 text-right">Price</th>
            <th className="py-2 px-4 text-right">24h Change</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => (
            <tr 
              key={coin.id} 
              className="hover:bg-blue-500 hover:bg-opacity-10 cursor-pointer"
              onClick={() => onSelect(coin)}
            >
              <td className="py-2 px-4 flex items-center">
                <img src={coin.image} alt={coin.name} className="w-6 h-6 mr-2" />
                <span className="text-white">{coin.name}</span>
              </td>
              <td className="py-2 px-4 text-right text-white">${coin.current_price.toLocaleString()}</td>
              <td className={`py-2 px-4 text-right ${coin.price_change_percentage_24h > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {coin.price_change_percentage_24h.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const PricesPage = () => {
  const [coins, setCoins] = useState([]);
  const [trendingCoins, setTrendingCoins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/.netlify/functions/coinGeckoProx?path=coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=true');
        setCoins(response.data);

        const trendingResponse = await axios.get('/.netlify/functions/coinGeckoProx?path=search/trending');
        setTrendingCoins(trendingResponse.data.coins.map(coin => ({
          ...coin.item,
          current_price: 0,
          price_change_percentage_24h: 0
        })));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const results = coins.filter(coin =>
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results.slice(0, 5));
      setShowDropdown(true);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  }, [searchTerm, coins]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCoinSelect = (coin) => {
    setSearchTerm(coin.name);
    setShowDropdown(false);
  };

  const filteredCoins = searchTerm.length > 0 ? searchResults : coins;

  return (
    <div className="p-6 bg-darkblue text-white">
      <h1 className="text-3xl font-bold mb-6">Cryptocurrency Prices</h1>

      {/* Search Bar */}
      <div className="mb-6 relative" ref={searchRef}>
        <input
          type="text"
          placeholder="Search coins..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-2 bg-darkblue-secondary text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {showDropdown && <SearchDropdown coins={searchResults} onSelect={handleCoinSelect} />}
      </div>

      {/* Market Trends */}
      <div className="mt-8 relative backdrop-blur-md bg-darkblue/30 p-8 rounded-lg shadow-lg border border-white/20 z-10">
        <h2 className="text-xl font-semibold mb-4 text-white">Market Trends</h2>
        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4">
          {trendingCoins.slice(0, 3).map((coin) => (
            <div key={coin.id} className="relative w-full rounded-xl overflow-hidden bg-blue-500 bg-opacity-10 p-4">
              <div className="flex justify-between items-center text-white mb-2">
                <div className="flex items-center">
                  <img src={coin.thumb} alt={coin.name} className="w-6 h-6 mr-2" />
                  <span>{coin.name} ({coin.symbol.toUpperCase()})</span>
                </div>
                <span>${coin.current_price.toLocaleString()}</span>
                <span className={coin.price_change_percentage_24h > 0 ? 'text-green-400' : 'text-red-400'}>
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </span>
              </div>
              <div className="h-20 mt-3">
                <img 
                  src={`https://www.coingecko.com/coins/${coin.coin_id}/sparkline.svg`} 
                  alt={`${coin.name} price trend`}
                  className="w-full h-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Coins Table */}
      <div className="mt-8 relative backdrop-blur-md bg-darkblue/30 p-8 rounded-lg shadow-lg border border-white/20 z-10">
        <h2 className="text-xl font-semibold mb-4 text-white">All Coins</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-full table-auto">
            <thead className="hidden sm:table-header-group">
              <tr className="text-left text-white">
                <th className="pb-2 pr-2">Coin</th>
                <th className="pb-2 pr-2">Price</th>
                <th className="pb-2 pr-2">24h Change</th>
                <th className="pb-2 pr-2">Market Cap</th>
                <th className="pb-2 pr-2">Volume (24h)</th>
                <th className="pb-2 pr-2">Circulating Supply</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoins.map((coin) => (
                <tr key={coin.id} className="border-b border-gray-700 flex flex-col sm:table-row mb-4 sm:mb-0">
                  <td className="py-2 pr-2 flex items-center justify-between sm:table-cell">
                    <div className="flex items-center">
                      <img src={coin.image} alt={coin.name} className="w-6 h-6 mr-2" />
                      <span className="truncate max-w-[100px]">{coin.name}</span>
                    </div>
                    <span className="sm:hidden text-sm">${coin.current_price.toLocaleString()}</span>
                  </td>
                  <td className="pr-2 hidden sm:table-cell">${coin.current_price.toLocaleString()}</td>
                  <td className={`pr-2 ${coin.price_change_percentage_24h > 0 ? 'text-green-400' : 'text-red-400'} flex justify-between sm:table-cell`}>
                    <span className="sm:hidden text-sm">24h Change:</span>
                    <span className="text-sm">{coin.price_change_percentage_24h.toFixed(2)}%</span>
                  </td>
                  <td className="pr-2 flex justify-between sm:table-cell">
                    <span className="sm:hidden text-sm">Market Cap:</span>
                    <span className="text-sm">${coin.market_cap.toLocaleString()}</span>
                  </td>
                  <td className="pr-2 flex justify-between sm:table-cell">
                    <span className="sm:hidden text-sm">Volume (24h):</span>
                    <span className="text-sm">${coin.total_volume.toLocaleString()}</span>
                  </td>
                  <td className="pr-2 flex justify-between sm:table-cell">
                    <span className="sm:hidden text-sm">Circulating Supply:</span>
                    <span className="text-sm">{coin.circulating_supply.toLocaleString()} {coin.symbol.toUpperCase()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PricesPage;
