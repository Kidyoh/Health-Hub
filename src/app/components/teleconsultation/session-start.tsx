"use client";

import React, { useState, useEffect } from "react";
import { Button, Modal } from "flowbite-react";
import axios from "axios";

interface ConsultationDashboardProps {
  consultationId: number;
  onClose: () => void; // Function to call when dashboard is closed
}

const ConsultationDashboard: React.FC<ConsultationDashboardProps> = ({ consultationId, onClose }) => {
  const [sessionUrl, setSessionUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>(""); // For TELECONSULTER to add notes
  const [prescription, setPrescription] = useState<string>(""); // For TELECONSULTER to add prescriptions
  const [role, setRole] = useState<string | null>(null); // Role to distinguish between TELECONSULTER and USER

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch("/api/user");
        const data = await response.json();
        if (data.success) {
          setRole(data.user.role);
        }
      } catch (error) {
        console.error("Failed to fetch user role:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    const fetchSessionUrl = async () => {
      setLoading(true);
      try {
        const response = await axios.post(`/api/telemedicine/${consultationId}/start-session`);
        setSessionUrl(response.data.roomUrl);
        setIsModalOpen(true); // Open modal with iframe
      } catch (err) {
        setError("Failed to start the session. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSessionUrl();
  }, [consultationId]);

  const endSession = async () => {
    try {
      await axios.post(`/api/telemedicine/${consultationId}/end-session`, { notes, prescription });
      setIsModalOpen(false);
      alert("Session has ended successfully.");
      onClose(); // Trigger the close callback to show feedback
    } catch (err) {
      console.error("Failed to end the session:", err);
      setError("Failed to end the session.");
    }
  };

  const handleCloseModal = () => {
    // Just close the modal, and also call the onClose callback
    setIsModalOpen(false);
    onClose(); // Trigger the close callback
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
            {role === "TELECONSULTER" && (
              <>
                <textarea
                  className="w-full p-2 border rounded"
                  placeholder="Enter notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <textarea
                  className="w-full p-2 border rounded mt-4"
                  placeholder="Enter prescription"
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                />
                <Button onClick={endSession} color="failure">
                  End Session
                </Button>
              </>
            )}
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
