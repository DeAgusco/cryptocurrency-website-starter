import React from 'react';
import Image from '../../assets/img/why-img.png';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/auth.service';

const Why = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    if (AuthService.isLoggedIn()) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };
  return <section>
    <div className='container mx-auto flex flex-col items-center lg:flex-row px-4'>
      <div className='flex-1' data-aos='fade-left' >
        <img src={Image} alt='why'/>
      </div>
      <div className='flex-1'>
        <h2 className='text-[32px] lg:text-[64px] font-bold leading-tight mb-6' data-aos='fade-down' >Why choose us?</h2>
        <p className='max-w-[440px] leading-relaxed mb-8' data-aos='fade-down' >We are the world's largest cryptocurrency exchange with over 25 million users across 32 countries worldwide. Coinbase allows you to securely buy, store and sell cryptocurrencies like Bitcoin, Bitcoin Cash, Ethereum, Ethereum Classic, Litecoin, and many more on our easy, user-friendly app and web platform.</p>
        <button onClick={handleGetStarted} className='btn gap-x-6 pl-6 text-sm lg:h-16 lg:text-base' data-aos='fade-down' >Get started for free</button>
      </div>
    </div>
  </section>;
};

export default Why;
