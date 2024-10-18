import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout'; // Import your Dashboard component

const DashboardModal = () => {
  const [isOpen, setIsOpen] = useState(true); // Modal starts open

  return (
    <>
      <div className={`fixed inset-0 ${isOpen ? 'backdrop-blur-md' : ''} z-40`}>
        <DashboardLayout />
      </div>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="relative overflow-hidden rounded-lg shadow-xl w-80 h-[32rem] bg-white">
            <div className="absolute -top-1/2 -left-3/4 w-[200%] h-[150%] bg-blue rounded-[20%] origin-top-left -rotate-[30deg]"></div>
            <div className="relative z-10 p-6 text-center h-full flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Welcome to your Crappo Account</h2>
                <p className="text-white mb-6">
                  With the Crappo Account, your funds are held in our custody system.
                </p>
              </div>
              <div className="space-y-4">
                {['Buy, sell and trade crypto', 'Fund your account with a card or bank account', 'Earn rewards by putting your crypto to work'].map((text, index) => (
                  <button key={index} className="w-full h-16 py-2 px-4 bg-darkblue bg-opacity-20 backdrop-filter backdrop-blur-md text-white rounded-lg hover:bg-opacity-30 transform hover:-translate-y-1 transition-all duration-200 shadow-lg flex items-center justify-start space-x-3 drop-shadow-md hover:drop-shadow-xl">
                    {index === 0 && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    {index === 1 && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}
                    {index === 2 && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>}
                    <span>{text}</span>
                  </button>
                ))}
                <button
                  className="w-full py-2 px-4 bg-transparent border-2 border-white text-gray-500 rounded-lg hover:bg-darkblue hover:text-white transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardModal;
