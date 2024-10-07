"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import Link from 'next/link'; // Import Link for navigation
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
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [ticketsPerPage] = useState<number>(5);

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

  const handlePageClick = (data: { selected: number }) => {
    setCurrentPage(data.selected);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto py-8">
      <Toaster />
      <h1 className="text-3xl font-bold mb-4">Support Tickets</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedTickets.map((ticket) => (
          <div key={ticket.id} className="bg-white shadow-md rounded-lg p-6 border">
            <h2 className="text-xl font-semibold mb-2">{ticket.title}</h2>
            <p className="text-gray-600 mb-4">{ticket.message.slice(0, 100)}...</p> {/* Show a preview */}
            <p className="text-gray-500 mb-4">
              Submitted by {ticket.user.firstName} {ticket.user.lastName} ({ticket.user.email})
            </p>
            <p className="text-sm text-gray-500 mb-4">Status: {ticket.status}</p>
            <Link href={`/admin/support/ticket/${ticket.id}`} legacyBehavior>
              <a className="text-blue-500 underline">Read More</a>
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <ReactPaginate
          previousLabel={"← Previous"}
          nextLabel={"Next →"}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName={"pagination flex justify-center"}
          previousLinkClassName={"pagination__link p-2"}
          nextLinkClassName={"pagination__link p-2"}
          disabledClassName={"pagination__link--disabled text-gray-400"}
          activeClassName={"pagination__link--active text-blue-500"}
        />
      </div>
    </div>
  );
};

export default AdminTickets;
