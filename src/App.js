import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Aos from 'aos';
import 'aos/dist/aos.css';
import './styles/animatedBackground.css';

import Header from './components/Header';
import Hero from './components/Hero';
import NavMobile from './components/NavMobile';
import Stats from './components/Stats';
import Why from './components/Why';
import Calculate from './components/Calculate';
import Trade from './components/Trade';
import Features from './components/Features';
import Footer from './components/Footer';
import Signin from './components/Signin';
import Signup from './components/Signup';
import DashboardModal from './components/DashboardModal';
import './App.css';

const AppContent = () => {
  const [navMobile, setNavMobile] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // You'll need to implement actual authentication
  const location = useLocation();

  useEffect(() => {
    Aos.init({
      duration: 1000,
      delay: 100,
      offset: 100,
    });
  }, []);

  const isAuthPage = ['/login', '/signup'].includes(location.pathname);
  const isDashboardPage = location.pathname === '/dashboard';

  return (
    <div className='overflow-hidden'>
      {!isAuthPage && !isDashboardPage && <Header setNavMobile={setNavMobile} />}
      {!isAuthPage && !isDashboardPage && (
        <div className={`${navMobile ? 'right-0' : '-right-full'} fixed z-10 top-0 h-full transition-all duration-500`}>
          <NavMobile setNavMobile={setNavMobile}/>
        </div>
      )}
      <Routes>
        <Route path="/login" element={<Signin setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <DashboardModal /> : <Navigate to="/login" />} 
        />
        <Route path="/" element={
          <>
            <Hero />
            <Stats />
            <Why />
            <Calculate />
            <Trade />
            <Features />
          </>
        } />
      </Routes>
      {!isAuthPage && !isDashboardPage && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;