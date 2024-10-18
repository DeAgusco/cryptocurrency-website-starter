import React, { useState } from 'react';
import Modal from './Modal';

const SendModal = ({ isOpen, onClose, onSend }) => {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');

  const handleSend = () => {
    onSend(address, amount);
    onClose();
  };

  const content = (
    <div>
      <input
        type="text"
        placeholder="Recipient Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full px-3 py-2 bg-gray-700/50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full px-3 py-2 bg-gray-700/50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
      />
    </div>
  );

  const action = {
    text: 'Send',
    onClick: handleSend,
    disabled: !address || !amount
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Send Funds"
      content={content}
      action={action}
    />
  );
};

export default SendModal;
