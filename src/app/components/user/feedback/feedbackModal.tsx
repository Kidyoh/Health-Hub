"use client";

import React, { useState } from "react";
import { Button, Modal } from "flowbite-react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai"; // Importing star icons
import { useRouter } from "next/navigation"; // Import useRouter to navigate
import { ToastContainer, toast } from "react-toastify"; // Import toast functions
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultationId: number;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, consultationId }) => {
  const [feedback, setFeedback] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Initialize useRouter hook

  const submitFeedback = async () => {
    const feedbackData = { rating, feedback };
    console.log("Submitting feedback:", feedbackData); // Log the feedback data

    try {
      const response = await fetch(`/api/telemedicine/${consultationId}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      });

      const responseData = await response.json();
      console.log("Response from server:", responseData); // Log the response data

      if (response.ok) {
        toast.success("Thank you for your feedback. Redirecting to the homepage...", {
          autoClose: 3000, // Show toast for 3 seconds
        });
        setTimeout(() => {
          onClose(); // Close the modal
          router.push("/"); // Navigate to the homepage after 3 seconds
        }, 3000);
      } else {
        setError(responseData.error || "Failed to submit feedback.");
      }
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setError("Failed to submit feedback.");
      toast.error("Failed to submit feedback.");
    }
  };

  // Function to render the star rating system
  const renderStars = () => {
    return (
      <div className="flex space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className={`text-3xl ${star <= rating ? "text-yellow-500" : "text-gray-400"}`}
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          >
            {star <= rating ? <AiFillStar /> : <AiOutlineStar />}
          </button>
        ))}
      </div>
    );
  };

  return (
    <>
      <ToastContainer /> {/* Toast container for displaying notifications */}
      <Modal show={isOpen} onClose={onClose} size="lg">
        <Modal.Header>Share Your Feedback</Modal.Header>
        <Modal.Body>
          <p className="text-gray-600 mb-4">Please rate your consultation experience:</p>

          {/* Star Rating System */}
          {renderStars()}

          {/* Feedback Input */}
          <textarea
            className="w-full p-3 mt-4 border rounded-md focus:ring-2 focus:ring-blue-400"
            placeholder="Write your feedback here..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={submitFeedback} color="success" disabled={rating === 0 || feedback === ""}>
            Submit Feedback
          </Button>
          <Button onClick={onClose} color="gray">
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FeedbackModal;
