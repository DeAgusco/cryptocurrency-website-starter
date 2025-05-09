import React from 'react';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import Navbar from './Navbar';
import Footer from '../Home/Footer';

const DashboardLayout = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black to-darkblue">
      {/* 1. Navbar: Fixed top, explicit height, high z-index */}
      <div className="fixed top-0 left-0 right-0 z-40 h-14 h-16 shadow-lg">
        <Navbar /> {/* Ensure Navbar component itself is styled appropriately */}
      </div>

      {/* 2. Main Area Container: Absolute, covers area below navbar. Prevents x-overflow. */}
      {/* This div itself doesn't scroll; its child <main> will. Added flex flex-col for footer placement. */}
      <div className="absolute inset-0 pt-16 w-full flex flex-col overflow-x-hidden">
        
        {/* 3. Scrollable Viewport: This <main> element is the primary scroll container for sidebar + content */}
        {/* It takes full height of its parent and its direct children (sidebar, content_wrapper) arrange horizontally */}
        <main className="flex-1 flex flex-row overflow-y-auto">
          
          {/* 3a. Desktop Sidebar: Sticky within the scrolling <main>, viewport-based height */}
          <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-0 h-[calc(100vh-4rem)] self-start z-30">
            {/* top-0 makes it stick to the start of its scrolling parent (<main>) */}
            {/* h-[calc(100vh-4rem)] ensures it doesn't exceed viewport height minus navbar */}
            <Sidebar /> {/* Sidebar should fill this aside, e.g., with h-full if needed */}
          </aside>

          {/* 3b. Page Content Wrapper: Grows to fill remaining space, refined padding */}
          <div className="flex-grow px-4 pt-4 pb-20 lg:px-8 lg:pt-8 lg:pb-8"> {/* Padding for content, bottom padding for mobile nav */}
            <Dashboard />
            {/* Footer is now part of the scrollable content */}
            <div className="mt-8"> {/* Optional: Add space above footer if needed */}
                <Footer />
            </div>
          </div>
        </main>
        
        {/* Footer and spacer are now inside the scrollable <main> content wrapper */} 
      </div>

      {/* 4. Mobile Sidebar: Fixed at bottom, explicit height */}
      <div className="fixed bottom-0 left-0 right-0 w-full lg:hidden z-50 h-14 sm:h-16">
        <Sidebar /> {/* Sidebar component needs to handle its mobile display styles */}
      </div>

      {/* 5. Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none z-60">
        <div className="absolute top-1/4 -left-60 -left-80 w-72 w-96 h-72 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-60 -right-80 w-72 w-96 h-72 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-48 w-64 h-48 h-64 bg-blue-400/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default DashboardLayout;
