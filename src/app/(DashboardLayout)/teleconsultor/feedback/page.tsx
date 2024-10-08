import FeedbackList from "@/app/components/teleconsultor/teleconsultation/getFeedback";
import React from "react";

const TeleconsultationFeedback = () => {
      return (
            <>
                  <div className="rounded-xl dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words">
                        <FeedbackList />
                  </div>
            </>
      );
};

export default TeleconsultationFeedback;
