"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

const SelectPaymentGateway = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract teleconsultorId and date from the query params
  const teleconsultorId = searchParams ? searchParams.get('teleconsultorId') : null;
  const date = searchParams ? searchParams.get('date'): null ;

  const handlePaymentSelection = async (gateway: string) => {
    setLoading(true);
    
    try {
      const res = await fetch(`/api/telemedicine/create-consultation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gateway, teleconsultorId, date }),  // Send gateway, teleconsultorId, and date in POST body
      });

      const data = await res.json();

      if (data.success) {
        // Redirect to the payment URL
        router.push(data.paymentUrl);
      } else {
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Error during payment selection:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Choose Your Payment Gateway</h1>
      <div className="flex justify-center gap-6">
        <button 
          onClick={() => handlePaymentSelection('stripe')} 
          className="bg-blue-600 text-white py-2 px-4 rounded"
          disabled={loading}
        >
          Pay with Stripe
        </button>
        <button 
          onClick={() => handlePaymentSelection('chapa')} 
          className="bg-green-600 text-white py-2 px-4 rounded"
          disabled={loading}
        >
          Pay with Chapa
        </button>
      </div>
    </div>
  );
};

export default SelectPaymentGateway;
