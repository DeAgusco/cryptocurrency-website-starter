import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const SearchDropdown = ({ coins, onSelect, getPriceFunction }) => {
  if (coins.length === 0) return null;

  // Format price for responsive display
  const formatPrice = (price, isMobile = false) => {
    return price.toLocaleString('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: isMobile ? 0 : 2,
      maximumFractionDigits: isMobile ? 0 : 2
    }).replace('$', '');
  };

  const isMobile = window.innerWidth < 640;

  return (
    <div className="absolute z-[100] w-full mt-1 bg-gradient-to-br from-[#0f172a] to-[#131b2e] rounded-xl shadow-lg max-h-60 overflow-auto border border-blue-500/20 backdrop-blur-lg">
      <table className="w-full">
        <thead>
          <tr className="text-xs text-blue-300 border-b border-white/10">
            <th className="py-3 px-4 text-left">Coin</th>
            <th className="py-3 px-4 text-right">Price</th>
            <th className="py-3 px-4 text-right">24h Change</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => (
            <tr 
              key={coin.id} 
              className="hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 transition-colors duration-200"
              onClick={() => onSelect(coin)}
            >
              <td className="py-3 px-4 flex items-center">
                <img src={coin.image} alt={coin.name} className="w-8 h-8 mr-3 rounded-full" />
                <div>
                  <div className="text-white font-medium">{coin.name}</div>
                  <div className="text-xs text-white/60">{coin.symbol.toUpperCase()}</div>
                </div>
              </td>
              <td className="py-3 px-4 text-right text-white font-medium">${formatPrice(getPriceFunction(coin), isMobile)}</td>
              <td className={`py-3 px-4 text-right ${coin.price_change_percentage_24h > 0 ? 'text-green-400' : 'text-red-400'} font-medium`}>
                {coin.price_change_percentage_24h > 0 ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
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
    <div className="w-full h-12 bg-white/5 animate-pulse rounded-xl border border-white/10"></div>
  </div>
);

const SkeletonTrendCard = () => (
  <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-5 animate-pulse border border-white/10 backdrop-blur-sm">
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-white/10 mr-3"></div>
        <div className="w-28 h-5 bg-white/10 rounded-md"></div>
      </div>
      <div className="w-24 h-6 bg-white/10 rounded-md"></div>
    </div>
    <div className="flex justify-between mt-3">
      <div className="w-20 h-8 bg-white/10 rounded-md"></div>
      <div className="w-16 h-6 bg-white/10 rounded-md"></div>
    </div>
    <div className="h-32 mt-5 bg-white/5 rounded-md"></div>
  </div>
);

const SkeletonTable = () => (
  <div className="animate-pulse">
    <div className="hidden lg:grid lg:grid-cols-6 pb-4 border-b border-white/10">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-6 bg-white/10 rounded-md"></div>
      ))}
    </div>
    {[...Array(10)].map((_, i) => (
      <div key={i} className="border-b border-white/5 py-5">
        <div className="flex justify-between mb-2 lg:hidden">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-white/10 mr-3"></div>
            <div className="w-28 h-5 bg-white/10 rounded-md"></div>
          </div>
          <div className="w-20 h-6 bg-white/10 rounded-md"></div>
        </div>
        <div className="hidden lg:grid lg:grid-cols-6 gap-4 items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-white/10 mr-3"></div>
            <div className="w-28 h-5 bg-white/10 rounded-md"></div>
          </div>
          {[...Array(5)].map((_, j) => (
            <div key={j} className="h-6 bg-white/10 rounded-md"></div>
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
  const [visibleCoinsCount, setVisibleCoinsCount] = useState(20);
  const searchRef = useRef(null);
  const [showPrices, setShowPrices] = useState(true);

  const getDisplayPrice = (coin) => {
    if (coin && typeof coin.symbol === 'string' && typeof coin.current_price === 'number') {
      const symbol = coin.symbol.toLowerCase();
      const originalPrice = coin.current_price;

      if (symbol === 'xrp') {
        return originalPrice * 1.3;
      } else if (symbol === 'trx') {
        return originalPrice * 1.3; // 30% increase for TRX (Tron)
      }
      return originalPrice;
    }
    
    return 0; // Fallback for invalid coin object
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/.netlify/functions/coinGeckoProx?path=coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=true');
        setCoins(response.data);

        const trendingResponse = await axios.get('/.netlify/functions/coinGeckoProx?path=search/trending');
        const trendingCoinsData = trendingResponse.data.coins.map(coin => {
          const priceData = coin.item.data;
          return {
            ...coin.item,
            current_price: parseFloat(priceData?.price || 0),
            price_change_percentage_24h: parseFloat(priceData?.price_change_percentage_24h?.usd || 0),
            coin_id: coin.item.id 
          };
        });
        setTrendingCoins(trendingCoinsData);
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

  const handleLoadMore = () => {
    setVisibleCoinsCount(prevCount => prevCount + 20);
  };

  const filteredCoins = searchTerm.length > 0 
    ? coins.filter(coin => 
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : coins;

  // Helper for responsive price formatting
  const formatPrice = (price, isMobile = false) => {
    return price.toLocaleString('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: isMobile ? 0 : 2,
      maximumFractionDigits: isMobile ? 0 : 2
    });
  };

  const togglePrices = () => {
    setShowPrices(!showPrices);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-darkblue text-white p-8">
      <div className="relative max-w-7xl mx-auto">
        {/* Hero section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-3xl p-8 mb-8 backdrop-blur-lg border border-white/10 shadow-[0_0_15px_rgba(101,121,248,0.3)]">
          {/* Decorative elements */}
          <div className="absolute -bottom-12 -right-12 w-56 h-56 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -top-12 -left-12 w-56 h-56 bg-purple-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-4">Cryptocurrency Prices</h1>
            <p className="text-lg text-blue-100 max-w-2xl">
              Real-time prices, market caps, and trading volumes for thousands of cryptocurrencies.
            </p>
          </div>
        </div>

        {loading ? (
          <>
            {/* Skeleton UI */}
            <SkeletonSearch />
            
            <div className="mt-8 relative bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-3xl p-8 shadow-[0_0_15px_rgba(101,121,248,0.2)] backdrop-blur-lg border border-white/10">
              <div className="h-8 w-48 bg-white/10 rounded-xl mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <SkeletonTrendCard key={i} />
                ))}
              </div>
            </div>
            
            <div className="mt-8 relative bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-3xl p-8 shadow-[0_0_15px_rgba(101,121,248,0.2)] backdrop-blur-lg border border-white/10">
              <div className="h-8 w-40 bg-white/10 rounded-xl mb-6"></div>
              <div className="overflow-x-auto">
                <SkeletonTable />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Search Bar */}
            <div className="mb-8 relative" ref={searchRef}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search coins..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full p-4 pl-12 bg-white/5 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-white/10 focus:border-blue-500/50"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              {showDropdown && <SearchDropdown coins={searchResults} onSelect={handleCoinSelect} getPriceFunction={getDisplayPrice} />}
            </div>

            {/* Market Trends */}
            <div className="mt-8 relative bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-3xl p-8 shadow-[0_0_15px_rgba(101,121,248,0.2)] backdrop-blur-lg border border-white/10">
              <h2 className="text-2xl font-semibold mb-6 text-white">Market Trends</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trendingCoins.slice(0, 6).map((coin) => {
                  const coinFromMain = coins.find(c => c.symbol.toLowerCase() === coin.symbol.toLowerCase());
                  const displayPrice = coinFromMain ? getDisplayPrice(coinFromMain) : 0;
                  const priceChange = coinFromMain ? coinFromMain.price_change_percentage_24h : 0;
                  
                  return (
                    <div key={coin.id} className="bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-6 border border-white/10 shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:border-blue-500/20 group backdrop-blur-sm relative overflow-hidden">
                      <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-blue-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="relative z-10">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center">
                            <img src={coin.thumb} alt={coin.name} className="w-10 h-10 mr-3 rounded-full" />
                            <div>
                              <div className="text-white font-medium">{coin.name}</div>
                              <div className="text-xs text-white/60">{coin.symbol.toUpperCase()}</div>
                            </div>
                          </div>
                          <div className={`px-2 py-1 rounded-lg text-sm font-medium ${priceChange > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                            {priceChange > 0 ? '+' : ''}{priceChange.toFixed(2)}%
                          </div>
                        </div>
                        
                        <div className="font-bold text-xl sm:text-2xl text-white mb-4">
                          {formatPrice(displayPrice, window.innerWidth < 640)}
                        </div>
                        
                        <div className="h-24 mt-3">
                          <img 
                            src={`https://www.coingecko.com/coins/${coin.coin_id}/sparkline.svg`} 
                            alt={`${coin.name} price trend`}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* All Coins Table */}
            <div className="mt-8 relative bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-3xl p-8 shadow-[0_0_15px_rgba(101,121,248,0.2)] backdrop-blur-lg border border-white/10">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div className="flex items-center">
                  <h2 className="text-2xl font-semibold text-white mr-4">All Cryptocurrencies</h2>
                  <button 
                    onClick={togglePrices}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    {showPrices ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Search coins..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="mt-4 sm:mt-0 w-full sm:w-64 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              
              {/* Desktop view: Full table with all columns */}
              <div className="hidden sm:block overflow-x-auto pb-1">
                <div className="min-w-full">
                  <table className="w-full table-auto">
                    <thead className="text-left text-white border-b border-white/10 sticky top-0 bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-md z-10">
                      <tr>
                        <th className="pb-3 sm:pb-4 pr-3 sm:pr-4 pt-2 font-semibold text-sm">#</th>
                        <th className="pb-3 sm:pb-4 pr-3 sm:pr-4 pt-2 font-semibold text-sm">Coin</th>
                        <th className="pb-3 sm:pb-4 pr-3 sm:pr-4 pt-2 font-semibold text-sm text-right">Price</th>
                        <th className="pb-3 sm:pb-4 pr-3 sm:pr-4 pt-2 font-semibold text-sm text-right">24h Change</th>
                        <th className="pb-3 sm:pb-4 pr-3 sm:pr-4 pt-2 font-semibold text-sm text-right">Market Cap</th>
                        <th className="pb-3 sm:pb-4 pr-3 sm:pr-4 pt-2 font-semibold text-sm text-right">Volume (24h)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredCoins.slice(0, visibleCoinsCount).map((coin, index) => (
                        <tr key={coin.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-3 sm:py-4 pr-3 sm:pr-4 text-white/60 text-sm">{index + 1}</td>
                          <td className="py-3 sm:py-4 pr-3 sm:pr-4">
                            <div className="flex items-center">
                              <img src={coin.image} alt={coin.name} className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 rounded-full" />
                              <div className="min-w-0">
                                <p className="font-medium text-sm sm:text-base truncate">{coin.name}</p>
                                <p className="text-xs text-white/60">{coin.symbol.toUpperCase()}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 sm:py-4 pr-3 sm:pr-4 font-medium text-sm sm:text-base text-right">
                            {showPrices 
                              ? formatPrice(getDisplayPrice(coin), window.innerWidth < 640)
                              : '********'
                            }
                          </td>
                          <td className={`py-3 sm:py-4 pr-3 sm:pr-4 text-sm sm:text-base text-right ${coin.price_change_percentage_24h > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {coin.price_change_percentage_24h > 0 ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
                          </td>
                          <td className="py-3 sm:py-4 pr-3 sm:pr-4 font-medium text-sm sm:text-base text-right">
                            {showPrices 
                              ? `$${coin.market_cap.toLocaleString(undefined, {maximumFractionDigits: 0})}`
                              : '********'
                            }
                          </td>
                          <td className="py-3 sm:py-4 pr-3 sm:pr-4 font-medium text-sm sm:text-base text-right">
                            {showPrices 
                              ? `$${coin.total_volume.toLocaleString(undefined, {maximumFractionDigits: 0})}`
                              : '********'
                            }
                          </td>
                        </tr>
                      ))}
                      {filteredCoins.length === 0 && (
                        <tr>
                          <td colSpan="6" className="text-center py-8">
                            <p className="text-white/60">No coins found matching your search.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Mobile view: Card-based design */}
              <div className="sm:hidden">
                {filteredCoins.slice(0, visibleCoinsCount).map((coin, index) => (
                  <div key={coin.id} className="bg-white/5 hover:bg-white/10 rounded-xl p-3 mb-3 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <img src={coin.image} alt={coin.name} className="w-6 h-6 mr-2 rounded-full" />
                        <div>
                          <p className="font-medium text-sm">{coin.name}</p>
                          <p className="text-xs text-white/60">{coin.symbol.toUpperCase()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">
                          {showPrices 
                            ? formatPrice(getDisplayPrice(coin), true)
                            : '********'
                          }
                        </p>
                        <p className={`text-xs ${coin.price_change_percentage_24h > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {coin.price_change_percentage_24h > 0 ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-1 mt-2">
                      <p className="text-xs text-white/60">
                        {showPrices
                          ? `Market Cap: $${coin.market_cap.toLocaleString(undefined, {maximumFractionDigits: 0})}`
                          : 'Market Cap: ********'
                        }
                      </p>
                      <p className="text-xs text-white/60">
                        {showPrices
                          ? `Volume (24h): $${coin.total_volume.toLocaleString(undefined, {maximumFractionDigits: 0})}`
                          : 'Volume (24h): ********'
                        }
                      </p>
                    </div>
                  </div>
                ))}
                
                {filteredCoins.length === 0 && (
                  <div className="py-8 text-center bg-white/5 rounded-xl">
                    <p className="text-white/60">No coins found matching your search.</p>
                  </div>
                )}
              </div>
              
              {filteredCoins.length > visibleCoinsCount && (
                <div className="flex justify-center mt-8">
                  <button 
                    onClick={handleLoadMore}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 rounded-xl text-white transition-all duration-300 border border-white/10 hover:border-white/20 shadow-lg hover:shadow-blue-500/10"
                  >
                    Load More
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PricesPage;
