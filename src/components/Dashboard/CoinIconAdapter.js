import React from 'react';
import { CoinIcon } from '../Auth/CoinIcons';

/**
 * A simpler adapter for getting coin icons
 * This replaces the switch statement approach that was causing problems
 * @param {string} coin - The coin symbol (e.g. 'BTC', 'ETH', etc.)
 * @param {number} size - The size of the icon (default: 24)
 * @returns {React.ReactElement} The coin icon component
 */
export const getCoinIcon = (coin, size = 24) => {
  console.log('getCoinIcon adapter called for:', coin);
  if (!coin) return null;
  
  return <CoinIcon symbol={coin} size={size} />;
};

export default getCoinIcon;