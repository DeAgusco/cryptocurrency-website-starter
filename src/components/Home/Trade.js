import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { currency } from '../../data';
import { IoIosArrowForward } from 'react-icons/io';
import AuthService from '../Services/AuthService';

const Trade = () => {
  const [itemName, setItemName] = useState('Bitcoin');
  const navigate = useNavigate();

  const handleStartTrading = () => {
    if (AuthService.isAuthenticated()) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  return <section className='section text-darkblue'>
    <div className='container mx-auto px-4'>
     <h2 className='section-title text-center text-white' data-aos='fade-up' data-aos-offset='200'>Trade securely and market the high growth cryptocurrencies</h2>
    
      <div className='flex flex-col gap-[45px] lg:flex-row' data-aos='fade-up' data-aos-offset='200'>
        {currency.map((item, index) => {
          const {image, name, abbr, description} = item;
          return <div onClick={() => setItemName(name)} className={`${name === itemName ? 'bg-violet text-white' : 'bg-gray-200'} w-full rounded-2xl py-12 px-6 shadow-primary cursor-pointer transition-duration-300`} key={index}>
          <div className='flex flex-col justify-center items-center'>
            <img src={image} alt="" className='mb-12' />
          </div>
          <div className='mb-4 flex justify-center items-center gap-x-2'> 
            <div className='text-[32px] font-bold'>{name}</div>
            <div className='text-lg text-gray-400 font-medium'>{abbr}</div>
          </div>
          <p className='mb-6 text-center'>{description}</p>
          <div className='flex items-center justify-center'>
          <button 
            onClick={handleStartTrading}
            className={`${name === itemName ? 'bg-blue hover:bg-blue-200 text-white border-none pl-8 pr-6 gap-x-3' : 'text-blue w-16'} border-2 border-gray-300 rounded-full h-16 flex justify-center items-center`}>
            {name === itemName && <div className='text-lg font-medium'>Start Trading</div>}
            <IoIosArrowForward className={`${name === itemName ? 'text-2xl' : 'text-3xl'}`}/>
          </button>
          </div>
          </div>;
        })}
      </div>
    </div>
  </section>;
};

export default Trade;
