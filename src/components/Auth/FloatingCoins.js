import React, { useEffect, useState } from 'react';
import { BitcoinIcon, EthereumIcon, LitecoinIcon, DogecoinIcon } from './CoinIcons';

const FloatingCoins = () => {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    const coinIcons = [BitcoinIcon, EthereumIcon, LitecoinIcon, DogecoinIcon];
    const newCoins = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      Icon: coinIcons[Math.floor(Math.random() * coinIcons.length)],
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      speed: 0.5 + Math.random() * 2,
      direction: Math.random() * 2 * Math.PI,
    }));
    setCoins(newCoins);

    const animateCoins = () => {
      setCoins(prevCoins => prevCoins.map(coin => {
        let newX = coin.x + Math.cos(coin.direction) * coin.speed;
        let newY = coin.y + Math.sin(coin.direction) * coin.speed;

        if (newX < 0 || newX > window.innerWidth) {
          coin.direction = Math.PI - coin.direction;
        }
        if (newY < 0 || newY > window.innerHeight) {
          coin.direction = -coin.direction;
        }

        return {
          ...coin,
          x: newX,
          y: newY,
        };
      }));
    };

    const intervalId = setInterval(animateCoins, 50);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {coins.map((coin) => (
        <div
          key={coin.id}
          className="absolute transition-all duration-300 ease-linear"
          style={{
            left: `${coin.x}px`,
            top: `${coin.y}px`,
            transform: `translate(-50%, -50%)`,
          }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-white opacity-10 blur-md rounded-full transform scale-150" />
            <coin.Icon />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FloatingCoins;
