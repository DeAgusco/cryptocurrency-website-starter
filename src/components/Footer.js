import React from 'react';
import Logo from '../assets/img/logo.svg';
import VisaImg from '../assets/img/visa.png';
import MastercardImg from '../assets/img/mastercard.png';
import BitcoinImg from '../assets/img/bitcoin.png';

import { IoLogoYoutube, IoLogoInstagram, IoLogoLinkedin } from 'react-icons/io';

const Footer = () => {
  return <footer>
    <div className='container mx-auto py-10'>
      <div className='flex flex-col lg:flex-row lg:justify-between lg:items-center gap-y-5 lg:gap-y-0'>
        <div className='flex flex-col gap-y-5'>
          <div className='flex items-center gap-x-3'>
            <img src={Logo} alt='logo' className='h-10'/>
            <p className='text-gray'>© 2021 Trade</p>
          </div>
          <div className='flex gap-x-5'>
            <button className='text-gray hover:underline'>Terms of Service</button>
            <button className='text-gray hover:underline'>Privacy Policy</button>
          </div>
        </div>
        <div className='flex gap-x-5'>
          <button className='text-gray hover:underline'><IoLogoYoutube className='h-6 w-6'/></button>
          <button className='text-gray hover:underline'><IoLogoInstagram className='h-6 w-6'/></button>
          <button className='text-gray hover:underline'><IoLogoLinkedin className='h-6 w-6'/></button>
        </div>
      </div>
      <div className='flex flex-col lg:flex-row lg:justify-between lg:items-center gap-y-5 lg:gap-y-0 mt-5'>
        <div className='flex gap-x-5'>
          <img src={VisaImg} alt='visa' className='h-5'/>
          <img src={MastercardImg} alt='mastercard' className='h-5'/>
          <img src={BitcoinImg} alt='bitcoin' className='h-5'/>
        </div>
      </div>
    </div>
  </footer>
};

export default Footer;
