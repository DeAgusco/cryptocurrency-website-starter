import React from 'react';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import Navbar from './Navbar'; // Make sure you've created this component
import Footer from '../Home/Footer';

const DashboardLayout = () => {
  return (
    <div className="relative h-screen bg-darkblue">
      <Navbar />
      <div className="absolute inset-0 pt-16 w-full">
        <main className="h-full flex flex-row overflow-y-auto bg-darkblue p-0 lg:px-16 rounded-t-2xl shadow-lg">
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-0">
              <Sidebar />
            </div>
          </div>
          <div className="flex-grow overflow-y-auto bg-gray-100 rounded-tl-2xl lg:pb-0">
            <Dashboard />
          </div>
        </main>
        <Footer />
        <div className='h-40 lg:h-16 bg-darkblue'></div>
      </div>
      <div className="lg:hidden">
        <Sidebar />
      </div>
    </div>
  );
};

export default DashboardLayout;
