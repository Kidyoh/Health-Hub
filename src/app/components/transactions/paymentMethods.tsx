"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddPaymentMethod from '@/app/components/transactions/addPaymentMethods';

const PaymentMethods = () => {
  interface PaymentMethod {
    id: string;
    provider: string;
    cardType: string;
    last4: string;
    expMonth: number;
    expYear: number;
  }

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await axios.get('/api/user/payment-methods');
        setPaymentMethods(response.data.paymentMethods);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching payment methods:', error);
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, []);

  const handlePaymentMethodAdded = (newMethod: PaymentMethod) => {
    setPaymentMethods([...paymentMethods, newMethod]);
  };

  return (
    <div>
      <h1>Payment Methods</h1>
      {loading ? (
        <p>Loading payment methods...</p>
      ) : (
        <div>
          {paymentMethods.length === 0 ? (
            <p>No payment methods found.</p>
          ) : (
            <ul>
              {paymentMethods.map((method) => (
                <li key={method.id}>
                  <p>Provider: {method.provider}</p>
                  <p>Card Type: {method.cardType}</p>
                  <p>Last 4 digits: {method.last4}</p>
                  <p>Expires: {method.expMonth}/{method.expYear}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <AddPaymentMethod onPaymentMethodAdded={handlePaymentMethodAdded} />
    </div>
  );
};

export default PaymentMethods;
