"use client";
import { useRouter } from 'next/navigation';

const PaymentCancel = () => {
  const router = useRouter();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-4">Payment Canceled</h1>
      <p className="text-center text-lg">
        It seems like the payment was canceled. You can try booking your teleconsultation again.
      </p>
      <div className="text-center mt-6">
        <button
          className="bg-blue-600 text-white py-2 px-4 rounded"
          onClick={() => router.push('/teleconsultors')}
        >
          Go Back to Teleconsultors
        </button>
      </div>
    </div>
  );
};

export default PaymentCancel;
