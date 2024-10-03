import React from 'react';

import FeaturesSection1 from './FeaturesSection1';
import FeaturesSection2 from './FeaturesSection2';
import FeaturesSection3 from './FeaturesSection3';

const Features = () => {
  return <section className='pt-12 lg:pt-24'>
    <div className='container mx-auto'>
      <div className='flex justify-center text-center mv-24 mx-auto'>
      <h2 className='section-title text-center' data-aos='fade-up'>
        Market sentiments, portfolio, and run the infrastructure of your choice.
      </h2>
      </div>
    </div>
    <FeaturesSection1 />
    <FeaturesSection2 />
    <FeaturesSection3 />
    </section>;
};

export default Features;
