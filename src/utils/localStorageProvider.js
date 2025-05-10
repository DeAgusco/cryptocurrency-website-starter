// src/utils/localStorageProvider.js

// Maximum cache age in milliseconds (24 hours)
const MAX_CACHE_AGE = 24 * 60 * 60 * 1000;

// Storage chunk size limit to avoid localStorage size limits
const CHUNK_SIZE = 100 * 1024; // 100KB per chunk

// Store a value in localStorage with chunking support for large values
const setChunkedItem = (key, value) => {
  try {
    const valueStr = JSON.stringify(value);
    
    // If the value is small enough, store it directly
    if (valueStr.length < CHUNK_SIZE) {
      localStorage.setItem(key, valueStr);
      return;
    }
    
    // For larger values, split into chunks
    const chunks = Math.ceil(valueStr.length / CHUNK_SIZE);
    localStorage.setItem(`${key}_chunks`, chunks.toString());
    
    for (let i = 0; i < chunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, valueStr.length);
      localStorage.setItem(`${key}_${i}`, valueStr.substring(start, end));
    }
  } catch (error) {
    console.error('Error storing data in localStorage:', error);
  }
};

// Retrieve a potentially chunked value from localStorage
const getChunkedItem = (key) => {
  try {
    // Check if this is a chunked item
    const chunksStr = localStorage.getItem(`${key}_chunks`);
    
    if (!chunksStr) {
      // Not chunked, get directly
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
    
    // Retrieve and combine chunks
    const chunks = parseInt(chunksStr, 10);
    let valueStr = '';
    
    for (let i = 0; i < chunks; i++) {
      const chunk = localStorage.getItem(`${key}_${i}`);
      if (!chunk) throw new Error(`Missing chunk ${i} for key ${key}`);
      valueStr += chunk;
    }
    
    return JSON.parse(valueStr);
  } catch (error) {
    console.error(`Error retrieving data for key ${key}:`, error);
    return null;
  }
};

// Remove a potentially chunked item from localStorage
const removeChunkedItem = (key) => {
  try {
    const chunksStr = localStorage.getItem(`${key}_chunks`);
    
    if (chunksStr) {
      const chunks = parseInt(chunksStr, 10);
      for (let i = 0; i < chunks; i++) {
        localStorage.removeItem(`${key}_${i}`);
      }
      localStorage.removeItem(`${key}_chunks`);
    } else {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.error(`Error removing data for key ${key}:`, error);
  }
};

// Main storage provider for SWR
export const localStorageProvider = () => {
  const map = new Map();
  
  // Load initial cache from localStorage
  try {
    // Get the cache index
    const cacheIndexStr = localStorage.getItem('swr-cache-index');
    if (cacheIndexStr) {
      const cacheIndex = JSON.parse(cacheIndexStr);
      
      // Load each cache entry
      Object.keys(cacheIndex).forEach(key => {
        /* eslint-disable no-unused-vars */
        const { timestamp, type } = cacheIndex[key];
        /* eslint-enable no-unused-vars */
        
        // Skip expired entries
        if (Date.now() - timestamp > MAX_CACHE_AGE) {
          removeChunkedItem(`swr-cache-${key}`);
          return;
        }
        
        // Load the data
        const cachedData = getChunkedItem(`swr-cache-${key}`);
        if (cachedData) {
          map.set(key, cachedData);
        }
      });
      
      console.log(`Loaded ${map.size} items from SWR cache`);
    }
  } catch (error) {
    console.error('Failed to load SWR cache:', error);
  }
  
  // Save the cache before the page unloads
  window.addEventListener('beforeunload', () => {
    try {
      const cacheIndex = {};
      
      // Build cache index and save entries
      for (const [key, value] of map.entries()) {
        // Skip nullish values
        if (value === undefined || value === null) continue;
        
        // Record in the index
        cacheIndex[key] = {
          timestamp: Date.now(),
          type: typeof value
        };
        
        // Store the value
        setChunkedItem(`swr-cache-${key}`, value);
      }
      
      // Save the index
      localStorage.setItem('swr-cache-index', JSON.stringify(cacheIndex));
      console.log(`Saved ${Object.keys(cacheIndex).length} items to SWR cache`);
    } catch (error) {
      console.error('Failed to save SWR cache:', error);
    }
  });
  
  // Return the map interface that SWR will use
  return map;
};

// Helper to clear expired cache entries
export const clearExpiredCache = () => {
  try {
    const cacheIndexStr = localStorage.getItem('swr-cache-index');
    if (!cacheIndexStr) return;
    
    const cacheIndex = JSON.parse(cacheIndexStr);
    let removed = 0;
    
    Object.keys(cacheIndex).forEach(key => {
      const { timestamp } = cacheIndex[key];
      if (Date.now() - timestamp > MAX_CACHE_AGE) {
        removeChunkedItem(`swr-cache-${key}`);
        delete cacheIndex[key];
        removed++;
      }
    });
    
    if (removed > 0) {
      localStorage.setItem('swr-cache-index', JSON.stringify(cacheIndex));
      console.log(`Cleared ${removed} expired cache entries`);
    }
  } catch (error) {
    console.error('Error clearing expired cache:', error);
  }
};

// Run cache cleanup on init
clearExpiredCache(); 