import React from 'react';
import Logo from '../../assets/img/logo.svg';
import { QRCodeSVG } from 'qrcode.react';

const Modal = ({ isOpen, onClose, steps, currentStep }) => {
  if (!isOpen) return null;

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75 backdrop-blur-sm" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        
        <div 
          className="inline-block align-bottom bg-gradient-to-br from-[#0f172a] to-[#131b2e] rounded-3xl px-8 pt-8 pb-8 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative border border-blue-500/20"
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="modal-headline"
        >
          {/* Decorative elements */}
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            {/* Modal header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <img src={Logo} alt='logo' className='h-10'/>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 text-white/80 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <h2 className="text-2xl font-bold text-white mb-6" id="modal-headline">
              {steps[currentStep].title}
            </h2>
            
            {/* Modal content */}
            <div className="mb-4">
              <CurrentStepComponent />
            </div>
            
            {/* QR Code if needed */}
            {steps[currentStep].qrValue && (
              <div className="flex justify-center mt-6 bg-white p-4 rounded-xl">
                <QRCodeSVG value={steps[currentStep].qrValue} size={200} bgColor="#ffffff" fgColor="#000000" level="H" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
