"use client";

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';  // Use useParams for dynamic route params

const BookTeleconsultation = () => {
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();  // Use useParams to get dynamic route params
  const id = params?.id as string | undefined;  // Extract teleconsultorId from the dynamic route

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!id) {
      console.error('Teleconsultor ID is missing');
      return;
    }

    try {
      // Instead of navigating to the payment URL directly,
      // navigate to the payment selection page with teleconsultorId and date as query params
      router.push(`/user/teleconsultors/payment-selection?teleconsultorId=${id}&date=${date}`);
    } catch (error) {
      console.error('Error booking teleconsultation:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Book Teleconsultation</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Select Date
          </label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 px-3 py-2 border shadow-sm border-gray-300 rounded-md w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Proceed to Payment'}
        </button>
      </form>
    </div>
  );
};

export default BookTeleconsultation;
