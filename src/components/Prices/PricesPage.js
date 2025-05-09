import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Moved getDisplayPrice and added formatPrice to be accessible by SearchDropdown
const getDisplayPrice = (coin) => {
  let price = parseFloat(coin.current_price);
  if (isNaN(price)) return 0; 
  if (coin.symbol.toLowerCase() === 'xrp') price *= 1.3;
  if (coin.symbol.toLowerCase() === 'trx') price *= 1.3;
  return price;
};

const formatPrice = (price, minDigits = 2, maxDigits = 3) => {
  if (price === null || price === undefined || isNaN(parseFloat(price))) return 'N/A';
  return parseFloat(price).toLocaleString('en-US', { 
    style: 'currency', 
    currency: 'USD', 
    minimumFractionDigits: minDigits, 
    maximumFractionDigits: maxDigits 
  });
};

// Skeleton components
const SkeletonTrendCard = () => (
  <div className="bg-gray-800 p-4 rounded-xl shadow-lg animate-pulse">
    <div className="flex items-center mb-3">
      <div className="w-8 h-8 mr-3 rounded-full bg-gray-700"></div>
      <div>
        <div className="h-4 w-20 bg-gray-700 rounded mb-1"></div>
        <div className="h-3 w-12 bg-gray-700 rounded"></div>
      </div>
    </div>
    <div className="h-6 w-24 bg-gray-700 rounded mb-2"></div>
    <div className="h-16 bg-gray-700 rounded"></div>
  </div>
);

const SkeletonTable = () => (
  <table className="min-w-full divide-y divide-gray-700">
    <thead><tr><th className="px-4 py-3.5 h-6 bg-gray-700 rounded w-1/4"></th><th className="px-4 py-3.5 h-6 bg-gray-700 rounded w-1/4"></th><th className="px-4 py-3.5 h-6 bg-gray-700 rounded w-1/4"></th><th className="px-4 py-3.5 h-6 bg-gray-700 rounded w-1/4"></th></tr></thead>
    <tbody>
      {[...Array(5)].map((_, i) => (
        <tr key={i}><td className="px-4 py-4"><div className="h-5 bg-gray-700 rounded w-3/4"></div></td><td className="px-4 py-4"><div className="h-5 bg-gray-700 rounded w-3/4"></div></td><td className="px-4 py-4"><div className="h-5 bg-gray-700 rounded w-3/4"></div></td><td className="px-4 py-4"><div className="h-5 bg-gray-700 rounded w-3/4"></div></td></tr>
      ))}
    </tbody>
  </table>
);

