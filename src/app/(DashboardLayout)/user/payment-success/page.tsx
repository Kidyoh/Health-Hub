"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const PaymentSuccess = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showButton, setShowButton] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const teleconsultationId = searchParams ? searchParams.get('teleconsultationId') : null;

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const res = await fetch(`/api/payment-success`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ teleconsultationId }),
        });

        const data = await res.json();
        if (data.success) {
          setLoading(false);
          setMessage('Payment processed successfully!');
          setTimeout(() => setShowButton(true), 3000); // Show button after 3 seconds
        } else {
          setError('Failed to update the teleconsultation status.');
          setLoading(false);
        }
      } catch (err) {
        setError('An error occurred while verifying the payment.');
        setLoading(false);
      }
    };

    if (teleconsultationId) {
      verifyPayment();
    } else {
      setError('Teleconsultation ID is missing.');
      setLoading(false);
    }
  }, [teleconsultationId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-4">Payment Successful!</h1>
      <p className="text-center text-lg">
        Your teleconsultation has been successfully booked and approved. You can now view it in your dashboard.
      </p>
      {message && <p className="text-center text-green-500">{message}</p>}
      {showButton && (
        <div className="text-center mt-6">
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded"
            onClick={() => router.push('/user/teleconsultations')}
          >
            Go to Teleconsultations
          </button>
        </div>
      )}
    </div>
  );
};

const PaymentSuccessPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <PaymentSuccess />
  </Suspense>
);

export default PaymentSuccessPage;