import React, { useState } from 'react';
import Modal from './Modal';

const Step1 = ({ goToNextStep, data, setData }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    goToNextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="fullName"
        value={data.fullName}
        onChange={(e) => setData({ ...data, fullName: e.target.value })}
        placeholder="Full Name"
        className="w-full p-2 bg-darkblue-secondary text-white rounded-md"
        required
      />
      <input
        type="date"
        name="dateOfBirth"
        value={data.dateOfBirth}
        onChange={(e) => setData({ ...data, dateOfBirth: e.target.value })}
        className="w-full p-2 bg-darkblue-secondary text-white rounded-md"
        required
      />
      <input
        type="text"
        name="address"
        value={data.address}
        onChange={(e) => setData({ ...data, address: e.target.value })}
        placeholder="Address"
        className="w-full p-2 bg-darkblue-secondary text-white rounded-md"
        required
      />
      <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white rounded-md">Next</button>
    </form>
  );
};

const Step2 = ({ goToNextStep, data, setData }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    goToNextStep();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData({ ...data, idImage: file });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <select
        name="idType"
        value={data.idType}
        onChange={(e) => setData({ ...data, idType: e.target.value })}
        className="w-full p-2 bg-darkblue-secondary text-white rounded-md"
        required
      >
        <option value="">Select ID Type</option>
        <option value="passport">Passport</option>
        <option value="driverLicense">Driver's License</option>
        <option value="nationalId">National ID</option>
      </select>
      <input
        type="text"
        name="idNumber"
        value={data.idNumber}
        onChange={(e) => setData({ ...data, idNumber: e.target.value })}
        placeholder="ID Number"
        className="w-full p-2 bg-darkblue-secondary text-white rounded-md"
        required
      />
      <input
        type="file"
        name="idImage"
        onChange={handleFileChange}
        className="w-full p-2 bg-darkblue-secondary text-white rounded-md"
        required
      />
      {data.idImage && (
        <p className="text-sm text-gray-300">Selected file: {data.idImage.name}</p>
      )}
      <div className="flex justify-between">
        <button type="button" onClick={() => goToNextStep(-1)} className="py-2 px-4 bg-gray-500 text-white rounded-md">Back</button>
        <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded-md">Next</button>
      </div>
    </form>
  );
};

const Step3 = ({ goToNextStep, data, setData }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    goToNextStep();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData({ ...data, addressProofImage: file });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-white">Upload a proof of address (utility bill, bank statement, etc.)</p>
      <input
        type="file"
        name="addressProofImage"
        onChange={handleFileChange}
        className="w-full p-2 bg-darkblue-secondary text-white rounded-md"
        required
      />
      {data.addressProofImage && (
        <p className="text-sm text-gray-300">Selected file: {data.addressProofImage.name}</p>
      )}
      <div className="flex justify-between">
        <button type="button" onClick={() => goToNextStep(-1)} className="py-2 px-4 bg-gray-500 text-white rounded-md">Back</button>
        <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded-md">Next</button>
      </div>
    </form>
  );
};

const Step4 = ({ goToNextStep, data, isLoading, error }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    goToNextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-white font-bold">Review Your Information</h3>
      <p className="text-white">Name: {data.fullName}</p>
      <p className="text-white">Date of Birth: {data.dateOfBirth}</p>
      <p className="text-white">Address: {data.address}</p>
      <p className="text-white">ID Type: {data.idType}</p>
      <p className="text-white">ID Number: {data.idNumber}</p>
      <p className="text-white">ID Image: {data.idImage?.name}</p>
      <p className="text-white">Address Proof: {data.addressProofImage?.name}</p>
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex justify-between">
        <button type="button" onClick={() => goToNextStep(-1)} className="py-2 px-4 bg-gray-500 text-white rounded-md">Back</button>
        <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded-md" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
};

const VerificationModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    address: '',
    idType: '',
    idNumber: '',
    idImage: null,
    addressProofImage: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const goToNextStep = async (increment = 1) => {
    const nextStep = currentStep + increment;
    if (nextStep >= 0 && nextStep < steps.length) {
      setCurrentStep(nextStep);
    } else if (nextStep === steps.length) {
      // Submit the form
      setIsLoading(true);
      setError('');
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      setIsLoading(false);
      setError('Verification failed. Please try again later.');
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    setFormData({
      fullName: '',
      dateOfBirth: '',
      address: '',
      idType: '',
      idNumber: '',
      idImage: null,
      addressProofImage: null,
    });
    setError('');
    onClose();
  };

  const steps = [
    {
      title: "Personal Information",
      component: () => (
        <Step1
          goToNextStep={goToNextStep}
          data={formData}
          setData={setFormData}
        />
      ),
    },
    {
      title: "Identity Verification",
      component: () => (
        <Step2
          goToNextStep={goToNextStep}
          data={formData}
          setData={setFormData}
        />
      ),
    },
    {
      title: "Address Verification",
      component: () => (
        <Step3
          goToNextStep={goToNextStep}
          data={formData}
          setData={setFormData}
        />
      ),
    },
    {
      title: "Review and Submit",
      component: () => (
        <Step4
          goToNextStep={goToNextStep}
          data={formData}
          isLoading={isLoading}
          error={error}
        />
      ),
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      steps={steps}
      currentStep={currentStep}
    />
  );
};

export default VerificationModal;
