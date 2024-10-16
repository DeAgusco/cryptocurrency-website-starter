import React from 'react';
import Logo from '../assets/img/logo.svg';

const Footer = () => {
  return <footer>
    <div className='container mx-auto py-10'>
      <div className='flex flex-col lg:flex-row lg:justify-between lg:items-center gap-y-5 lg:gap-y-0'>
        <div className='flex flex-col lg:flex-row gap-y-5 items-center justify-center'>
          <div className='flex items-center gap-x-2'>
            <img src={Logo} alt='logo' className='h-10'/>
            <p className='text-gray'>© 2021</p>
          </div>
          <div className='flex lg:gap-x-5 gap-x-5'>
            <button className='text-gray hover:underline'>Terms of Service</button>
            <button className='text-gray hover:underline'>Privacy Policy</button>
          </div>
        </div>
      </div>
    </div>
  </footer>
};

export default Footer;
