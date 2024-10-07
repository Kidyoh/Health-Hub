// components/dashboard/AdminDashboard.tsx
import React from "react";
import SalesProfit from "../dashboard/RevenueForecast";
import NewCustomers from "../dashboard/NewCustomers";
import TotalIncome from "../dashboard/TotalIncome";
import ProductRevenue from "../dashboard/ProductRevenue";
import DailyActivity from "../dashboard/DailyActivity";
import BlogCards from "../dashboard/BlogCards";
import TeleconsultationsList from "../user/teleconsultations/teleconsultations";

const AdminDashboard = () => {
  return (
    <div className="grid grid-cols-12 gap-30">
      <div className="lg:col-span-8 col-span-12">
        <SalesProfit />
      </div>
      <div className="lg:col-span-4 col-span-12">
        <div className="grid grid-cols-12 h-full items-stretch">
          <div className="col-span-12 mb-30">
            <NewCustomers />
          </div>
          <div className="col-span-12">
            <TotalIncome />
          </div>
        </div>
      </div>
      <div className="lg:col-span-8 col-span-12">
        <ProductRevenue />
      </div>
      <div className="lg:col-span-8 col-span-12">
        <TeleconsultationsList />
      </div>
      <div className="lg:col-span-4 col-span-12">
        <DailyActivity />
      </div>
      <div className="col-span-12">
        <BlogCards />
      </div>
    </div>
  );
};

export default AdminDashboard;