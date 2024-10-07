"use client";

import React, { useState, useEffect } from "react";
import { Button, Modal } from "flowbite-react";
import axios from "axios";

interface ConsultationDashboardProps {
  consultationId: number;
  onClose: () => void; // Function to close the dashboard
}

const ConsultationDashboard: React.FC<ConsultationDashboardProps> = ({ consultationId, onClose }) => {
  const [sessionUrl, setSessionUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>(""); // For adding notes
  const [medicines, setMedicines] = useState<string>(""); // For adding medicines
  const [dosage, setDosage] = useState<string>(""); // For adding dosage

  useEffect(() => {
    const fetchSessionUrl = async () => {
      setLoading(true);
      try {
        const response = await axios.post(`/api/teleconsultors/consultations/${consultationId}/start-session`);
        setSessionUrl(response.data.roomUrl);
        setIsModalOpen(true); // Open modal with the session
      } catch (err) {
        console.error("Failed to start the session:", err);
        setError("Failed to start the session.");
      } finally {
        setLoading(false);
      }
    };

    fetchSessionUrl();
  }, [consultationId]);

  const endSession = async () => {
    try {
      await axios.post(`/api/teleconsultors/consultations/${consultationId}/end-session`, { 
        notes, 
        medicines, 
        dosage 
      });
      setIsModalOpen(false);
      alert("Session has ended successfully.");
      onClose(); // Close the modal
    } catch (err) {
      console.error("Failed to end the session:", err);
      setError("Failed to end the session.");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    onClose();
  };

  return (
    <div>
      {/* Main Teleconsultation Modal */}
      {isModalOpen && (
        <Modal show={isModalOpen} onClose={handleCloseModal} size="5xl">
          <Modal.Header>Teleconsultation</Modal.Header>
          <Modal.Body>
            {sessionUrl ? (
              <iframe
                src={sessionUrl}
                width="100%"
                height="600px"
                allow="camera; microphone; fullscreen; speaker; display-capture"
              />
            ) : (
              <p>Loading consultation session...</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <textarea
              className="w-full p-2 border rounded"
              placeholder="Enter notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <textarea
              className="w-full p-2 border rounded mt-4"
              placeholder="Enter medicines"
              value={medicines}
              onChange={(e) => setMedicines(e.target.value)}
            />
            <textarea
              className="w-full p-2 border rounded mt-4"
              placeholder="Enter dosage"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
            />
            <Button onClick={endSession} color="failure">
              End Session
            </Button>
            <Button onClick={handleCloseModal} color="gray">
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {loading && <p>Loading session...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default ConsultationDashboard;
