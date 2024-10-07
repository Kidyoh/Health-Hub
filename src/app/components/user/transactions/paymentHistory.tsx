"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spinner } from 'flowbite-react';
const MyTransactions = () => {
  interface Transaction {
    id: string;
    txRef: string;
    amount: number;
    status: string;
    createdAt: string;
  }

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('/api/user/transactions');
        setTransactions(response.data.transactions);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Function to handle downloading the receipt
  const downloadReceipt = async (txRef: string) => {
    try {
      const response = await axios.get(`/api/user/download-receipt?txRef=${txRef}`, {
        responseType: 'blob', // Ensure we handle the file response correctly
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt-${txRef}.pdf`); // Set the file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading receipt:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Transactions</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="xl" aria-label="Loading transactions" />
        </div>
      ) : (
        <div>
          {transactions.length === 0 ? (
            <p className="text-lg text-center text-gray-600">No transactions found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="max-w-sm bg-white border border-gray-200 rounded-lg shadow p-6"
                >
                  <h5 className="text-xl font-semibold text-gray-900">
                    Transaction ID: {transaction.txRef}
                  </h5>
                  <p className="mt-2 text-gray-700">
                    <span className="font-medium">Amount:</span> ${transaction.amount.toFixed(2)}
                  </p>
                  <p className="mt-2 text-gray-700">
                    <span className="font-medium">Status:</span> {transaction.status}
                  </p>
                  <p className="mt-2 text-gray-700">
                    <span className="font-medium">Date:</span> {new Date(transaction.createdAt).toLocaleDateString()}
                  </p>
                  <button 
                    className="mt-4 inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    onClick={() => downloadReceipt(transaction.txRef)}
                  >
                    Download Receipt
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyTransactions;
