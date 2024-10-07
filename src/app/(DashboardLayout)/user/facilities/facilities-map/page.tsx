import React, { Suspense } from 'react';
import FacilitiesPage from "@/app/components/user/facilities/facilities";

const FacilityRegister = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FacilitiesPage />
    </Suspense>
  );
};

export default FacilityRegister;