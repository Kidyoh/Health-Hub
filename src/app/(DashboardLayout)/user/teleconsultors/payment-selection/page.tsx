// /pages/payment-selection.tsx
"use client";
import { Suspense } from 'react';
import SelectPaymentGateway from '@/app/components/user/paymentGateway/selectPaymentGateway';

const PaymentSelectionPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="rounded-xl dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words">
        <SelectPaymentGateway />
      </div>
    </Suspense>
  );
};

export default PaymentSelectionPage;