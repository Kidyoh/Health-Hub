import React from "react";
import BlogCards from "../dashboard/BlogCards";
import TeleconsultationsList from "../user/teleconsultations/teleconsultations";
import FacilitiesPage from "../user/facilities/facilities";
import DailyActivity from "../activities/userActivities";

const UserDashboard = () => {
  return (
    <div className="grid grid-cols-12 gap-30">
      <div className="col-span-12">
        {/* <SalesProfit /> */}
        <FacilitiesPage />
      </div>
      <div className="lg:col-span-4 col-span-12">
        <div className="grid grid-cols-12 h-full items-stretch">
          {/* <div className="col-span-12 mb-30">
            <NewCustomers />
          </div>
          <div className="col-span-12">
            <TotalIncome />
          </div> */}
        </div>
      </div>
      {/* <div className="lg:col-span-8 col-span-12">
        <ProductRevenue />
      </div> */}
       <div className="lg:col-span-8 col-span-12">
        
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

export default UserDashboard;