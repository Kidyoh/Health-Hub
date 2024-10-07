"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import ConsultationDashboard from "@/app/components/teleconsultor/teleconsultation/consultationDashboard"; // Import the dashboard component
import { Button, Modal } from "flowbite-react"; // Modal to display the dashboard

interface Consultation {
  id: number;
  patientName: string;
  date: string;
  status: string;
}

const UpcomingConsultations = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedConsultationId, setSelectedConsultationId] = useState<number | null>(null);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false); // Modal state

  useEffect(() => {
    const fetchUpcomingConsultations = async () => {
      try {
        const response = await axios.get("/api/teleconsultors/consultations/upcoming");

        // Log the response data for debugging
        console.log("API Response:", response.data);

        // Set consultations state
        setConsultations(response.data.consultations);
      } catch (error) {
        console.error("Error fetching consultations:", error); // Log any errors
        setError("Failed to fetch consultations.");
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingConsultations();
  }, []);

  const openDashboard = (consultationId: number) => {
    setSelectedConsultationId(consultationId);
    setIsDashboardOpen(true); // Open the dashboard modal
  };

  const closeDashboard = () => {
    setIsDashboardOpen(false);
    setSelectedConsultationId(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Upcoming Consultations</h1>
      {consultations.length === 0 ? (
        <p>No upcoming consultations.</p>
      ) : (
        <ul>
          {consultations.map((consultation) => (
            <li key={consultation.id} className="border p-4 mb-4 rounded">
              <p>Patient: {consultation.patientName}</p>
              <p>Date: {consultation.date}</p>
              <p>Status: {consultation.status}</p>
              {/* Button to open the dashboard */}
              <Button onClick={() => openDashboard(consultation.id)} color="primary">
                Open Consultation Dashboard
              </Button>
            </li>
          ))}
        </ul>
      )}

      {/* Modal to show the consultation dashboard */}
      {isDashboardOpen && selectedConsultationId && (
        <Modal show={isDashboardOpen} onClose={closeDashboard} size="5xl">
          <Modal.Header>Consultation Dashboard</Modal.Header>
          <Modal.Body>
            {/* Show ConsultationDashboard with the selected consultation ID */}
            <ConsultationDashboard consultationId={selectedConsultationId} onClose={closeDashboard} />
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default UpcomingConsultations;
