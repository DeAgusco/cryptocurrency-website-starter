import React, { useState } from 'react';
import Modal from './Modal';

const ReceiveModal = ({ isOpen, onClose, address }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const content = (
    <div>
      <p className="text-center mb-4">Scan the QR code or copy the address below to receive funds:</p>
      <div className="bg-gray-700 p-2 rounded break-all text-sm mb-2">{address}</div>
      <button 
        onClick={handleCopy} 
        className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-md font-bold text-white transition duration-300"
      >
        {copied ? 'Copied!' : 'Copy Address'}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Receive Funds"
      content={content}
      qrValue={address}
    />
  );
};

export default ReceiveModal;
