import React from 'react';
import { Link } from 'react-router-dom';

// Updated navigation data with proper routing
const navData = [
  { name: 'Home', path: '/' },
  { name: 'Prices', path: '/prices' },
  { name: 'Trade', path: '/dashboard' },
  { name: 'Wallet', path: '/wallet' },
  { name: 'About', path: '/about' },
];

const Nav = () => {
  return (
    <nav className="flex items-center">
      <ul className="flex gap-x-6">
        {navData.map((item, index) => (
          <li 
            key={index}
            className="relative group"
          >
            <Link 
              to={item.path}
              className="py-2 px-1 text-blue-300 hover:text-white font-medium transition-all duration-300"
            >
              {item.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Nav;
