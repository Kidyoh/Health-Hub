import UserReports from "@/app/components/admin/user/reports";
import React from "react";

const AdminUserReports = () => {
  return (
    <>
      <div className="rounded-xl dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words">
       <UserReports />
      </div>
    </>
  );
};

export default AdminUserReports;
