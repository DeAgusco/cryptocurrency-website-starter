import React from 'react';
import logo from '../../assets/img/logo.svg';
import Nav from './Nav';
import AccountBtns from './AccountBtns';

import {CgMenuRight} from 'react-icons/cg';

const Header = ({setNavMobile, isAuthenticated}) => {
  return (
  <header className='py-[30px] lg:pt-[60px]' data-aos='fade-down'>
    <div className='container mx-auto flex items-center justify-between'>
        <img src={logo} alt='logo'/>
      <div className='hidden lg:flex gap-x-[55px]'>
        <Nav />
        <AccountBtns isAuthenticated={isAuthenticated} />
      </div>

      <div className='lg:hidden cursor-pointer' onClick={()=> setNavMobile(true)}>
        <CgMenuRight className='text-3xl'/>
      </div>
    </div>
  </header>

  );
};

export default Header;
