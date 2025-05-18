import React, { useState } from 'react';
import Logo from '../../assets/img/logo.svg';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70">
      <div className="relative bg-gradient-to-r from-blue-900/90 to-purple-900/90 backdrop-blur-xl rounded-2xl w-full max-w-2xl p-8 max-h-[80vh] overflow-auto border border-blue-500/30 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl hover:text-blue-400 transition-colors"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>
        <div className="text-blue-50">
          {children}
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  const [modalOpen, setModalOpen] = useState(null);
  
  const openModal = (modal) => {
    setModalOpen(modal);
  };
  
  const closeModal = () => {
    setModalOpen(null);
  };
  
  return (
    <footer>
      <div className='container mx-auto py-10'>
        <div className='flex flex-col lg:flex-row lg:justify-between lg:items-center gap-y-5 lg:gap-y-0'>
          <div className='flex flex-col lg:flex-row gap-y-5 items-center justify-center'>
            <div className='flex items-center gap-x-2'>
              <img src={Logo} alt='logo' className='h-10'/>
              <p className='text-gray'>© 2021</p>
            </div>
          </div>
          <div className='flex justify-center lg:justify-end lg:gap-x-5 gap-x-5'>
            <button 
              className='text-gray hover:underline'
              onClick={() => openModal('terms')}
            >
              Terms of Service
            </button>
            <button 
              className='text-gray hover:underline'
              onClick={() => openModal('privacy')}
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </div>
      
      {/* Terms of Service Modal */}
      <Modal 
        isOpen={modalOpen === 'terms'} 
        onClose={closeModal} 
        title="Terms of Service"
      >
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-blue-300">1. Introduction</h3>
          <p>These Terms of Service govern your use of our cryptocurrency trading platform. By accessing or using our services, you agree to be bound by these terms.</p>
          
          <h3 className="text-xl font-semibold text-blue-300">2. Eligibility</h3>
          <p>You must be at least 18 years old to use our services. By using our platform, you represent and warrant that you meet all eligibility requirements.</p>
          
          <h3 className="text-xl font-semibold text-blue-300">3. Account Registration</h3>
          <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
          
          <h3 className="text-xl font-semibold text-blue-300">4. Trading Risks</h3>
          <p>Cryptocurrency trading involves significant risks. You should carefully consider your financial situation and risk tolerance before making any transactions.</p>
          
          <h3 className="text-xl font-semibold text-blue-300">5. Fees</h3>
          <p>We charge fees for trading activities as outlined in our Fee Schedule. Fees are subject to change with notice.</p>
          
          <h3 className="text-xl font-semibold text-blue-300">6. Termination</h3>
          <p>We reserve the right to suspend or terminate your account at any time for violations of these terms or for any other reason at our discretion.</p>
          
          <h3 className="text-xl font-semibold text-blue-300">7. Limitation of Liability</h3>
          <p>Our liability is limited to the maximum extent permitted by applicable law. We are not responsible for any indirect, incidental, or consequential damages.</p>
          
          <h3 className="text-xl font-semibold text-blue-300">8. Governing Law</h3>
          <p>These terms are governed by the laws of the jurisdiction in which our company is registered, without regard to conflict of law principles.</p>
        </div>
      </Modal>
      
      {/* Privacy Policy Modal */}
      <Modal 
        isOpen={modalOpen === 'privacy'} 
        onClose={closeModal} 
        title="Privacy Policy"
      >
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-blue-300">1. Information We Collect</h3>
          <p>We collect personal information that you provide directly to us, including your name, email address, and financial information necessary for transactions.</p>
          
          <h3 className="text-xl font-semibold text-blue-300">2. How We Use Your Information</h3>
          <p>We use your information to provide and improve our services, process transactions, send notifications, and comply with legal obligations.</p>
          
          <h3 className="text-xl font-semibold text-blue-300">3. Information Sharing</h3>
          <p>We do not sell your personal information. We may share your information with service providers, business partners, and when required by law.</p>
          
          <h3 className="text-xl font-semibold text-blue-300">4. Data Security</h3>
          <p>We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.</p>
          
          <h3 className="text-xl font-semibold text-blue-300">5. Cookies and Tracking</h3>
          <p>We use cookies and similar technologies to enhance your experience, collect usage information, and enable certain functionality.</p>
          
          <h3 className="text-xl font-semibold text-blue-300">6. Your Rights</h3>
          <p>Depending on your location, you may have rights to access, correct, delete, or restrict the processing of your personal information.</p>
          
          <h3 className="text-xl font-semibold text-blue-300">7. Changes to This Policy</h3>
          <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on our platform.</p>
          
          <h3 className="text-xl font-semibold text-blue-300">8. Contact Us</h3>
          <p>If you have any questions about this Privacy Policy, please contact our support team.</p>
        </div>
      </Modal>
    </footer>
  );
};

export default Footer;
