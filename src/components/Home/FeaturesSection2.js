import React from 'react';
import Image2 from '../../assets/img/feature-2-img.png';

const FeaturesSection2 = () => {
  return (
    <section>
      <div className='container mx-auto mb-5'>
        <div className='flex flex-col lg:flex-row mx-auto gap-x-12'>
          <div className='order-2 lg:order-1 flex-1 flex justify-end' data-aos='fade-right'>
            <img src={Image2} alt='feature-2-img' />
          </div>
          <div className='order-1 lg:order-2 max-w-[454px] mb-6 lg:mt-10' data-aos='fade-left'>
            <h3 className='h3 mb-6'>Detailed Statistics</h3>
            <p className='text-gray mb-8 font-medium'>
              View all mining related information in realtime, anywhere any day, and make informed decisions on what to mine.
            </p>
            <button className='btn px-8'>Learn more</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection2;