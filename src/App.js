import React, { useEffect, useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Aos from 'aos';
import 'aos/dist/aos.css';
import './styles/animatedBackground.css';
import Header from './components/Home/Header';
import NavMobile from './components/Home/NavMobile';
import LandingPage from './components/LandingPage';
import Footer from './components/Home/Footer';
import Signin from './components/Auth/Signin';
import Signup from './components/Auth/Signup';
import DashboardModal from './components/Dashboard/DashboardModal';
import EmailConfirmationApproval from './components/Auth/EmailConfirmationApproval';
import EmailConfirmationListener from './components/Auth/EmailConfirmationListener';
import WalletLayout from './components/Wallet/WalletLayout';
import PricesLayout from './components/Prices/PricesLayout';
import ExchangeLayout from './components/Exchange/ExchangeLayout';
import SettingsPage from './components/Settings/SettingsPage';
import './App.css';

const AppContent = () => {
  const [navMobile, setNavMobile] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token');
  });
  
  const location = useLocation();

  const checkAuthStatus = useCallback(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    checkAuthStatus();
    window.addEventListener('storage', checkAuthStatus);
    
    // Custom event listener for auth changes
    window.addEventListener('authChange', checkAuthStatus);

    return () => {
      window.removeEventListener('storage', checkAuthStatus);
      window.removeEventListener('authChange', checkAuthStatus);
    };
  }, [checkAuthStatus]);

  useEffect(() => {
    Aos.init({
      duration: 1000,
      delay: 100,
      offset: 100,
    });
  }, []);
  const isAuthPage = ['/login', '/signup', '/email-confirmation', '/wallets', '/prices', '/exchange'].includes(location.pathname) || location.pathname.startsWith('/activate/');
  const isDashboardPage = location.pathname === '/dashboard';
  const isWalletPage = location.pathname === '/wallets';
  return (
    <div className='overflow-hidden'>
      {!isAuthPage && !isDashboardPage && (
        <Header 
          setNavMobile={setNavMobile} 
          isAuthenticated={isAuthenticated} 
          checkAuthStatus={checkAuthStatus}
        />
      )}
      {!isAuthPage && !isDashboardPage && !isWalletPage && (
        <div className={`${navMobile ? 'right-0' : '-right-full'} fixed z-10 top-0 h-full transition-all duration-500`}>
          <NavMobile setNavMobile={setNavMobile}/>
        </div>
      )}
      <Routes>
        <Route 
          path="/login" 
          element={<Signin setIsAuthenticated={setIsAuthenticated} checkAuthStatus={checkAuthStatus} />} 
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/email-confirmation" element={<EmailConfirmationListener setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/activate/:activation_token" element={<EmailConfirmationApproval />} />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <DashboardModal /> : <Navigate to="/login" />} 
        />
        <Route path="/wallets" element={isAuthenticated ? <WalletLayout /> : <Navigate to="/login" />} />
        <Route path="/prices" element={isAuthenticated ? <PricesLayout /> : <Navigate to="/login" />} />
        <Route path="/exchange" element={isAuthenticated ? <ExchangeLayout /> : <Navigate to="/login" />} />
        <Route path="/settings" element={isAuthenticated ? <SettingsPage /> : <Navigate to="/login" />} />
        <Route path="/" element={
          <>
            <LandingPage />
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
