// components/dashboard/AdminDashboard.tsx
import React from "react";
import SalesProfit from "../dashboard/RevenueForecast";
import NewCustomers from "../dashboard/NewCustomers";
import TotalIncome from "../dashboard/TotalIncome";
import BlogCards from "../dashboard/BlogCards";
import FacilitiesPage from "../user/facilities/facilities";
import DailyActivity from "../activities/userActivities";

const AdminDashboard = () => {
  return (
    <div className="grid grid-cols-12 gap-30">
      <div className="lg:col-span-8 col-span-12">
        <SalesProfit />
      </div>
      <div className="lg:col-span-4 col-span-12">
        <div className="grid grid-cols-12 h-full items-stretch">
          <div className="col-span-12">
            <TotalIncome />
          </div>
          <div className="col-span-12 pt-8">
            <DailyActivity />
          </div>
        </div>

      </div>


    </div>
  );
};

export default AdminDashboard;