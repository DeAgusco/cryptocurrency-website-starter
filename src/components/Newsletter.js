import React from 'react';
import NewsletterForm from './NewsletterForm';
const Newsletter = () => {
  return <section className='py-20 mt-5' data-aos='fade-up'>
    <div className='container mx-auto'>
      <div className='flex flex-col w-full rounded-2xl justify-center text-center items-center mx-auto bg-blue lg:bg-newsletterBox lg:bg-no-repeat lg:h-[216px]'>
        <h3 className='h3 mb-6 mt-3'>Subscribe to our newsletter</h3>
        <p className='text-gray mb-8'>Get the latest news and updates from us.</p>
      </div>
      <div className='relative bottom-6 w-[80%] left-10 lg:bottom-12 rounded-4xl lg:max-w-[800px] lg:left-[200px] flex bg-white bottom-20 z-2 h-20 rounded-3xl'>
        <NewsletterForm />
      </div>
    </div>
    </section>;
};

export default Newsletter;
