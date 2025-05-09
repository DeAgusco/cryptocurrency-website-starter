import React from 'react';
import Sidebar from '../Dashboard/Sidebar';
import ExchangePage from './ExchangePage';
import Navbar from '../Dashboard/Navbar';
import Footer from '../Home/Footer';

const ExchangeLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black to-darkblue">
      {/* Navbar - fixed at top */}
      <div className="fixed top-0 left-0 right-0 z-40 h-16 shadow-lg">
        <Navbar />
      </div>

      {/* Main Area Wrapper (for sidebar and content) - Flex container, grows to fill space */}
      <div className="absolute inset-0 pt-16 w-full flex flex-col overflow-x-hidden">
        
        {/* 3. Scrollable Viewport: This <main> element is the primary scroll container */}
        <main className="flex-1 flex flex-row overflow-y-auto">
          
          {/* 3a. Desktop Sidebar: Sticky within the scrolling <main>, viewport-based height */}
          <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-0 h-[calc(100vh-4rem)] self-start z-30">
            <Sidebar />
          </aside>

          {/* 3b. Page Content Wrapper: Grows to fill remaining space, refined padding */}
          <div className="flex-grow px-4 pt-4 pb-20 lg:px-8 lg:pt-8 lg:pb-8">
            <ExchangePage />
            <div className="mt-8">
                <Footer />
            </div>
          </div>
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
