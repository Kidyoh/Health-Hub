import RefundRequestList from "@/app/components/admin/refund-requests/refundLists";
const RefundRequests = () => {
  return (
    <>
      <div className="rounded-xl dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words">
       <RefundRequestList />
      </div>
    </>
  );
};

export default RefundRequests;
