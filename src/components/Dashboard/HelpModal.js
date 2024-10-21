import React, { useState, useEffect } from 'react';
import Modal from './Modal';

const HelpModal = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal is closed
      setMessage('');
      setIsSubmitting(false);
      setSubmitError('');
      setSubmitSuccess(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulated success
      setSubmitSuccess(true);
    } catch (error) {
      setSubmitError('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleClose = () => {
    onClose();
    // Reset state when modal is closed
    setMessage('');
    setIsSubmitting(false);
    setSubmitError('');
    setSubmitSuccess(false);
  };

  const steps = [
    {
      title: "Need Help?",
      component: () => (
        <div className="space-y-4">
          <p className="text-white text-center">
            If you need assistance, please describe your issue below and we'll get back to you as soon as possible.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              defaultValue={message}
              onBlur={(e) => setMessage(e.target.value)}
              placeholder="Describe your issue here..."
              className="w-full p-2 bg-darkblue-secondary text-white rounded-md h-32 resize-none"
              required
            />
            {submitError && <p className="text-red-500 text-center">{submitError}</p>}
            {submitSuccess ? (
              <div className="flex items-center justify-center">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-green-500 text-center ml-2">Submitted successfully!</p>
              </div>
            ) : (
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-md font-bold text-white transition duration-300 flex items-center justify-center disabled:bg-gray-500/50"
                disabled={isSubmitting}
              >
                {isSubmitting ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div> : 'Submit'}
              </button>
            )}
          </form>
        </div>
      ),
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      steps={steps}
      currentStep={0}
    />
  );
};

export default HelpModal;
