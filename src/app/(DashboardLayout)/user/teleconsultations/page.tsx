import TeleconsultationsList from "@/app/components/user/teleconsultations/teleconsultations";
import TeleconsultorsList from "@/app/components/user/teleconsultors/teleConsultors";
import React from "react";

const samplepage = () => {
  return (
    <>
    <div className="rounded-xl dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words pb-5 mb-5">
      
      <TeleconsultorsList/>
     </div>

      <div className="rounded-xl dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words">
       <TeleconsultationsList/>
      </div>
    </>
  );
};

export default samplepage;
