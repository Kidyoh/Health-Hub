import UserManagement from "@/app/components/admin/user-management/viewUsers";
import ViewAllUsers from "@/app/components/admin/user-management/viewUsers";
import React from "react";

const AdminUserManagement = () => {
  return (
    <>
      <div className="rounded-xl dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words">
       <UserManagement />
      </div>
    </>
  );
};

export default AdminUserManagement;
