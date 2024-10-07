"use client";

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookTeleconsultation = () => {
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!id) {
      toast.error('Teleconsultor ID is missing.');
      setLoading(false);
      return;
    }

    try {
      // Call the API to check availability
      const response = await axios.post('/api/user/teleconsultators/availability', {
        teleconsultorId: id,
        requestedDate: date,
      });

      if (response.data.success) {
        toast.success('Teleconsultor is available for the requested time. Redirecting to payment...');
        setTimeout(() => {
          router.push(`/user/teleconsultors/payment-selection?teleconsultorId=${id}&date=${date}`);
        }, 2000); // Short delay before redirect to allow users to see the success message
      } else {
        // Use the backend error message
        toast.warn(response.data.error || 'Unable to book teleconsultation. Please try another time.');
      }
    } catch (error) {
      toast.error('An error occurred while booking teleconsultation. Please try again.');
      console.error('Error booking teleconsultation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <ToastContainer />
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
