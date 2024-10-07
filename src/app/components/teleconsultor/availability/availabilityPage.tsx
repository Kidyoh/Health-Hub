"use client";

import { useState, useEffect } from "react";
import { Button, Modal, Select } from "flowbite-react";
import axios from "axios";

interface Availability {
  id?: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

const AvailabilityPage = () => {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editAvailability, setEditAvailability] = useState<Availability | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch availability slots on mount
  useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/teleconsultors/availability");
        setAvailabilities(response.data.availability);
      } catch (error) {
        setError("Failed to fetch availability slots.");
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/teleconsultors/availability/${id}`);
      setAvailabilities((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      setError("Failed to delete the availability slot.");
    }
  };

  const handleEdit = (availability: Availability) => {
    setEditAvailability(availability);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (editAvailability) {
      try {
        if (editAvailability.id) {
          // Update existing slot
          await axios.put(`/api/teleconsultors/availability`, editAvailability);
        } else {
          // Create new slot
          const response = await axios.post(`/api/teleconsultors/availability`, editAvailability);
          setAvailabilities((prev) => [...prev, response.data.availability]);
        }
        setModalOpen(false);
        setEditAvailability(null);
      } catch (error) {
        setError("Failed to save availability.");
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-6">Manage Your Availability</h1>

      {loading ? (
        <p>Loading availability slots...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6">
          <Button onClick={() => setModalOpen(true)} className="mb-4">
            Add Availability Slot
          </Button>
          {availabilities.length === 0 ? (
            <p>No availability slots found.</p>
          ) : (
            <ul>
              {availabilities.map((availability) => (
                <li key={availability.id} className="border p-4 mb-2 rounded flex justify-between items-center">
                  <div>
                    <p>
                      <strong>{availability.dayOfWeek}:</strong> {availability.startTime} - {availability.endTime}
                    </p>
                  </div>
                  <div>
                    <Button color="light" onClick={() => handleEdit(availability)} className="mr-2">
                      Edit
                    </Button>
                    <Button color="failure" onClick={() => handleDelete(availability.id!)}>
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Modal for Adding/Editing Availability */}
      <Modal show={modalOpen} onClose={() => setModalOpen(false)}>
        <Modal.Header>{editAvailability?.id ? "Edit Availability" : "Add Availability"}</Modal.Header>
        <Modal.Body>
          <Select
            value={editAvailability?.dayOfWeek || ""}
            onChange={(e) => setEditAvailability({ ...editAvailability!, dayOfWeek: e.target.value })}
          >
            <option value="">Select Day</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </Select>
          <input
            type="time"
            value={editAvailability?.startTime || ""}
            onChange={(e) => setEditAvailability({ ...editAvailability!, startTime: e.target.value })}
            className="mt-4 w-full border p-2 rounded-md"
            placeholder="Start Time"
          />
          <input
            type="time"
            value={editAvailability?.endTime || ""}
            onChange={(e) => setEditAvailability({ ...editAvailability!, endTime: e.target.value })}
            className="mt-4 w-full border p-2 rounded-md"
            placeholder="End Time"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSave} className="bg-blue-500 text-white">
            Save
          </Button>
          <Button color="gray" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AvailabilityPage;
