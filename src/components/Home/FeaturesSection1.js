import React from 'react';
import Image1 from '../../assets/img/feature-1-img.png';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/auth.service';

const FeaturesSection1 = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    if (AuthService.isLoggedIn()) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };
  return <section className='mb-5'>
    <div className='container mx-auto'>
      <div className='flex flex-col lg:flex-row mx-auto gap-x-12'>
        <div className='max-w-[454px] mb-6 lg:mt-10'  data-aos='fade-right'>
          <h3 className='h3 mb-6'>Invest smart</h3>
          <p className='text-gray mb-8'>Invest in stocks, options, and ETFs with no hidden fees.</p>
          <button onClick={handleGetStarted} className='btn px-8'>Learn more</button>
        </div>
        <div className='flex-1 flex justify-end' data-aos='fade-left'>
          <img src={Image1} alt='feature-1-img' />
        </div>
      </div>
    </div>
  </section>;
};

export default FeaturesSection1;
