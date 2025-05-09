import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>, label: 'Dashboard', path: '/dashboard' },
    { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>, label: 'Exchange', path: '/exchange' },
    { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>, label: 'Prices', path: '/prices' },
    { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>, label: 'Wallet', path: '/wallets' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col bg-gradient-to-b from-darkblue/80 to-darkblue-secondary/80 backdrop-blur-lg text-white h-[calc(100vh-64px)] w-64 p-6 rounded-tr-3xl border-r border-white/5 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 -left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <h2 className="text-xl font-semibold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Navigation</h2>
          
          <nav className="flex-grow">
            <ul className="space-y-4">
              {menuItems.map((item, index) => {
                const active = isActive(item.path);
                return (
                  <li key={index}>
                    <Link 
                      to={item.path} 
                      className={`flex items-center p-3 rounded-xl transition-all duration-300 ${
                        active 
                          ? 'bg-gradient-to-r from-blue-600/30 to-purple-600/30 border border-white/10 shadow-[0_0_10px_rgba(101,121,248,0.2)]' 
                          : 'hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <span className={`mr-3 text-xl ${active ? 'text-blue-400' : 'text-blue-300'}`}>{item.icon}</span>
                      <span className={active ? 'font-medium text-white' : 'text-blue-200'}>{item.label}</span>
                      {active && (
                        <span className="ml-auto w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"></span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          
          <div className="mt-auto pt-8">
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-lg border border-white/10 shadow-[0_0_15px_rgba(101,121,248,0.1)]">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-white">Need Help?</span>
              </div>
              <p className="text-xs text-blue-200">Contact our support team for assistance with your account.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-4 left-[22%] right-0 bg-gradient-to-r from-darkblue/90 to-darkblue-secondary/90 backdrop-blur-lg text-white py-2 w-[60%] h-16 rounded-2xl z-50 shadow-[0_0_20px_rgba(101,121,248,0.3)] border border-white/10">
        <nav>
          <ul className="flex justify-around h-full items-center">
            {menuItems.map((item, index) => {
              const active = isActive(item.path);
              return (
                <li key={index}>
                  <Link 
                    to={item.path} 
                    className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 ${
                      active 
                        ? 'bg-gradient-to-r from-blue-600/30 to-purple-600/30 border border-white/10' 
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <span className={`text-2xl ${active ? 'text-blue-400' : 'text-blue-300'}`}>{item.icon}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
