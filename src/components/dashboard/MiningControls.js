import React, { useState } from 'react';

const MiningControls = () => {
  const [isMining, setIsMining] = useState(false);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Mining Controls</h2>
      <button 
        onClick={() => setIsMining(!isMining)}
        className={`w-full py-2 px-4 rounded font-bold ${
          isMining 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-green-500 hover:bg-green-600'
        }`}
      >
        {isMining ? 'Stop Mining' : 'Start Mining'}
      </button>
    </div>
  );
};

export default MiningControls;