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
    <form onSubmit={handleSubmit}>
      <h2>Add Payment Method</h2>
      <div>
        <label>Provider</label>
        <input 
          type="text" 
          value={provider} 
          onChange={(e) => setProvider(e.target.value)} 
          placeholder="e.g., Visa, MasterCard" 
          required 
        />
      </div>
      <div>
        <label>Last 4 digits</label>
        <input 
          type="text" 
          value={last4} 
          onChange={(e) => setLast4(e.target.value)} 
          maxLength={4} 
          required 
        />
      </div>
      <div>
        <label>Card Type</label>
        <input 
          type="text" 
          value={cardType} 
          onChange={(e) => setCardType(e.target.value)} 
          placeholder="e.g., Credit, Debit" 
          required 
        />
      </div>
      <div>
        <label>Expiration Month</label>
        <input 
          type="number" 
          value={expMonth} 
          onChange={(e) => setExpMonth(e.target.value)} 
          min="1" 
          max="12" 
          required 
        />
      </div>
      <div>
        <label>Expiration Year</label>
        <input 
          type="number" 
          value={expYear} 
          onChange={(e) => setExpYear(e.target.value)} 
          min="2023" 
          required 
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Payment Method'}
      </button>
    </form>
  );
};

export default AddPaymentMethod;
