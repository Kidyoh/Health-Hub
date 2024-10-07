// /app/pages/teleconsultor/teleconsultations/upcoming.tsx
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

const UpcomingConsultations = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpcomingConsultations = async () => {
      try {
        const response = await axios.get("/api/teleconsultors/consultations/upcoming");
        setConsultations(response.data.consultations);
      } catch (error) {
        setError("Failed to fetch consultations.");
      } finally {
        setLoading(false);
      }
    };
    fetchUpcomingConsultations();
  }, []);

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
              <p>Time: {consultation.time}</p>
              <p>Status: {consultation.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UpcomingConsultations;
