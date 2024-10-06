import React, { useState } from 'react';
import axios from 'axios';

interface AddPaymentMethodProps {
  onPaymentMethodAdded: (paymentMethod: any) => void;
}

const AddPaymentMethod: React.FC<AddPaymentMethodProps> = ({ onPaymentMethodAdded }) => {
  const [type, setType] = useState('credit_card');
  const [provider, setProvider] = useState('');
  const [last4, setLast4] = useState('');
  const [cardType, setCardType] = useState('');
  const [expMonth, setExpMonth] = useState('');
  const [expYear, setExpYear] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/user/payment-methods/add-payments', {
        type,
        provider,
        last4,
        cardType,
        expMonth: parseInt(expMonth),
        expYear: parseInt(expYear),
      });
      
      setLoading(false);
      onPaymentMethodAdded(response.data.paymentMethod);  // Trigger parent update
      alert('Payment method added successfully');
    } catch (error) {
      console.error('Error adding payment method:', error);
      setLoading(false);
      alert('Error adding payment method');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Add Payment Method</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Provider</label>
        <input 
          type="text" 
          value={provider} 
          onChange={(e) => setProvider(e.target.value)} 
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Visa, MasterCard" 
          required 
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last 4 digits</label>
        <input 
          type="text" 
          value={last4} 
          onChange={(e) => setLast4(e.target.value)} 
          maxLength={4}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required 
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Card Type</label>
        <input 
          type="text" 
          value={cardType} 
          onChange={(e) => setCardType(e.target.value)} 
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Credit, Debit" 
          required 
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiration Month</label>
        <input 
          type="number" 
          value={expMonth} 
          onChange={(e) => setExpMonth(e.target.value)} 
          min="1" 
          max="12"
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required 
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiration Year</label>
        <input 
          type="number" 
          value={expYear} 
          onChange={(e) => setExpYear(e.target.value)} 
          min="2023"
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required 
        />
      </div>

      <button 
        type="submit" 
        className={`w-full p-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Payment Method'}
      </button>
    </form>
  );
};

export default AddPaymentMethod;
