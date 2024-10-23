import React from 'react';

const ConfirmationStep = ({ error }) => {
  return (
    <div className="text-center">
      {error ? (
        <>
          <svg className="w-16 h-16 mx-auto text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          <p className="mt-4 text-lg text-red-300">{error}</p>
        </>
      ) : (
        <>
          <svg className="w-16 h-16 mx-auto text-blue-400 animate-[checkmark_0.5s_ease-in-out_forwards]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <p className="mt-4 text-lg text-gray-300">Check your email for further instructions.</p>
        </>
      )}
    </div>
  );
};

export default ConfirmationStep;