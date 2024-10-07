import FacilityManagement from "@/app/components/admin/facilities/getAndManageFacilities";
import TeleconsultorManagement from "@/app/components/admin/teleconsultors/fetchTeleconsultors";
import React from "react";

const AdminTeleconsultors = () => {
  return (
    <>
      <div className="rounded-xl dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words">
       <TeleconsultorManagement />
      </div>
    </>
  );
};

export default AdminTeleconsultors;
