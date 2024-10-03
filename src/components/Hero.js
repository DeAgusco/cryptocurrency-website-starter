import React from 'react';
import Image from '../assets/img/hero-img.png';
import {IoIosArrowDroprightCircle} from 'react-icons/io';
const Hero = () => {
  return( 
  <section>
    <div className='container mx-auto'>
      <div className='flex flex-col items-center lg:flex-row'>
        <div className='flex-1'>
          <div className='bg-white/10 p-1 mb-6 rounded-full pl-1 pr-3 max-w-[365px]' data-aos='fade-down'>
            <div className='flex items-center justify-between text-sm lg:text-base'>
              <div className='bg-white text-darkblue rounded-full font-medium py-1 px-4'>SAVE 75%</div>
              <div>On Transaction Fees</div>
            </div>
          </div>
          <div>
            <h1 className='text-[32px] lg:text-[64px] font-bold leading-tight mb-6' data-aos='fade-down'>Fastest and secure platform to invest in crypto.</h1>
            <p className='max-w-[440px] leading-relaxed mb-8' data-aos='fade-down'>Buy and sell cryptocurrencies, trusted by 10M wallets with over
              $1B in transactions.
            </p>
            <button className='btn gap-x-6 pl-6 text-sm lg:h-16 lg:text-base' data-aos='fade-down'>Get started for free <IoIosArrowDroprightCircle className='text-2xl lg:text-3xl'/></button>
          </div>
          </div>
          <div className='flex-1' data-aos='fade-up'>
            <img src={Image} alt='hero'/>
          </div>
        
      </div>
    </div>
  </section>
  );
};

export default Hero;
