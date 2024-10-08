"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

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
    <div>
      <h1>Refund Requests</h1>
      <ul>
        {refundRequests.map((request) => (
          <li key={request.id}>
            {request.user.firstName} {request.user.lastName} requested a refund for transaction #
            {request.transactionId} - Status: {request.status}
            <button onClick={() => setSelectedRequestId(request.id)}>Update Status</button>
          </li>
        ))}
      </ul>

      {selectedRequestId && (
        <div>
          <h2>Update Refund Request Status</h2>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Select Status</option>
            <option value="APPROVED">Approve</option>
            <option value="REJECTED">Reject</option>
          </select>
          <textarea
            placeholder="Admin response (optional)"
            value={adminResponse}
            onChange={(e) => setAdminResponse(e.target.value)}
          />
          <button onClick={handleUpdate}>Submit</button>
        </div>
      )}
    </div>
  );
};

export default RefundRequestList;
