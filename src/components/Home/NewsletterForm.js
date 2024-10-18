import React from 'react';

const NewsletterForm = () => {
  return <form className='flex flex-col justify-center items-center py-3 px-4 w-full gap-y-3 lg:flex-row lg:gap-x-10'>
    <input type='email' placeholder='Enter your email' className='input py-3 text-base lg:text-darkblue text-gray-200 placeholder:text-darkblue placeholder:text-base'/>
    <button className='btn bg-blue text-white px-8 hover:bg-white/70 mb-2'>Subscribe</button>
  </form>;
};

export default NewsletterForm;
