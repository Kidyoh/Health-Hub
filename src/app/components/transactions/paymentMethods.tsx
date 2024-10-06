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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Payment Methods</h1>
      
      {loading ? (
        <p className="text-gray-500">Loading payment methods...</p>
      ) : (
        <div>
          {paymentMethods.length === 0 ? (
            <p className="text-gray-500">No payment methods found.</p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paymentMethods.map((method) => (
                <li 
                  key={method.id} 
                  className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 flex flex-col justify-between transition duration-200 hover:shadow-lg"
                >
                  <div>
                    <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">{method.provider}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{method.cardType} ending in {method.last4}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Expires: {method.expMonth}/{method.expYear}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Add Payment Method Component */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Add a Payment Method</h2>
        <AddPaymentMethod onPaymentMethodAdded={handlePaymentMethodAdded} />
      </div>
    </div>
  );
};

export default PaymentMethods;
