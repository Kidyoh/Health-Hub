"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

interface Ticket {
  id: number;
  title: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

const TicketDetails = () => {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [adminMessage, setAdminMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const params = useParams();
  const id = params?.id as string; // Get the ticket ID from the URL

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await axios.get(`/api/admin/tickets/${id}`);
        setTicket(res.data.ticket);
      } catch (error) {
        toast.error('Failed to fetch ticket');
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  const updateStatus = async (newStatus: string) => {
    try {
      await axios.patch(`/api/admin/tickets`, {
        id: ticket?.id,
        status: newStatus,
        message: adminMessage,
      });
      setTicket((prev) => (prev ? { ...prev, status: newStatus } : prev));
      toast.success(`Ticket marked as ${newStatus}`);
    } catch (error) {
      toast.error('Error updating ticket status');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!ticket) return <p>No ticket found</p>;

  return (
    <div className="container mx-auto py-8">
      <Toaster />
      <h1 className="text-3xl font-bold mb-4">{ticket.title}</h1>
      <p>{ticket.message}</p>
      <p className="text-sm text-gray-500">Status: {ticket.status}</p>
      <p className="text-sm text-gray-500">Submitted by {ticket.user.firstName} {ticket.user.lastName} ({ticket.user.email})</p>
      <textarea
        value={adminMessage}
        onChange={(e) => setAdminMessage(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mt-4"
        placeholder="Write a custom message to the user"
      />
      <div className="mt-4">
        <button
          onClick={() => updateStatus('Resolved')}
          className="bg-green-500 text-white py-2 px-4 mr-2 rounded"
          disabled={ticket.status === 'Resolved'}
        >
          {ticket.status === 'Resolved' ? 'Resolved' : 'Mark as Resolved'}
        </button>
        <button
          onClick={() => updateStatus('Closed')}
          className="bg-red-500 text-white py-2 px-4 rounded"
          disabled={ticket.status === 'Closed'}
        >
          {ticket.status === 'Closed' ? 'Closed' : 'Close Ticket'}
        </button>
      </div>
    </div>
  );
};

export default TicketDetails;
