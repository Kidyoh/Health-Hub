import React from "react";
import TeleconsultationsList from "../user/teleconsultations/teleconsultations";
import DailyActivity from "../dashboard/DailyActivity";

const TeleconsultorDashboard = () => {
  return (
    <div className="grid grid-cols-12 gap-30">
      <div className="lg:col-span-8 col-span-12">
        <TeleconsultationsList />
      </div>
      <div className="lg:col-span-4 col-span-12">
        <DailyActivity />
      </div>
    </div>
  );
};

export default TeleconsultorDashboard;