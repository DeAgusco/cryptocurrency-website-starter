import React from 'react';
import Sidebar from '../Dashboard/Sidebar';
import ExchangePage from './ExchangePage';
import Navbar from '../Dashboard/Navbar';
import Footer from '../Home/Footer';

const ExchangeLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black to-darkblue">
      {/* Navbar - fixed at top */}
      <div className="fixed top-0 left-0 right-0 z-40">
        <Navbar />
      </div>

      {/* Main Area Wrapper (for sidebar and content) - Flex container, grows to fill space */}
      <div className="flex flex-1 pt-16">
        {/* Desktop Sidebar - sticky, fixed height relative to viewport */}
        <aside className="hidden lg:block w-64 h-[calc(100vh-4rem)] sticky top-16 self-start z-30">
          <Sidebar />
        </aside>

        {/* Main Content - takes remaining space and scrolls */}
        <main className="flex-1 overflow-y-auto z-20 pb-20 lg:pb-0">
          <div className="p-4 lg:p-8">
            <ExchangePage />
          </div>
          <Footer />
        </main>
      </div>

      {/* Mobile Sidebar - fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 w-full lg:hidden z-50">
        <Sidebar />
      </div>

      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 -left-80 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-80 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default ExchangeLayout;
