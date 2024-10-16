import React from 'react';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import Navbar from './Navbar'; // Make sure you've created this component

const DashboardLayout = () => {
  return (
    <div className="relative h-screen bg-darkblue">
      <Navbar />
      <div className="absolute inset-0 pt-16 w-full">
        <main className="h-full flex flex-row overflow-y-auto bg-darkblue p-0 lg:p-16 rounded-t-2xl shadow-lg">
          <div className="hidden lg:block flex-grow">
            <Sidebar />
          </div>
          <div className="flex-grow bg-gray-100 rounded-tl-2xl pb-16 lg:pb-0 mb-16">
            <Dashboard />
          </div>
        </main>
      </div>
      <div className="lg:hidden">
        <Sidebar />
      </div>
    </div>
  );
};

export default DashboardLayout;
