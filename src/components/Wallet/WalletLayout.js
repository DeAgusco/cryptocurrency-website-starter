import React from 'react';
import Sidebar from '../Dashboard/Sidebar';
import WalletPage from './WalletPage';
import Navbar from '../Dashboard/Navbar';
import Footer from '../Home/Footer';

const WalletLayout = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black to-darkblue">
      {/* 1. Navbar: Fixed top, explicit height, high z-index */}
      <div className="fixed top-0 left-0 right-0 z-40 h-16 shadow-lg">
        <Navbar />
      </div>

      {/* 2. Main Area Container: Absolute, covers area below navbar. Prevents x-overflow. */}
      <div className="absolute inset-0 pt-16 w-full flex flex-col overflow-x-hidden">
        
        {/* 3. Scrollable Viewport: This <main> element is the primary scroll container */}
        <main className="flex-1 flex flex-row overflow-y-auto">
          
          {/* 3a. Desktop Sidebar: Sticky within the scrolling <main>, viewport-based height */}
          <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-0 h-[calc(100vh-4rem)] self-start z-30">
            <Sidebar />
          </aside>

          {/* 3b. Page Content Wrapper: Grows to fill remaining space, refined padding */}
          <div className="flex-grow px-4 pt-4 pb-20 lg:px-8 lg:pt-8 lg:pb-8">
            <WalletPage />
            <div className="mt-8">
                <Footer />
            </div>
          </div>
        </main>
      </div>

      {/* 4. Mobile Sidebar: Fixed at bottom, explicit height */}
      <div className="fixed bottom-0 left-0 right-0 w-full lg:hidden z-50 h-16">
        <Sidebar />
      </div>

      
    </div>
  );
};

export default WalletLayout;
