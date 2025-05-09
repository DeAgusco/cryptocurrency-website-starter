import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CgClose } from 'react-icons/cg';
import { motion, AnimatePresence } from 'framer-motion';
import AccountBtns from './AccountBtns';

// Updated navigation data with proper routing
const navData = [
  { name: 'Home', path: '/' },
  { name: 'Prices', path: '/prices' },
  { name: 'Trade', path: '/dashboard' },
  { name: 'Wallet', path: '/wallet' },
  { name: 'About', path: '/about' },
];

const NavMobile = ({ setNavMobile, isAuthenticated, checkAuthStatus }) => {
  // Add event listener for ESC key to close the menu
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setNavMobile(false);
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    // Prevent body scroll when menu is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [setNavMobile]);
  
  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };
  
  const menuVariants = {
    hidden: { x: '100%' },
    visible: { x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { x: '100%', transition: { duration: 0.2, ease: 'easeIn' } }
  };

  const linkVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: i => ({ 
      y: 0, 
      opacity: 1, 
      transition: { delay: 0.1 + (i * 0.05), duration: 0.2 } 
    }),
  };
  
  // Handle backdrop click to close the menu
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setNavMobile(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {/* Backdrop overlay */}
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={handleBackdropClick}
        key="backdrop"
      />
    
      <motion.nav 
        className="fixed top-0 right-0 bottom-0 w-72 md:w-80 bg-gradient-to-b from-blue-dark to-darkblue-tertiary shadow-2xl z-50 border-l border-white/10 backdrop-blur-lg"
        variants={menuVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        key="menu"
      >
        {/* Close button */}
        <button 
          className="absolute top-4 right-4 cursor-pointer bg-white/5 p-2 rounded-full hover:bg-white/10 transition-colors duration-200 z-10"
          onClick={() => setNavMobile(false)}
          aria-label="Close Menu"
        >
          <CgClose className="text-2xl text-blue-300" />
        </button>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>

        {/* Content container */}
        <div className="flex flex-col justify-center items-center h-full px-6 overflow-y-auto py-16">
          <motion.ul 
            className="text-xl flex flex-col gap-y-6 mb-10 w-full"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {navData.map((item, index) => (
              <motion.li 
                key={index}
                custom={index}
                variants={linkVariants}
                className="border-b border-white/5 pb-2"
              >
                <Link 
                  to={item.path}
                  className="flex items-center text-blue-300 hover:text-white transition-colors duration-200 py-2"
                  onClick={() => setNavMobile(false)}
                >
                  <span className="text-lg font-medium">{item.name}</span>
                  <div className="ml-auto bg-white/5 w-6 h-6 rounded-full flex items-center justify-center">
                    <span className="text-xs text-blue-400">{index + 1}</span>
                  </div>
                </Link>
              </motion.li>
            ))}
          </motion.ul>

          <motion.div 
            className="w-full"
            variants={linkVariants}
            custom={navData.length + 1}
          >
            <AccountBtns isAuthenticated={isAuthenticated} checkAuthStatus={checkAuthStatus} />
          </motion.div>
        </div>
      </motion.nav>
    </AnimatePresence>
  );
};

export default NavMobile;
