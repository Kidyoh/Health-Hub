import React, { Suspense } from 'react';
import DashboardPage from "../components/dashboard/DashboardPage";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardPage />
    </Suspense>
  );
};

export default Page;