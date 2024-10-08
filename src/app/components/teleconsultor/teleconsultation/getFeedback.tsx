"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface Feedback {
      id: number;
      patientName: string;
      doctor: string;
      feedback: string;
      rating: number;
      status: string;
      date: string;
}

const FeedbackList = () => {
      const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);

      useEffect(() => {
            const fetchFeedback = async () => {
                  try {
                        const response = await axios.get("/api/teleconsultors/feedback");
                        setFeedbacks(response.data.feedbacks);
                  } catch (error) {
                        setError("Failed to fetch feedback.");
                  } finally {
                        setLoading(false);
                  }
            };
            fetchFeedback();
      }, []);

      if (loading) return <p className="text-center text-gray-600 mt-6">Loading feedback...</p>;
      if (error) return <p className="text-center text-red-500 mt-6">{error}</p>;

      return (
            <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                  <h1 className="text-3xl font-bold text-center mb-10 text-blue-700">Feedback on Completed Consultations</h1>
                  {feedbacks.length === 0 ? (
                        <p className="text-center text-gray-500">No feedback available.</p>
                  ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {feedbacks.map((feedback) => (
                                    <div key={feedback.id} className="bg-white shadow-lg rounded-lg p-6">
                                          <h2 className="text-xl font-semibold mb-2 text-gray-800">
                                                {feedback.patientName}
                                          </h2>
                                          <p className="text-gray-500 mb-1">Doctor: {feedback.doctor}</p>
                                          <p className="text-gray-500 mb-1">Feedback: {feedback.feedback}</p>
                                          <p className="text-gray-500 mb-1">Rating: {feedback.rating} / 5</p>
                                          <p className={`text-sm font-medium ${feedback.status === "Completed" ? "text-green-600" : "text-yellow-500"
                                                }`}>
                                                Status: {feedback.status}
                                          </p>
                                          <p className="text-gray-400 text-sm mt-2">Date: {new Date(feedback.date).toLocaleDateString()}</p>
                                    </div>
                              ))}
                        </div>
                  )}
            </div>
      );
};

export default FeedbackList;
