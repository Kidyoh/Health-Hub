"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RefundRequestList = () => {
  interface RefundRequest {
    id: number;
    user: {
      firstName: string;
      lastName: string;
    };
    transactionId: string;
    status: string;
  }

  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
  const [status, setStatus] = useState('');
  const [adminResponse, setAdminResponse] = useState('');
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRefundRequests = async () => {
      try {
        const response = await axios.get('/api/refund-requests');
        setRefundRequests(response.data.refundRequests);
      } catch (error) {
        toast.error('Error fetching refund requests.');
      }
    };

    fetchRefundRequests();
  }, []);

  const handleUpdate = async () => {
    if (!selectedRequestId || !status) {
      toast.error('Please select a status.');
      return;
    }
  
    try {
      await axios.patch(`/api/refund-requests/${selectedRequestId}`, {
        status,
        adminResponse,
      });
      toast.success(`Refund request ${status.toLowerCase()} successfully.`);
      setRefundRequests((prev) =>
        prev.map((request) =>
          request.id === selectedRequestId ? { ...request, status } : request
        )
      );
      setSelectedRequestId(null);
      setStatus('');
      setAdminResponse('');
    } catch (error) {
      toast.error('Error updating refund request.');
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Refund Requests</h1>
      <ul className="divide-y divide-gray-200">
        {refundRequests.map((request) => (
          <li key={request.id} className="py-4 flex justify-between items-center">
            <div>
              <p className="text-lg font-medium text-gray-900">
                {request.user.firstName} {request.user.lastName}
              </p>
              <p className="text-sm text-gray-600">
                Transaction #{request.transactionId} - Status:{" "}
                <span className="font-semibold">{request.status}</span>
              </p>
            </div>
            <button
              onClick={() => setSelectedRequestId(request.id)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md transition duration-200 ease-in-out hover:bg-blue-700"
            >
              Update Status
            </button>
          </li>
        ))}
      </ul>

      {selectedRequestId && (
        <div className="mt-6 p-6 bg-gray-50 rounded-lg shadow-inner">
          <h2 className="text-2xl font-semibold mb-4">Update Refund Request Status</h2>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="status">
              Select Status:
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Status</option>
              <option value="APPROVED">Approve</option>
              <option value="REJECTED">Reject</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="adminResponse">
              Admin Response (optional):
            </label>
            <textarea
              id="adminResponse"
              placeholder="Provide a reason for approval or rejection..."
              value={adminResponse}
              onChange={(e) => setAdminResponse(e.target.value)}
              className="w-full px-4 py-2 h-24 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleUpdate}
            disabled={loading}
            className={`w-full bg-green-600 text-white py-2 rounded-md transition duration-200 ease-in-out ${
              loading ? 'cursor-not-allowed opacity-50' : 'hover:bg-green-700'
            }`}
          >
            {loading ? 'Processing...' : 'Submit Update'}
          </button>
        </div>
      )}
    </div>
  );
};

export default RefundRequestList;
