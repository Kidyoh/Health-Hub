"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
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

const AdminTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [adminMessage, setAdminMessage] = useState<string>(''); // For sending custom messages
  const [currentPage, setCurrentPage] = useState<number>(0); // Track current page
  const [ticketsPerPage] = useState<number>(5); // Limit number of tickets per page

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get('/api/admin/tickets');
        setTickets(res.data.tickets);
      } catch (error) {
        setError('Failed to fetch tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Pagination logic
  const pageCount = Math.ceil(tickets.length / ticketsPerPage);
  const displayedTickets = tickets.slice(
    currentPage * ticketsPerPage,
    (currentPage + 1) * ticketsPerPage
  );

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      await axios.patch('/api/admin/tickets', {
        id,
        status: newStatus,
        message: adminMessage,
      });
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.id === id ? { ...ticket, status: newStatus } : ticket
        )
      );
      toast.success(`Ticket marked as ${newStatus}`);
    } catch (error) {
      toast.error('Error updating ticket status');
      console.error('Error updating ticket status', error);
    }
  };

  const handlePageClick = (data: { selected: number }) => {
    setCurrentPage(data.selected);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto py-8">
      <Toaster />
      <h1 className="text-3xl font-bold mb-4">Support Tickets</h1>
      <ul>
        {displayedTickets.map((ticket) => (
          <li key={ticket.id} className="border p-4 mb-4">
            <p>
              <strong>{ticket.title}</strong> - {ticket.status}
            </p>
            <p>{ticket.message}</p>
            <p>
              Submitted by {ticket.user.firstName} {ticket.user.lastName} (
              {ticket.user.email})
            </p>
            <div className="mt-4">
              <label className="block mb-2 text-gray-700">
                Admin Message (optional):
              </label>
              <textarea
                value={adminMessage}
                onChange={(e) => setAdminMessage(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Write a custom message to the user"
              />
              <button
                onClick={() => updateStatus(ticket.id, 'Resolved')}
                className="bg-green-500 text-white py-2 px-4 mr-2 mt-2 rounded"
                disabled={ticket.status === 'Resolved'} // Disable if already resolved
              >
                {ticket.status === 'Resolved' ? 'Resolved' : 'Mark as Resolved'}
              </button>
              <button
                onClick={() => updateStatus(ticket.id, 'Closed')}
                className="bg-red-500 text-white py-2 px-4 mt-2 rounded"
                disabled={ticket.status === 'Closed'} // Disable if already closed
              >
                {ticket.status === 'Closed' ? 'Closed' : 'Close Ticket'}
              </button>
            </div>
          </li>
        ))}
      </ul>

      <ReactPaginate
        previousLabel={"← Previous"}
        nextLabel={"Next →"}
        pageCount={pageCount}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        previousLinkClassName={"pagination__link"}
        nextLinkClassName={"pagination__link"}
        disabledClassName={"pagination__link--disabled"}
        activeClassName={"pagination__link--active"}
      />
    </div>
  );
};

export default AdminTickets;