const SearchDropdownComponent = ({ query, coins: allCoinsData, onSelect, showSearchDropdownProp }) => {
  const [filteredCoins, setFilteredCoins] = useState([]);

  useEffect(() => {
    if (query.length > 1 && allCoinsData) {
      setFilteredCoins(
        allCoinsData.filter(coin =>
          coin.name.toLowerCase().includes(query.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 8)
      );
    } else {
      setFilteredCoins([]);
    }
  }, [query, allCoinsData]);

  if (!filteredCoins.length || !showSearchDropdownProp) return null;

  return (
    <div className="absolute left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-20 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
      {filteredCoins.map(coin => (
        <Link 
          to={`/coin/${coin.id}`}
          key={coin.id} 
          onClick={() => { 
            onSelect(coin); 
          }}
          className="flex items-center p-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0"
        >
          {coin.image ? (
            <img src={coin.image} alt={coin.name} className="w-7 h-7 mr-3 rounded-full flex-shrink-0" onError={(e) => { e.target.style.visibility = 'hidden'; e.target.parentElement.querySelector('.fallback-icon').style.display='flex';}}/>
          ) : null}
          <div className={`fallback-icon w-7 h-7 mr-3 rounded-full bg-gray-600 flex-shrink-0 items-center justify-center text-gray-400 ${coin.image ? 'hidden' : 'flex'}`}>{coin.symbol.charAt(0).toUpperCase()}</div>
          <span className="text-white mr-2 truncate" style={{maxWidth: '150px'}}>{coin.name}</span>
          <span className="text-xs text-gray-500 mr-2">({coin.symbol.toUpperCase()})</span>
          <span className="text-sm text-gray-400 ml-auto whitespace-nowrap">{formatPrice(getDisplayPrice(coin), 2, coin.current_price < 1 ? 6 : 3)}</span>
        </Link>
      ))}
    </div>
  );
};

const PricesPage = () => {
  const [coins, setCoins] = useState([]);
  const [trendingCoins, setTrendingCoins] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef(null);
  const [sortConfig, setSortConfig] = useState({ key: 'market_cap_rank', direction: 'ascending' });
  const [visibleCount, setVisibleCount] = useState(50);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const coinsResponse = await axios.get('/.netlify/functions/coinGeckoProx?path=coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=true');
        setCoins(coinsResponse.data.map(c => ({ ...c, image: c.image || '', id: c.id || c.symbol }))); 

        const trendingResponse = await axios.get('/.netlify/functions/coinGeckoProx?path=search/trending');
        const btcPrice = coinsResponse.data.find(c=>c.symbol==='btc')?.current_price || 50000;
        setTrendingCoins(trendingResponse.data.coins.map(tc => ({
          ...tc.item,
          id: tc.item.id,
          current_price: parseFloat(tc.item.data?.price || tc.item.price_btc * btcPrice || 0),
          price_change_percentage_24h: parseFloat(tc.item.data?.price_change_percentage_24h?.usd || 0),
          sparkline: tc.item.data?.sparkline,
          thumb: tc.item.thumb || '' 
        })));
      } catch (err) {
        console.error("Error fetching data:", err);
        setError('Failed to load cryptocurrency data. Please try again later.');
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchRef]);

  useEffect(() => {
    if (searchQuery.length > 1) setShowSearchDropdown(true);
    else setShowSearchDropdown(false);
  }, [searchQuery]);

  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScrollTop && window.pageYOffset > 400) setShowScrollTop(true);
      else if (showScrollTop && window.pageYOffset <= 400) setShowScrollTop(false);
    };
    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, [showScrollTop]);

  const sortedAndFilteredCoins = useMemo(() => {
    let result = [...coins];
    if (sortConfig.key) {
      result.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];
        if (sortConfig.key === 'name') {
            valA = valA.toLowerCase();
            valB = valB.toLowerCase();
        } else if (typeof valA !== 'string' || typeof valB !== 'string') { 
            valA = parseFloat(valA) || (sortConfig.direction === 'ascending' ? Infinity : -Infinity); 
            valB = parseFloat(valB) || (sortConfig.direction === 'ascending' ? Infinity : -Infinity);
        }
        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    // Apply search query filter after sorting or if no sort
    if (searchQuery.length > 1) {
        result = result.filter(coin =>
            coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    return result;
  }, [coins, searchQuery, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') direction = 'descending';
    else if (sortConfig.key === key && sortConfig.direction === 'descending') direction = 'ascending'; 
    setSortConfig({ key, direction });
  };

  const loadMoreCoins = () => setVisibleCount(prevCount => prevCount + 50);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const currentCoins = useMemo(() => sortedAndFilteredCoins.slice(0, visibleCount), [sortedAndFilteredCoins, visibleCount]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-2">Cryptocurrency Prices</h1>
        <p className="text-center text-gray-400 text-lg">Track real-time prices and market trends.</p>
        <div className="mt-6 max-w-xl mx-auto relative" ref={searchRef}>
            <input 
                type="text" 
                placeholder="Search for a coin (e.g., Bitcoin, BTC)..." 
                className="w-full p-3 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if (searchQuery.length > 1) setShowSearchDropdown(true); }}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <SearchDropdownComponent query={searchQuery} coins={coins} onSelect={(coin) => { setSearchQuery(''); setShowSearchDropdown(false); }} showSearchDropdownProp={showSearchDropdown} />
        </div>
      </header>

      {isLoading && !coins.length && !trendingCoins.length ? (
          <>
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6 text-gray-100 h-8 w-48 bg-gray-700 rounded animate-pulse" aria-hidden="true"></h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {[...Array(isMobileView ? 4 : 5)].map((_,i) => <SkeletonTrendCard key={i}/>)}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-gray-100 h-8 w-40 bg-gray-700 rounded animate-pulse" aria-hidden="true"></h2>
              <div className="overflow-x-auto bg-gray-800 rounded-xl shadow-2xl"><SkeletonTable /></div>
            </div>
          </>
      ) : !isLoading && trendingCoins.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-100">Market Trends</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {trendingCoins.slice(0, isMobileView ? 4 : 5).map((coin) => (
              <Link to={`/coin/${coin.id}`} key={coin.id} className="bg-gray-800 p-4 rounded-xl shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex items-center mb-3">
                  {coin.thumb ? (
                    <img src={coin.thumb} alt={coin.name} className="w-8 h-8 mr-3 rounded-full flex-shrink-0" onError={(e) => { e.target.style.visibility = 'hidden'; e.target.nextSibling.style.display='flex'; }}/>
                  ) : null}
                  <div className={`w-8 h-8 mr-3 rounded-full bg-gray-700 flex-shrink-0 items-center justify-center text-gray-400 ${coin.thumb ? 'hidden' : 'flex'}`}>{coin.symbol.charAt(0).toUpperCase()}</div>
                  <div>
                    <h3 className="text-md font-semibold text-white group-hover:text-indigo-400 truncate" style={{maxWidth: '120px'}}>{coin.name}</h3>
                    <p className="text-xs text-gray-400">{coin.symbol.toUpperCase()}</p>
                  </div>
                </div>
                <p className={`text-lg font-bold mb-1 ${getDisplayPrice(coin) >= (parseFloat(coin.current_price) || 0) ? 'text-green-400' : 'text-red-400'}`}>
                  {formatPrice(getDisplayPrice(coin))}
                </p>
                <div className="h-16 mt-2 flex items-center justify-center">
                  {coin.sparkline ? (
                    <img 
                      src={coin.sparkline} 
                      alt={`${coin.name} sparkline`} 
                      className="w-full h-auto max-h-16 object-contain filter group-hover:brightness-125 transition-all duration-300"
                      onError={(e) => { e.target.onerror = null; e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjUwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xMCwyNSBRNTAsMTAgOTAsMjUgUTEzMCw0MCAxNzAsMjUiIHN0cm9rZT0icmdiYSg5OSwgMTAyLCAyNDEsIDAuOCkiIGZpbGw9Im5vbmUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PC9zdmc+"; }}
                    />
                  ) : (
                    <p className="text-xs text-gray-500">No sparkline</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-2xl font-semibold mb-6 text-gray-100">All Coins</h2>
        {isLoading && !coins.length && trendingCoins.length > 0 ? ( /* Show table skeleton only if trending is loaded but main coins are not */
          <div><div className="overflow-x-auto bg-gray-800 rounded-xl shadow-2xl"><SkeletonTable /></div></div>
        ) : error ? (
          <div className="text-center py-10 px-4 bg-red-900/20 border border-red-700 rounded-lg">
            <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        ) : !isLoading && coins.length > 0 ? (
          <div className="overflow-x-auto bg-gray-800 rounded-xl shadow-2xl">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800 sticky top-0 z-10">
                <tr>
                  <th scope="col" className="px-4 py-3.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden sm:table-cell cursor-pointer hover:bg-gray-700 transition-colors" onClick={() => requestSort('market_cap_rank')}>Rank</th>
                  <th scope="col" className="px-4 py-3.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-700 transition-colors" onClick={() => requestSort('name')}>Coin</th>
                  <th scope="col" className="px-4 py-3.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-700 transition-colors" onClick={() => requestSort('current_price')}>Price</th>
                  <th scope="col" className="px-4 py-3.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell cursor-pointer hover:bg-gray-700 transition-colors" onClick={() => requestSort('price_change_percentage_24h')}>24h Change</th>
                  <th scope="col" className="px-4 py-3.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden lg:table-cell cursor-pointer hover:bg-gray-700 transition-colors" onClick={() => requestSort('total_volume')}>Volume (24h)</th>
                  <th scope="col" className="px-4 py-3.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden lg:table-cell cursor-pointer hover:bg-gray-700 transition-colors" onClick={() => requestSort('market_cap')}>Market Cap</th>
                  <th scope="col" className="px-4 py-3.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden sm:table-cell">Last 7 Days</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700/50">
                {currentCoins.map((coin) => (
                  <tr key={coin.id} className="hover:bg-gray-700/50 transition-colors duration-150">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400 hidden sm:table-cell">{coin.market_cap_rank || 'N/A'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Link to={`/coin/${coin.id}`} className="flex items-center group">
                        {coin.image ? (
                          <img src={coin.image} alt={coin.name} className="w-7 h-7 mr-3 rounded-full flex-shrink-0" onError={(e) => { e.target.style.visibility = 'hidden'; e.target.nextSibling.style.display='flex';}}/>
                        ): null}
                        <div className={`w-7 h-7 mr-3 rounded-full bg-gray-600 flex-shrink-0 items-center justify-center text-gray-400 ${coin.image ? 'hidden' : 'flex'}`}>{coin.symbol.charAt(0).toUpperCase()}</div>
                        <div>
                          <div className="text-sm font-medium text-white group-hover:text-indigo-400 transition-colors truncate" style={{maxWidth: isMobileView? '100px' : '180px'}}>{coin.name}</div>
                          <div className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">{coin.symbol.toUpperCase()}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-white font-semibold">{formatPrice(getDisplayPrice(coin))}</td>
                    <td className={`px-4 py-3 whitespace-nowrap text-sm hidden md:table-cell ${coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {coin.price_change_percentage_24h ? `${coin.price_change_percentage_24h.toFixed(2)}%` : 'N/A'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300 hidden lg:table-cell">{coin.total_volume ? `$${coin.total_volume.toLocaleString()}`: 'N/A'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300 hidden lg:table-cell">{coin.market_cap ? `$${coin.market_cap.toLocaleString()}` : 'N/A'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300 hidden sm:table-cell">
                      {coin.sparkline_in_7d && coin.sparkline_in_7d.price && coin.sparkline_in_7d.price.length > 0 ? (
                        <div className="w-28 h-10">
                           <img 
                            src={`https://quickchart.io/chart?c={type:'line',data:{labels:[],datasets:[{borderColor:'${coin.price_change_percentage_24h >= 0 ? 'rgb(52,211,153)':'rgb(248,113,113)'}',borderWidth:1.5,data:[${coin.sparkline_in_7d.price.join(',')}],fill:false,pointRadius:0,tension:0.4}]}}`} 
                            alt={`${coin.name} 7d chart`} 
                            className="w-full h-full object-contain"
                            onError={(e) => { e.target.style.display='none';}} 
                          />
                        </div>
                      ) : (
                        <span className="text-xs text-gray-600">No data</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {sortedAndFilteredCoins.length > visibleCount && !isLoading && (
              <div className="py-6 text-center">
                <button 
                  onClick={loadMoreCoins} 
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                >
                  Load More Coins
                </button>
              </div>
            )}
          </div>
        ) : null /* End of main content conditional rendering */}
        {!isLoading && !error && coins.length === 0 && !searchQuery && (
             <div className="text-center py-10 px-4">
                <svg className="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="text-gray-500 text-lg">No coins available at the moment.</p>
            </div>
        )}
        {!isLoading && !error && sortedAndFilteredCoins.length === 0 && searchQuery && (
             <div className="text-center py-10 px-4">
                <svg className="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="text-gray-500 text-lg">No coins found for "{searchQuery}".</p>
            </div>
        )}
      </section>

      {showScrollTop && (
        <button 
          onClick={scrollToTop} 
          className="fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out z-30"
          aria-label="Scroll to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>
        </button>
      )}
    </div>
  );
};

export default PricesPage;
