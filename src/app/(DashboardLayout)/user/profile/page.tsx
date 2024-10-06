import ProfilePage from "@/app/components/profile/getProfile";
import React from "react";

const samplepage = () => {
  return (
    <>
      <div className="rounded-xl dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words">
       <ProfilePage />
      </div>
    </>
  );
};

export default samplepage;
