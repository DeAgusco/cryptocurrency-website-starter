import axios from 'axios';

// Cache duration in milliseconds
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

/**
 * Check if there's valid cached data for a given key
 */
const getValidCache = (key) => {
  try {
    const cachedItem = localStorage.getItem(`coinGecko-${key}`);
    if (!cachedItem) return null;
    
    const { data, timestamp } = JSON.parse(cachedItem);
    const isValid = Date.now() - timestamp < CACHE_DURATION;
    
    if (isValid) {
      console.log(`Using cached data for ${key}, age: ${Math.round((Date.now() - timestamp) / 1000)}s`);
      return data;
    } else {
      console.log(`Cache expired for ${key}`);
      return null;
    }
  } catch (error) {
    console.error(`Error reading cache for ${key}:`, error);
    return null;
  }
};

/**
 * Save data to cache
 */
const setCache = (key, data) => {
  try {
    const cacheItem = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(`coinGecko-${key}`, JSON.stringify(cacheItem));
    console.log(`Cached data for ${key}`);
  } catch (error) {
    console.error(`Error caching data for ${key}:`, error);
  }
};

/**
 * Normalize CoinGecko proxy URL to extract the meaningful path part as cache key
 */
const getCacheKeyFromUrl = (url) => {
  try {
    // Extract the path parameter from URLs like: /.netlify/functions/coinGeckoProx?path=coins/markets...
    const pathParam = new URL(url, window.location.origin).searchParams.get('path');
    return pathParam || url;
  } catch (error) {
    return url;
  }
};

/**
 * Main fetcher function for CoinGecko data
 * - Handles rate limits (429 errors)
 * - Implements manual caching layer
 * - Works with SWR
 */
const coinGeckoFetcher = async (url) => {
  // Get cache key from the URL
  const cacheKey = getCacheKeyFromUrl(url);
  
  // First, try to get from cache
  const cachedData = getValidCache(cacheKey);
  
  try {
    // Attempt API call even if we have cache (for background refresh)
    console.log(`Fetching CoinGecko data: ${url}`);
    const response = await axios.get(url);
    const freshData = response.data;
    
    // Save the fresh data to cache
    setCache(cacheKey, freshData);
    
    return freshData;
  } catch (error) {
    console.error(`Error fetching CoinGecko data: ${url}`, error);
    
    // Handle rate limiting (429)
    if (error.response && error.response.status === 429) {
      console.warn('CoinGecko rate limit reached');
      
      // If we have cached data, return it instead
      if (cachedData) {
        console.log('Using cached data due to rate limit');
        return cachedData;
      }
    }
    
    // For other errors, return cached data as fallback if available
    if (cachedData) {
      console.log('Using cached data as fallback after error');
      return cachedData;
    }
    
    // Re-throw if we can't recover
    throw error;
  }
};

export default coinGeckoFetcher; 