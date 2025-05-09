import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/img/logo.svg';
import Nav from './Nav';
import AccountBtns from './AccountBtns';
import { CgMenuRight } from 'react-icons/cg';

const Header = ({ setNavMobile, isAuthenticated, checkAuthStatus }) => {
  const [scrolled, setScrolled] = useState(false);

  // Add scroll event listener to create a transparent-to-solid header effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 ${
        scrolled 
          ? 'bg-gradient-to-r from-blue-dark/95 to-darkblue-tertiary/95 backdrop-blur-md shadow-lg'
          : 'bg-gradient-to-r from-blue-dark/80 to-darkblue-tertiary/80 backdrop-blur-sm'
      }`}
      data-aos="fade-down"
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="logo" className="h-8 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex gap-x-[55px] items-center">
          <Nav />
          <AccountBtns isAuthenticated={isAuthenticated} checkAuthStatus={checkAuthStatus} />
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden cursor-pointer bg-white/5 hover:bg-white/10 p-2 rounded-full border border-white/10 transition-colors duration-200"
          onClick={() => setNavMobile(true)}
          aria-label="Open Menu"
        >
          <CgMenuRight className="text-2xl text-blue-300" />
        </button>
      </div>

      {/* Decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
    </header>
  );
};

export default Header;
