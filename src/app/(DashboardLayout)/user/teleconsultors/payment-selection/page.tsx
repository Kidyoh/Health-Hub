import SelectPaymentGateway from '@/app/components/user/paymentGateway/selectPaymentGateway';
import React from "react";

const PaymentSelectionPage = () => {
  return (
    <>
      <div className="rounded-xl dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words">
      <SelectPaymentGateway />
      </div>
    </>
  );
};

export default PaymentSelectionPage;