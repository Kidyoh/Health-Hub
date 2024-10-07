import UserPermissions from "@/app/components/admin/user-management/updateUser";
import ViewAllUsers from "@/app/components/admin/user-management/viewUsers";
import React from "react";

const AdminUserPremissions = () => {
  return (
    <>
      <div className="rounded-xl dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words">
       <UserPermissions />
      </div>
    </>
  );
};

export default AdminUserPremissions;
