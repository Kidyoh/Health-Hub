import React from 'react';
import PrescriptionsList from '@/app/components/prescriptions/prescriptionsList';

const PrescriptionsPage: React.FC = () => {
  // Assuming we get the userId from session or auth context
  const userId = 1;

  return (
    <div className="container mx-auto p-6">
      <PrescriptionsList userId={userId} />
    </div>
  );
};

export default PrescriptionsPage;
