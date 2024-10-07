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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Consultation History</h1>
      {consultations.length === 0 ? (
        <p>No past consultations found.</p>
      ) : (
        <ul>
          {consultations.map((consultation) => (
            <li key={consultation.id} className="border p-4 mb-4 rounded">
              <p>Patient: {consultation.patientName}</p>
              <p>Date: {consultation.date}</p>
              <p>Time: {consultation.time}</p>
              <p>Status: {consultation.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ConsultationHistory;
