"use client";
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define the response type
interface PaymentSuccessResponse {
  success: boolean;
  message?: string;
}

const PaymentSuccess: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const teleconsultationId = searchParams ? searchParams.get('teleconsultationId') : null;

  useEffect(() => {
    const verifyPayment = async () => {
      if (!teleconsultationId) {
        toast.error('Teleconsultation ID is missing.');
        setError('Teleconsultation ID is missing.');
        setLoading(false);  // Stop loading
        return;
      }

      toast.info('Verifying your payment, please wait...', { autoClose: false, toastId: 'verify-toast' });

      try {
        const res = await fetch(`/api/payment-success`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ teleconsultationId }),
        });

        const data: PaymentSuccessResponse = await res.json();

        if (data.success) {
          toast.update('verify-toast', {
            render: 'Payment successfully verified! Teleconsultation is now approved.',
            type: 'success',
            autoClose: 3000,
          });

          toast.success('Receipt generated and sent via email.');
          setLoading(false);

          setTimeout(() => router.push('/user/teleconsultations'), 3000); // Redirect after 3 seconds
        } else {
          toast.update('verify-toast', {
            render: data.message || 'Failed to verify the payment.',
            type: 'error',
            autoClose: 5000,
          });
          setError(data.message || 'Failed to update the teleconsultation status.');
        }
      } catch (err) {
        toast.update('verify-toast', {
          render: 'An error occurred while verifying the payment.',
          type: 'error',
          autoClose: 5000,
        });
        setError('An error occurred while verifying the payment.');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [teleconsultationId, router]);

  return (
    <div className="container mx-auto py-8">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-center mb-4">Payment Status</h1>
      {loading ? (
        <p className="text-center text-lg">Verifying payment...</p>
      ) : (
        <p className="text-center text-lg">
          {error ? (
            <span className="text-red-500">{error}</span>
          ) : (
            'Your teleconsultation has been successfully booked and approved. You can now view it in your dashboard.'
          )}
        </p>
      )}
    </div>
  );
};

export default PaymentSuccess;
