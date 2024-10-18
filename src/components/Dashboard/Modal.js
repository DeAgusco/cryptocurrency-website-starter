import React from 'react';
import Logo from '../../assets/img/logo.svg';
import FloatingCoins from '../FloatingCoins';
import { QRCodeSVG } from 'qrcode.react'; // You'll need to install this package: npm install qrcode.react

const Modal = ({ isOpen, onClose, title, content, action, qrValue }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="relative flex justify-center items-center min-h-screen w-full">
        <FloatingCoins />
        <div className="backdrop-blur-md bg-darkblue/30 p-8 rounded-lg shadow-lg w-full max-w-md border border-white/20 z-10">
          <div className="flex flex-row items-center justify-between mb-6">
            <img src={Logo} alt='logo' className='h-10'/>
            <button onClick={onClose} className="text-white hover:text-gray-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <h2 className="text-2xl font-bold text-center text-white mb-6">{title}</h2>
          {content && <div className="text-white mb-6">{content}</div>}
          {qrValue && (
            <div className="flex justify-center mb-6">
              <QRCodeSVG value={qrValue} size={200} bgColor="#ffffff" fgColor="#000000" level="H" />
            </div>
          )}
          {action && (
            <button
              onClick={action.onClick}
              disabled={action.disabled}
              className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-md font-bold text-white transition duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {action.text}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;