import AddNewUser from "@/app/components/admin/user-management/addUsers";
import ViewAllUsers from "@/app/components/admin/user-management/viewUsers";
import React from "react";

const AdminAddNewUsers = () => {
  return (
    <>
      <div className="rounded-xl dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words">
       <AddNewUser />
      </div>
    </>
  );
};

export default AdminAddNewUsers;
