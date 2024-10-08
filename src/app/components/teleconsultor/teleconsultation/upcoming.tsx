"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import ConsultationDashboard from "@/app/components/teleconsultor/teleconsultation/consultationDashboard"; // Import the dashboard component
import { Button, Modal, Spinner } from "flowbite-react"; // Modal to display the dashboard
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  return (
    <div className="rounded-xl dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray pt-6 px-4 lg:px-6 relative w-full break-words pb-6">
      <div className="px-6 mb-6">
        <h5 className="text-2xl font-semibold text-gray-800 dark:text-white">Upcoming Consultations</h5>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your upcoming consultations below.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Display skeleton loaders while loading
          Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="p-6 bg-white dark:bg-gray-800 shadow-sm rounded-md">
                <Skeleton height={25} width={200} className="mb-2" /> {/* Patient name */}
                <Skeleton height={20} width={150} className="mb-3" /> {/* Date */}
                <Skeleton height={20} width={100} className="mb-4" /> {/* Status */}
                <Skeleton height={40} width={120} /> {/* Button */}
              </div>
            ))
        ) : consultations.length > 0 ? (
          consultations.map((consultation) => (
            <div
              key={consultation.id}
              className={`p-6 bg-white dark:bg-gray-800 shadow-sm rounded-md transition transform hover:scale-105 duration-200 hover:shadow-xl cursor-pointer`}
              onClick={() => openDashboard(consultation.id)}
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                Consultation with{" "}
                <span className="text-primary">{consultation.patientName}</span>
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                {formatDate(consultation.date)}
              </p>
              <p
                className={`font-semibold mb-4 ${
                  consultation.status === "Pending"
                    ? "text-yellow-500"
                    : consultation.status === "Approved"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                Status: {consultation.status}
              </p>
              {consultation.status === "Approved" || consultation.status === "In Progress" ? (
                <button
                  className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-medium shadow-lg transition duration-150"
                >
                  {consultation.status === "Approved" ? "Start Session" : "Continue Session"}
                </button>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">Waiting for approval</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center">No upcoming consultations available.</p>
        )}
      </div>

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
