import PaymentHistory from "@/app/components/teleconsultor/transactions/getTransactions";
import React from "react";

const PaymentHistorys = () => {
  return (
    <>
      <div className="rounded-xl dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words">
       <PaymentHistory />
      </div>
    </>
  );
};

export default PaymentHistorys;
