import ViewAllUsers from "@/app/components/admin/users/view-allusers";
import React from "react";

const AdminViewUsersPage = () => {
  return (
    <>
      <div className="rounded-xl dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words">
       <ViewAllUsers />
      </div>
    </>
  );
};

export default AdminViewUsersPage;
