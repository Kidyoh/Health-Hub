import FacilityManagement from "@/app/components/admin/facilities/getAndManageFacilities";
import React from "react";

const AdminUpdateFacilities = () => {
  return (
    <>
      <div className="rounded-xl dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words">
       <FacilityManagement />
      </div>
    </>
  );
};

export default AdminUpdateFacilities;
