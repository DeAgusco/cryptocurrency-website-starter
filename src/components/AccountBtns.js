import React from 'react';

const AccountBtns = () => {
  return <div className='flex items-center font-medium'>
    <button className='border border-blue text-blue px-5 py-2 rounded-lg hover:bg-blue hover:text-white transition-all duration-300'>Login</button>
    <span className='mx-3'>|</span>
    <button className='bg-blue text-white px-5 py-2 rounded-lg hover:scale-105 transition-all duration-300'>Sign Up</button>
  </div>;
};

export default AccountBtns;
