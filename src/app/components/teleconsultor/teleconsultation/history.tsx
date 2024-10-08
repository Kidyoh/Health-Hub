// /app/pages/teleconsultor/teleconsultations/history.tsx
"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface Consultation {
  id: number;
  patientName: string;
  date: string;
  time: string;
  status: string;
}

const ConsultationHistory = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConsultationHistory = async () => {
      try {
        const response = await axios.get("/api/teleconsultors/consultations/history");
        setConsultations(response.data.consultations);
      } catch (error) {
        setError("Failed to fetch consultation history.");
      } finally {
        setLoading(false);
      }
    };
    fetchConsultationHistory();
  }, []);

  if (loading) return <p className="text-center text-gray-600 mt-6">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-6">{error}</p>;

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-center mb-10 text-blue-700">Consultation History</h1>
      {consultations.length === 0 ? (
        <p className="text-center text-gray-500">No past consultations found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {consultations.map((consultation) => (
            <div key={consultation.id} className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">{consultation.patientName}</h2>
              <p className="text-gray-500 mb-1">Date: <span className="text-gray-700">{consultation.date}</span></p>
              <p className="text-gray-500 mb-1">Time: <span className="text-gray-700">{consultation.time}</span></p>
              <p className={`text-sm font-medium ${consultation.status === "Completed"
                ? "text-green-600"
                : consultation.status === "Pending"
                  ? "text-yellow-500"
                  : "text-red-500"
                }`}>
                Status: {consultation.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConsultationHistory;
