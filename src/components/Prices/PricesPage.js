import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const SearchDropdown = ({ coins, onSelect, getPriceFunction }) => {
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
              <td className="py-2 px-4 text-right text-white">${getPriceFunction(coin).toLocaleString()}</td>
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

// Skeleton components
const SkeletonSearch = () => (
  <div className="mb-6 relative">
    <div className="w-full h-10 bg-darkblue-secondary/50 animate-pulse rounded-md"></div>
  </div>
);

const SkeletonTrendCard = () => (
  <div className="relative w-full rounded-xl overflow-hidden bg-blue-500 bg-opacity-10 p-4 animate-pulse">
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center">
        <div className="w-6 h-6 rounded-full bg-white/10 mr-2"></div>
        <div className="w-24 h-5 bg-white/10 rounded"></div>
      </div>
      <div className="w-20 h-5 bg-white/10 rounded"></div>
      <div className="w-16 h-5 bg-white/10 rounded"></div>
    </div>
    <div className="h-20 mt-3 bg-white/5 rounded"></div>
  </div>
);

const SkeletonTable = () => (
  <div className="animate-pulse">
    <div className="hidden sm:grid sm:grid-cols-6 pb-2">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-6 bg-white/10 rounded mb-2"></div>
      ))}
    </div>
    {[...Array(10)].map((_, i) => (
      <div key={i} className="border-b border-gray-700 py-4">
        <div className="flex justify-between mb-2 sm:hidden">
          <div className="w-32 h-6 bg-white/10 rounded"></div>
          <div className="w-20 h-6 bg-white/10 rounded"></div>
        </div>
        <div className="hidden sm:grid sm:grid-cols-6 gap-2">
          {[...Array(6)].map((_, j) => (
            <div key={j} className="h-6 bg-white/10 rounded"></div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const PricesPage = () => {
  const [coins, setCoins] = useState([]);
  const [trendingCoins, setTrendingCoins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const searchRef = useRef(null);

  const getDisplayPrice = (coin) => {
    console.log('[DEBUG] getDisplayPrice CALLED. Coin symbol:', coin?.symbol, 'Coin price:', coin?.current_price);

    if (coin && typeof coin.symbol === 'string' && typeof coin.current_price === 'number') {
      const symbol = coin.symbol.toLowerCase();
      const originalPrice = coin.current_price;
      console.log(`[DEBUG] Processing valid coin: ${symbol}, original price: ${originalPrice}`);

      if (symbol === 'xrp') {
        console.log(`[DEBUG] XRP detected. Original price: ${originalPrice}`);
        const adjustedPrice = originalPrice * 1.3;
        console.log(`[DEBUG] XRP adjusted price: ${adjustedPrice}`);
        return adjustedPrice;
      }
      // For non-XRP coins, return original price
      console.log(`[DEBUG] Non-XRP coin (${symbol}). Returning original price: ${originalPrice}`);
      return originalPrice;
    }
    
    console.log('[DEBUG] Invalid coin object or missing properties. Coin:', coin, 'Returning 0.');
    return 0; // Fallback for invalid coin object
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/.netlify/functions/coinGeckoProx?path=coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=true');
        setCoins(response.data);

        const trendingResponse = await axios.get('/.netlify/functions/coinGeckoProx?path=search/trending');
        setTrendingCoins(trendingResponse.data.coins.map(coin => ({
          ...coin.item,
          current_price: 0,
          price_change_percentage_24h: 0
        })));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
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
  // console.log('Filtered coins to render:', filteredCoins); // We can keep this commented if the above is too noisy

  return (
    <div className="p-6 bg-darkblue text-white">
      <h1 className="text-3xl font-bold mb-6">Cryptocurrency Prices</h1>

      {loading ? (
        <>
          {/* Skeleton UI */}
          <SkeletonSearch />
          
          <div className="mt-8 relative backdrop-blur-md bg-darkblue/30 p-8 rounded-lg shadow-lg border border-white/20 z-10">
            <div className="h-7 w-40 bg-white/10 rounded mb-4"></div>
            <div className="flex flex-col space-y-4 md:flex-row md:space-x-4">
              {[...Array(3)].map((_, i) => (
                <SkeletonTrendCard key={i} />
              ))}
            </div>
          </div>
          
          <div className="mt-8 relative backdrop-blur-md bg-darkblue/30 p-8 rounded-lg shadow-lg border border-white/20 z-10">
            <div className="h-7 w-32 bg-white/10 rounded mb-4"></div>
            <div className="overflow-x-auto">
              <SkeletonTable />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Search Bar */}
          <div className="mb-6 relative" ref={searchRef}>
            <input
              type="text"
              placeholder="Search coins..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full p-2 bg-darkblue-secondary text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {showDropdown && <SearchDropdown coins={searchResults} onSelect={handleCoinSelect} getPriceFunction={getDisplayPrice} />}
          </div>

          {/* Market Trends */}
          <div className="mt-8 relative backdrop-blur-md bg-darkblue/30 p-8 rounded-lg shadow-lg border border-white/20 z-10">
            <h2 className="text-xl font-semibold mb-4 text-white">Market Trends</h2>
            <div className="flex flex-col space-y-4 md:flex-row md:space-x-4">
              {trendingCoins.slice(0, 3).map((coin) => {
                const trendDisplayPrice = getDisplayPrice(coin);
                const trendFormattedPrice = trendDisplayPrice.toLocaleString();
                return (
                  <div key={coin.id} className="relative w-full rounded-xl overflow-hidden bg-blue-500 bg-opacity-10 p-4">
                    <div className="flex justify-between items-center text-white mb-2">
                      <div className="flex items-center">
                        <img src={coin.thumb} alt={coin.name} className="w-6 h-6 mr-2" />
                        <span>{coin.name} ({coin.symbol.toUpperCase()})</span>
                      </div>
                      <span>${trendFormattedPrice}</span>
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
                );
              })}
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
                  {filteredCoins.map((coin) => {
                    const displayPrice = getDisplayPrice(coin);
                    // Log the price *before* toLocaleString() for the specific coin row
                    if (coin.symbol.toLowerCase() === 'xrp') {
                      console.log(`[DEBUG] XRP price before toLocaleString(): ${displayPrice}, type: ${typeof displayPrice}`);
                    }
                    const formattedPrice = displayPrice.toLocaleString();
                    if (coin.symbol.toLowerCase() === 'xrp') {
                      console.log(`[DEBUG] XRP price AFTER toLocaleString(): ${formattedPrice}, type: ${typeof formattedPrice}`);
                    }

                    return (
                      <tr key={coin.id} className="border-b border-gray-700 flex flex-col sm:table-row mb-4 sm:mb-0">
                        <td className="py-2 pr-2 flex items-center justify-between sm:table-cell">
                          <div className="flex items-center">
                            <img src={coin.image} alt={coin.name} className="w-6 h-6 mr-2" />
                            <span className="truncate max-w-[100px]">{coin.name}</span>
                          </div>
                          <span className="sm:hidden text-sm">${formattedPrice}</span>
                        </td>
                        <td className="pr-2 hidden sm:table-cell">${formattedPrice}</td>
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PricesPage;
