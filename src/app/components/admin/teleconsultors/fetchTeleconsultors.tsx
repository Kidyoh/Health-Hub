"use client";

import { useState, useEffect } from "react";
import { Button, Modal } from "flowbite-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Availability {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

interface Teleconsultor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  specialties: string;
  rate: number;
  rating: number;
  workingHours: string;
  status: string;
  availability: Availability[];
}

const TeleconsultorManagement = () => {
  const [teleconsultors, setTeleconsultors] = useState<Teleconsultor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTeleconsultor, setEditingTeleconsultor] = useState<Teleconsultor | null>(null);
  const [availabilityModalOpen, setAvailabilityModalOpen] = useState(false);
  const [editAvailabilityModalOpen, setEditAvailabilityModalOpen] = useState(false);

  // Fetch teleconsultors on component mount
  useEffect(() => {
    const fetchTeleconsultors = async () => {
      try {
        const res = await axios.get("/api/admin/teleconsultors");
        setTeleconsultors(res.data.teleconsultors);
        setLoading(false);
      } catch (err) {
        setError("Failed to load teleconsultors");
        setLoading(false);
      }
    };

    fetchTeleconsultors();
  }, []);

  // Open modal and set the current teleconsultor for editing
  const handleEditClick = (teleconsultor: Teleconsultor) => {
    setEditingTeleconsultor(teleconsultor);
    setAvailabilityModalOpen(true);
  };

  // Open modal for editing availability
  const handleEditAvailabilityClick = () => {
    setEditAvailabilityModalOpen(true);
  };

  // Handle input changes for teleconsultor fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (editingTeleconsultor) {
      setEditingTeleconsultor({ ...editingTeleconsultor, [e.target.name]: e.target.value });
    }
  };

  // Handle changes for availability
  const handleAvailabilityChange = (index: number, field: string, value: string) => {
    if (editingTeleconsultor) {
      const updatedAvailability = editingTeleconsultor.availability.map((avail, i) =>
        i === index ? { ...avail, [field]: value } : avail
      );
      setEditingTeleconsultor({ ...editingTeleconsultor, availability: updatedAvailability });
    }
  };

  // Save the updated teleconsultor information
  const handleSave = async () => {
    if (!editingTeleconsultor?.firstName || !editingTeleconsultor?.specialties || !editingTeleconsultor?.rate) {
      toast.error("Name, specialties, and rate are required.");
      return;
    }

    if (editingTeleconsultor) {
      try {
        await axios.put(`/api/admin/teleconsultors/${editingTeleconsultor.id}`, editingTeleconsultor);
        toast.success("Teleconsultor updated successfully");
        setAvailabilityModalOpen(false);
        setEditAvailabilityModalOpen(false);
        const res = await axios.get("/api/admin/teleconsultors");
        setTeleconsultors(res.data.teleconsultors); // Refetch updated data
      } catch (error) {
        console.error("Error updating teleconsultor", error);
        toast.error("Failed to update teleconsultor");
      }
    }
  };

  // Conditional rendering based on loading or error state
  if (loading) return <p>Loading teleconsultors...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-6">Teleconsultor Management</h1>
      <ToastContainer />
      <table className="table-auto w-full border-collapse border border-gray-300 shadow-lg">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Specialties</th>
            <th className="border border-gray-300 px-4 py-2">Rate</th>
            <th className="border border-gray-300 px-4 py-2">Rating</th>
            <th className="border border-gray-300 px-4 py-2">Working Hours</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {teleconsultors.map((teleconsultor) => (
            <tr key={teleconsultor.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">
                {teleconsultor.firstName} {teleconsultor.lastName}
              </td>
              <td className="border border-gray-300 px-4 py-2">{teleconsultor.email}</td>
              <td className="border border-gray-300 px-4 py-2">{teleconsultor.specialties}</td>
              <td className="border border-gray-300 px-4 py-2">${teleconsultor.rate}</td>
              <td className="border border-gray-300 px-4 py-2">{teleconsultor.rating}</td>
              <td className="border border-gray-300 px-4 py-2">{teleconsultor.workingHours}</td>
              <td className="border border-gray-300 px-4 py-2">
                <Button
                  onClick={() => handleEditClick(teleconsultor)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                >
                  View & Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* View Availability Modal */}
      {editingTeleconsultor && (
        <Modal show={availabilityModalOpen} onClose={() => setAvailabilityModalOpen(false)}>
          <Modal.Header>Availability Schedule</Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              {editingTeleconsultor?.availability && editingTeleconsultor.availability.length > 0 ? (
                editingTeleconsultor.availability.map((avail, index) => (
                  <div key={index}>
                    <strong>{avail.dayOfWeek}:</strong> {avail.startTime} - {avail.endTime}
                  </div>
                ))
              ) : (
                <p>No availability set</p>
              )}
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button
              onClick={handleEditAvailabilityClick}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
            >
              Edit Availability
            </Button>
            <Button
              color="gray"
              onClick={() => setAvailabilityModalOpen(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Edit Availability Modal */}
      {editingTeleconsultor && (
        <Modal show={editAvailabilityModalOpen} onClose={() => setEditAvailabilityModalOpen(false)}>
          <Modal.Header>Edit Availability</Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              {editingTeleconsultor.availability.map((avail, index) => (
                <div key={index} className="flex space-x-4">
                  <input
                    name="dayOfWeek"
                    value={avail.dayOfWeek}
                    onChange={(e) => handleAvailabilityChange(index, "dayOfWeek", e.target.value)}
                    className="w-1/3 border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    name="startTime"
                    value={avail.startTime}
                    onChange={(e) => handleAvailabilityChange(index, "startTime", e.target.value)}
                    className="w-1/3 border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    name="endTime"
                    value={avail.endTime}
                    onChange={(e) => handleAvailabilityChange(index, "endTime", e.target.value)}
                    className="w-1/3 border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
            >
              Save Changes
            </Button>
            <Button
              color="gray"
              onClick={() => setEditAvailabilityModalOpen(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default TeleconsultorManagement;
