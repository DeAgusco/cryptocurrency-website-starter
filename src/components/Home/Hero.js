import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowDroprightCircle } from 'react-icons/io';
import { FaBitcoin, FaEthereum } from 'react-icons/fa';
import { SiLitecoin, SiRipple } from 'react-icons/si';
import AuthService from '../Services/AuthService';

// Generate random particle properties once to avoid new values on each render
const generateParticles = (count) => {
  return Array.from({ length: count }, (_, index) => ({
    id: `particle-${index}`,
    width: Math.random() * 4 + 2,
    height: Math.random() * 4 + 2,
    left: Math.random() * 100,
    top: Math.random() * 100,
    color: `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, ${Math.random() * 255}, ${Math.random() * 0.3 + 0.1})`,
    shadow: Math.random() * 10 + 5,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 10
  }));
};

// Generate static coin data
const coinData = [
  { name: 'Bitcoin', Icon: FaBitcoin, price: 38421.65, change: 2.34, trend: 'up' },
  { name: 'Ethereum', Icon: FaEthereum, price: 2941.78, change: -1.21, trend: 'down' },
  { name: 'Litecoin', Icon: SiLitecoin, price: 142.33, change: 3.45, trend: 'up' },
  { name: 'Ripple', Icon: SiRipple, price: 0.87, change: -0.56, trend: 'down' }
];

const Hero = () => {
  const navigate = useNavigate();
  const [animatedValue, setAnimatedValue] = useState(0);
  
  // Create particles only once
  const particles = useMemo(() => generateParticles(10), []);
  
  // Generate chart data points based on animated value
  const chartData = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: `chart-bar-${i}`,
      height: 30 + Math.sin(i * 0.5 + animatedValue * 0.05) * 25
    }));
  }, [animatedValue]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedValue((prev) => {
        if (prev >= 100) return 0;
        return prev + 1;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    if (AuthService.isAuthenticated()) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  return (
    <section className="relative pt-28 pb-10 px-3 min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-b from-[#0f172a] to-[#131b2e]">
      {/* Reduced particle background */}
      <div className="absolute inset-0 z-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              width: particle.width + 'px',
              height: particle.height + 'px',
              left: particle.left + '%',
              top: particle.top + '%',
              backgroundColor: particle.color,
              boxShadow: `0 0 ${particle.shadow}px ${particle.color.replace(/[^,]+(?=\))/, '0.5')}`,
              animation: `float ${particle.duration}s linear infinite`,
              animationDelay: `-${particle.delay}s`,
            }}
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Reduced floating crypto icons - just 3 instead of 5 */}
      <div className="absolute z-0 opacity-5 top-20 left-10 text-6xl text-blue-300 animate-float-slow" aria-hidden="true">
        <FaBitcoin />
      </div>
      <div className="absolute z-0 opacity-5 bottom-20 right-10 text-5xl text-purple-300 animate-float-medium" aria-hidden="true">
        <FaEthereum />
      </div>
      <div className="absolute z-0 opacity-5 top-1/3 right-1/4 text-4xl text-cyan-300 animate-float-fast" aria-hidden="true">
        <SiLitecoin />
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
          {/* Left Column - Text Content */}
          <div className="w-full lg:w-1/2 space-y-8">
            {/* Animated Promo Badge */}
            <div 
              className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-xl p-1 rounded-full pl-1 pr-3 max-w-[365px] border border-blue-500/30"
              data-aos="fade-right"
            >
              <div className="flex items-center justify-between text-sm lg:text-base">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-medium py-1 px-4">
                  SAVE 75%
                </div>
                <div className="text-blue-300">On Transaction Fees</div>
              </div>
            </div>

            {/* Main Headline with Gradient Text */}
            <h1 
              className="text-4xl lg:text-6xl xl:text-7xl font-bold leading-tight"
              data-aos="fade-right" 
              data-aos-delay="100"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-purple-400">
                Trade Crypto
              </span>
              <br />
              <span className="text-white">
                Like Never Before
              </span>
            </h1>

            {/* Description with Glassmorphism Card */}
            <div 
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 max-w-lg shadow-xl"
              data-aos="fade-up" 
              data-aos-delay="200"
            >
              <p className="text-blue-50 leading-relaxed">
                Buy and sell cryptocurrencies with ease on our secure platform, trusted by over 10M wallets 
                with more than <span className="text-blue-400 font-medium">${(1 + animatedValue / 100).toFixed(2)}B</span> in transactions daily.
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4" data-aos="fade-up" data-aos-delay="300">
              <button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center group shadow-lg shadow-blue-600/20"
                type="button"
              >
                <span>Get started for free</span>
                <IoIosArrowDroprightCircle className="text-2xl ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={() => navigate('/prices')}
                className="bg-white/5 hover:bg-white/10 backdrop-blur-sm text-white border border-white/10 font-medium py-4 px-8 rounded-xl transition-all duration-300"
                type="button"
              >
                View Live Prices
              </button>
            </div>

            {/* Live Stats Indicator */}
            <div 
              className="flex items-center space-x-4 text-sm text-blue-300"
              data-aos="fade-up" 
              data-aos-delay="400"
            >
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                <span>Live Trading</span>
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-purple-500 mr-2"></div>
                <span>Secure Storage</span>
              </div>
            </div>
          </div>

          {/* Right Column - 3D Crypto Visualization */}
          <div className="w-full lg:w-1/2" data-aos="zoom-in" data-aos-delay="300">
            <div className="relative">
              {/* Reduced glowing effect */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-blue-500/20 rounded-full blur-[100px]" aria-hidden="true"></div>
              
              {/* Dashboard card */}
              <div className="relative bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-xl">
                <div className="grid grid-cols-2 gap-4">
                  {/* Price Cards */}
                  {coinData.map((coin, index) => (
                    <div 
                      key={coin.name}
                      className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col"
                      style={{ animationDelay: `${index * 0.2}s` }}
                      data-aos="fade-up"
                    >
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center mr-2">
                          <coin.Icon />
                        </div>
                        <span className="text-sm text-white">{coin.name}</span>
                      </div>
                      <div className="text-xl font-bold text-white">
                        ${coin.price.toFixed(2)}
                      </div>
                      <div className={`text-xs ${coin.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                        {coin.trend === 'up' ? '+' : '-'}{Math.abs(coin.change).toFixed(2)}%
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chart Visualization - simplified */}
                <div className="mt-6 h-40 bg-white/5 rounded-xl border border-white/10 p-4 relative overflow-hidden">
                  <div className="h-full w-full flex items-end">
                    {chartData.map((bar) => (
                      <div 
                        key={bar.id} 
                        className="flex-1 mx-px bg-gradient-to-t from-blue-500 to-purple-500"
                        style={{ height: `${bar.height}%` }}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <div className="absolute bottom-4 right-4 text-xs text-blue-300 bg-black/30 rounded-full px-2 py-1">
                    BTC/USD
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex justify-between">
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-lg text-sm"
                    type="button"
                  >
                    Trade Now
                  </button>
                  <button 
                    onClick={() => navigate('/wallet')}
                    className="bg-white/5 text-white border border-white/10 py-2 px-4 rounded-lg text-sm"
                    type="button"
                  >
                    View Portfolio
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
