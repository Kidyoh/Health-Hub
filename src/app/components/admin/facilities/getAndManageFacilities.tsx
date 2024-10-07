"use client";

import { useState, useEffect } from "react";
import { Button, Modal } from "flowbite-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Facility {
  id: number;
  name: string;
  location: string;
  services: string;
  contact: string;
  type: string;
  appointmentPrice?: number;
}

const FacilityManagement = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch facilities on component mount
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const res = await axios.get("/api/admin/facilities");
        setFacilities(res.data.facilities); 
        setLoading(false);
      } catch (err) {
        setError("Failed to load facilities");
        setLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  // Open modal and set the current facility for editing
  const handleEditClick = (facility: Facility) => {
    setEditingFacility(facility);
    setModalOpen(true);
  };

  // Handle input changes for facility fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (editingFacility) {
      setEditingFacility({ ...editingFacility, [e.target.name]: e.target.value });
    }
  };

  // Save the updated facility information
  const handleSave = async () => {
    if (!editingFacility?.name || !editingFacility?.location || !editingFacility?.contact) {
      toast.error("Name, location, and contact are required.");
      return;
    }

    if (editingFacility) {
      try {
        await axios.put(`/api/admin/facilities/${editingFacility.id}`, editingFacility);
        toast.success("Facility updated successfully");
        setModalOpen(false);
        const res = await axios.get("/api/admin/facilities");
        setFacilities(res.data.facilities); // Refetch updated data
      } catch (error) {
        console.error("Error updating facility", error);
        toast.error("Failed to update facility");
      }
    }
  };

  // Conditional rendering based on loading or error state
  if (loading) return <p>Loading facilities...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-6">Facility Management</h1>
      <ToastContainer />
      <table className="table-auto w-full border-collapse border border-gray-300 shadow-lg">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Location</th>
            <th className="border border-gray-300 px-4 py-2">Services</th>
            <th className="border border-gray-300 px-4 py-2">Contact</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {facilities.map((facility) => (
            <tr key={facility.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{facility.name}</td>
              <td className="border border-gray-300 px-4 py-2">{facility.location}</td>
              <td className="border border-gray-300 px-4 py-2">{facility.services}</td>
              <td className="border border-gray-300 px-4 py-2">{facility.contact}</td>
              <td className="border border-gray-300 px-4 py-2">
                <Button
                  onClick={() => handleEditClick(facility)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                >
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Facility Modal */}
      {editingFacility && (
        <Modal show={modalOpen} onClose={() => setModalOpen(false)}>
          <Modal.Header>Edit Facility</Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  name="name"
                  value={editingFacility.name}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  name="location"
                  value={editingFacility.location}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Services</label>
                <input
                  name="services"
                  value={editingFacility.services}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact</label>
                <input
                  name="contact"
                  value={editingFacility.contact}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <input
                  name="type"
                  value={editingFacility.type}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Appointment Price</label>
                <input
                  name="appointmentPrice"
                  value={editingFacility.appointmentPrice || ""}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="number"
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
            >
              Save
            </Button>
            <Button
              color="gray"
              onClick={() => setModalOpen(false)}
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

export default FacilityManagement;
