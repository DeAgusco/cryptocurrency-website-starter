import React from 'react';
import Image3 from '../assets/img/feature-3-img.png';

const FeaturesSection3 = () => {
  return <section>
    <div className='container mx-auto'>
      <div className='flex flex-col lg:flex-row mx-auto gap-x-12'>
      <div className='max-w-[454px] mb-6 lg:mt-10'  data-aos='fade-left'>
          <h3 className='h3 mb-6'>Grow your profit and track your investment</h3>
          <p className='text-gray mb-8 font-medium'>
            Use advanced tools to track your investment and grow your profit.
            Clear trading charts and detailed statistics help you make informed decisions.
          </p>
          <button className='btn px-8'>Learn more</button>
        </div>
        <div className='flex-1 flex justify-end' data-aos='fade-right'>
          <img src={Image3} alt='feature-3-img' />
        </div>
      </div>
    </div>
  </section>  
  ;
};

export default FeaturesSection3;
