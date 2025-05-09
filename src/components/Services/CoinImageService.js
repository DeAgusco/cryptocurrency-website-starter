import axios from 'axios';

// Mapping of coin symbols to their CoinGecko IDs
const COIN_ID_MAP = {
  'btc': 'bitcoin',
  'eth': 'ethereum',
  'ltc': 'litecoin',
  'doge': 'dogecoin',
  'usdt': 'tether',
  'xrp': 'ripple',
  'shib': 'shiba-inu',
  'ada': 'cardano',
  'bnb': 'binancecoin',
  'dot': 'polkadot',
  'usdc': 'usd-coin',
  'xlm': 'stellar',
  'trx': 'tron'
};

// Cache configuration
const CACHE_KEY = 'coinGeckoImageCache';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const CoinImageService = {
  imageCache: {},
  
  // Initialize cache from localStorage
  initCache() {
    try {
      const cacheData = localStorage.getItem(CACHE_KEY);
      if (cacheData) {
        const parsedCache = JSON.parse(cacheData);
        if (parsedCache.timestamp && Date.now() - parsedCache.timestamp < CACHE_EXPIRY) {
          this.imageCache = parsedCache.data || {};
          return true;
        }
      }
    } catch (error) {
      console.error('Error loading coin image cache:', error);
    }
    return false;
  },

  // Save cache to localStorage
  saveCache() {
    try {
      const cacheData = {
        timestamp: Date.now(),
        data: this.imageCache
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error saving coin image cache:', error);
    }
  },

  // Get coin ID from symbol
  getCoinId(symbol) {
    const lowerSymbol = symbol.toLowerCase();
    return COIN_ID_MAP[lowerSymbol] || lowerSymbol;
  },

  // Get image URLs for multiple symbols at once
  async getAllImages() {
    // Try to load from cache first
    if (Object.keys(this.imageCache).length === 0) {
      const hasCache = this.initCache();
      if (hasCache && Object.keys(this.imageCache).length > 0) {
        return this.imageCache;
      }
    }
    
    // If cache is empty or expired, fetch all supported coins
    try {
      const coinIds = Object.values(COIN_ID_MAP).join(',');
      const response = await axios.get(`/.netlify/functions/coinGeckoProx?path=coins/markets?vs_currency=usd&ids=${coinIds}&sparkline=false`);
      
      if (response.data && response.data.length > 0) {
        response.data.forEach(coin => {
          this.imageCache[coin.symbol.toLowerCase()] = coin.image;
        });
        
        this.saveCache();
      }
      
      return this.imageCache;
    } catch (error) {
      console.error('Error fetching coin images:', error);
      return this.imageCache; // Return whatever we have in cache
    }
  }
};

export default CoinImageService; 