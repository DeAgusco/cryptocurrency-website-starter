import React from 'react';
import {HiChartBar, HiUser, HiGlobe} from 'react-icons/hi';

const Stats = () => {
  return (
  <section>
    <div className='container mx-auto py-20 px-4'>
      <div className='flex flex-col items-center'>
        <h1 className='text-[32px] lg:text-[64px] font-bold leading-tight mb-6' data-aos='fade-down'>Our platform is designed to help you invest in crypto.</h1>
        <p className='max-w-[440px] text-center leading-relaxed mb-8' data-aos='fade-down'>Buy and sell cryptocurrencies, trusted by 10M wallets with over $1B in transactions.</p>
        <div className='grid grid-cols-1 gap-y-12 lg:grid-cols-3'>
          <div className='flex flex-col items-center cursor-pointer transform transition-transform duration-300 hover:scale-3' data-aos='fade-up'>
            <HiChartBar className='text-3xl text-white mb-4'/>
            <h2 className='text-xl font-bold mb-4'>High Returns</h2>
            <p className='text-center'>Earn up to 10% interest on your crypto assets.</p>
          </div>
          <div className='flex flex-col items-center cursor-pointer transform transition-all duration-300 hover:scale-105' data-aos='fade-up'>
            <HiUser className='text-3xl text-white mb-4'/>
            <h2 className='text-xl font-bold mb-4'>User Friendly</h2>
            <p className='text-center'>Our platform is easy to use and secure.</p>
          </div>
          <div className='flex flex-col items-center cursor-pointer transform transition-transform duration-300 hover:scale-105' data-aos='fade-up'>
            <HiGlobe className='text-3xl text-white mb-4'/>
            <h2 className='text-xl font-bold mb-4'>Global Reach</h2>
            <p className='text-center'>Our platform is accessible from anywhere in the world.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  );
};

export default Stats;
