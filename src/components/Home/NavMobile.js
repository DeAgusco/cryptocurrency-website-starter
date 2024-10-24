import React from 'react';
import {navData} from '../../data';
import { CgClose } from 'react-icons/cg';
import AccountBtns from './AccountBtns';

const NavMobile = ({setNavMobile}) => {
  return (
  <nav className='lg:hidden bg-darkblue-secondary h-full top-0 bottom-0 w-80 flex justify-center items-center'>
    <div className='absolute top-2 left-2 cursor-pointer' onClick={()=> setNavMobile(false)}>
      <CgClose className='text-3xl' />
    </div>

    <ul className='text-xl flex flex-col gap-y-8'>
      {navData.map((item, index) => {
        return (
          <li key={index}>
            <a href={item.href}>{item.name}</a>
          </li>
        );
      }
      )}
      <li>
        <AccountBtns />
      </li>
    </ul>
  </nav>

  );
};

export default NavMobile;
