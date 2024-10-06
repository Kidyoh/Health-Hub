"use client"
import React, { useEffect, useState } from 'react';

interface Prescription {
  id: number;
  doctor: string;
  medicines: string;
  dosage: string;
  createdAt: string;
  updatedAt: string;
}

const PrescriptionsList: React.FC<{ userId: number }> = ({ userId }) => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await fetch(`/api/prescriptions?userId=${userId}`);
        const data = await response.json();

        if (response.ok) {
          setPrescriptions(data);
        } else {
          console.error('Failed to fetch prescriptions:', data.error);
        }
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [userId]);

  if (loading) {
    return <div>Loading prescriptions...</div>;
  }

  if (prescriptions.length === 0) {
    return <div>No prescriptions available</div>;
  }

  return (
    <div className="prescriptions-list">
      <h2 className="text-2xl font-bold mb-4">My Prescriptions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {prescriptions.map((prescription) => (
          <div
            key={prescription.id}
            className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white"
          >
            <h3 className="text-lg font-bold">Prescription #{prescription.id}</h3>
            <p><strong>Doctor:</strong> {prescription.doctor}</p>
            <p><strong>Medicines:</strong> {prescription.medicines}</p>
            <p><strong>Dosage:</strong> {prescription.dosage}</p>
            <p>
              <strong>Created At:</strong>{' '}
              {new Date(prescription.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Updated At:</strong>{' '}
              {new Date(prescription.updatedAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrescriptionsList;
