"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SubmitRefundRequest = () => {
  const [transactions, setTransactions] = useState<{ id: string; amount: number }[]>([]);
  const [selectedTransactionId, setSelectedTransactionId] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // Track if the request was submitted

  // Fetch transactions on component mount
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('/api/user/transactions', {
          headers: {
            'Cache-Control': 'no-cache', // Prevent caching
          },
        });

        if (response.status === 200 && response.data.transactions) {
          setTransactions(response.data.transactions);
        } else {
          toast.error('No transactions found.');
        }
      } catch (error) {
        toast.error('Error fetching transactions.');
        console.error('Error:', error);
      }
    };

    fetchTransactions();
  }, []);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/refund-requests/submit', {
        transactionId: selectedTransactionId,
        reason,
      });

      if (response.data.success) {
        toast.success('Refund request submitted successfully.');
        setIsSubmitted(true);
        setSelectedTransactionId(''); // Reset form
        setReason(''); // Reset reason field
      } else {
        toast.error('Failed to submit refund request.');
      }
    } catch (error) {
      if ((error as any).response && (error as any).response.data.error) {
        toast.error((error as any).response.data.error); // Display specific error from the server
      } else {
        toast.error('Failed to submit refund request.');
      }
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-white shadow-md rounded-lg">
      {isSubmitted ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Success!</h2>
          <p className="text-gray-700 mb-6">Your refund request has been submitted successfully.</p>
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded-md transition duration-200 ease-in-out hover:bg-blue-700"
            onClick={() => setIsSubmitted(false)} // Optionally allow the user to submit another refund
          >
            Submit Another Request
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-6 text-center">Submit Refund Request</h2>
          <form onSubmit={handleSubmit}>
            {/* Transaction Selection */}
            <div className="mb-4">
              <label htmlFor="transaction" className="block text-gray-700 font-semibold mb-2">
                Select Transaction:
              </label>
              <select
                id="transaction"
                value={selectedTransactionId}
                onChange={(e) => setSelectedTransactionId(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a transaction</option>
                {transactions.map((transaction) => (
                  <option key={transaction.id} value={transaction.id.toString()}>
                    {transaction.id} - ${transaction.amount}
                  </option>
                ))}
              </select>
            </div>

            {/* Reason for Refund */}
            <div className="mb-6">
              <label htmlFor="reason" className="block text-gray-700 font-semibold mb-2">
                Reason for Refund:
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-2 h-28 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the reason for your refund request..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-2 rounded-md transition duration-200 ease-in-out ${
                loading ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-700'
              }`}
            >
              {loading ? 'Submitting...' : 'Submit Refund Request'}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default SubmitRefundRequest;
