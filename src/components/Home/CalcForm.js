import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../Services/AuthService';

const CalcForm = () => {
  const navigate = useNavigate();

  const handleCalculate = (e) => {
    e.preventDefault();
    if (!amount || !fromCurrency || !toCurrency) {
      alert('Please fill in all fields');
      return;
    }
    if (AuthService.isLoggedIn()) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return <form onSubmit={handleCalculate}>
    <div className='flex gap-x-4'>
      <select className='border border-gray-300 px-4 py-2 rounded-lg w-full bg-navy-700 py-4'>
        <option value=''>H/s</option>
        <option value=''>KH/s</option>
        <option value=''>MH/s</option>
        <option value=''>GH/s</option>
        <option value=''>TH/s</option>
        <option value=''>PH/s</option>
      </select>
    </div>
    <div className='flex gap-x-4 mt-4'>
      <select className='border border-gray-300 px-4 py-2 rounded-lg w-full'>
        <option value=''>W</option>
        <option value=''>KW</option>
        <option value=''>MW</option>
        <option value=''>GW</option>
      </select>
    </div>
    <div className='flex gap-x-4 mt-4'>
      <select className='border border-gray-300 px-4 py-2 rounded-lg w-full'>
        <option value=''>USD</option>
        <option value=''>EUR</option>
        <option value=''>GBP</option>
        <option value=''>INR</option>
        <option value=''>AUD</option>
        <option value=''>CAD</option>
      </select>
    </div>
    <button type="submit" className='bg-blue text-white px-4 py-2 rounded-lg mt-4 w-full'>Calculate</button>
  </form>;
};

export default CalcForm;
