"use client";
import { useParams } from 'next/navigation';
import ConsultationDashboard from "@/app/components/teleconsultation/session-start";
import FeedbackForm from "@/app/components/feedback/feedbackModal"; 
import React, { useState } from 'react';

const ConsultationPage: React.FC = () => {
  const params = useParams();
  const consultationId = params?.consultationId;
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false); // Controls visibility of the feedback form

  console.log("ConsultationPage consultationId:", consultationId); // Log the consultationId

  if (!consultationId) {
    return <p>Loading...</p>;
  }

  const handleCloseDashboard = () => {
    // Trigger the feedback form to be visible after the dashboard is closed
    setIsFeedbackVisible(true);
  };

  return (
    <div>
      {/* Consultation Dashboard */}
      <ConsultationDashboard consultationId={Number(consultationId)} onClose={handleCloseDashboard} />

      {/* Feedback Form */}
      {/* {isFeedbackVisible && (
        <div className="mt-6">
          <FeedbackForm 
            consultationId={Number(consultationId)} 
            isOpen={isFeedbackVisible} 
            onClose={() => setIsFeedbackVisible(false)} 
          />
        </div>
      )} */}
    </div>
  );
};

export default ConsultationPage;
