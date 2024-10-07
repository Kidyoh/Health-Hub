import FinancialReports from "@/app/components/admin/financial/reports";
import React from "react";

const AdminFinacialReports = () => {
  return (
    <>
      <div className="rounded-xl dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words">
       <FinancialReports />
      </div>
    </>
  );
};

export default AdminFinacialReports;
