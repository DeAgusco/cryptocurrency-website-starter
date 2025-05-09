import React from 'react';

const ComingSoonModal = ({ isOpen, onClose, feature }) => {
  if (!isOpen) return null;

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
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20 border border-blue-500/20 text-blue-400 sm:mx-0">
                <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </div>
              <div className="mt-5 sm:mt-0 sm:ml-6 text-center sm:text-left">
                <h3 className="text-2xl leading-6 font-bold text-white" id="modal-headline">
                  Coming Soon
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-300">
                    {feature ? `${feature} feature is` : 'This feature is'} currently under development and will be available soon.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Animation */}
            <div className="mt-8 flex justify-center">
              <div className="relative w-40 h-40">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl animate-pulse"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center animate-spin-slow">
                  <div className="w-32 h-32 border-2 border-blue-500/30 border-t-blue-400 rounded-full"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center animate-reverse-spin">
                  <div className="w-24 h-24 border-2 border-purple-500/30 border-t-purple-400 rounded-full"></div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                className="inline-flex justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none transition-all duration-300"
                onClick={onClose}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonModal; 