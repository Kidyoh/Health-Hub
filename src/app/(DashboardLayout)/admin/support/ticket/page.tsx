import AdminTickets from "@/app/components/admin/supportTicket/updateTicket";
import React from "react";

const SupportTicket = () => {
  return (
    <>
      <div className="rounded-xl dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words">
       <AdminTickets />
      </div>
    </>
  );
};

export default SupportTicket;
