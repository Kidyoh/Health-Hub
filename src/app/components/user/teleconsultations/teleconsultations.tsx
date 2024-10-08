"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface Teleconsultation {
  id: number;
  doctor: string;
  date: string;
  status: string;
  sessionUrl?: string;
}

const TeleconsultationsList: React.FC = () => {
  const [teleconsultations, setTeleconsultations] = useState<Teleconsultation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [startingSession, setStartingSession] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTeleconsultations = async () => {
      try {
        const res = await fetch("/api/telemedicine/getConsultations");
        const data = await res.json();
        if (data.success) {
          setTeleconsultations(data.teleconsultations);
        } else {
          setError(data.error);
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch teleconsultations.");
        setLoading(false);
      }
    };

    fetchTeleconsultations();
  }, []);

  const handleTeleconsultationClick = async (consultation: Teleconsultation) => {
    if (consultation.status !== "Approved" && consultation.status !== "In Progress") {
      setError("Consultation is not approved yet.");
      return;
    }

    // Navigate to the ConsultationDashboard with consultation ID as a query parameter
    console.log(`Navigating to /user/consultations/${consultation.id}`); // Log the URL
    router.push(`/user/consultations/${consultation.id}`);
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
        <h5 className="text-2xl font-semibold text-gray-800 dark:text-white">Your Teleconsultations</h5>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your teleconsultation appointments below.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Display skeleton loaders while loading
          Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="p-6 bg-white dark:bg-gray-800 shadow-sm rounded-md">
                <Skeleton height={25} width={200} className="mb-2" /> {/* Doctor's name */}
                <Skeleton height={20} width={150} className="mb-3" /> {/* Date */}
                <Skeleton height={20} width={100} className="mb-4" /> {/* Status */}
                <Skeleton height={40} width={120} /> {/* Button */}
              </div>
            ))
        ) : teleconsultations.length > 0 ? (
          teleconsultations.map((consultation) => (
            <div
              key={consultation.id}
              className={`p-6 bg-white dark:bg-gray-800 shadow-sm rounded-md transition transform hover:scale-105 duration-200 hover:shadow-xl cursor-pointer ${
                startingSession === consultation.id ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => handleTeleconsultationClick(consultation)}
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                Teleconsultation with DR. <span className="text-primary">{consultation.doctor}</span>
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
                  disabled={startingSession === consultation.id}
                >
                  {consultation.status === "Approved" ? "Start Session" : "Continue Session"}
                </button>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">Waiting for approval</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center">No teleconsultations available.</p>
        )}
      </div>
    </div>
  );
};

export default TeleconsultationsList;