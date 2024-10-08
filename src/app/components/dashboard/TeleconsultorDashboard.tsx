import React, { useEffect, useState } from "react";
import SalesProfit from "../dashboard/RevenueForecast";
import TotalIncome from "../dashboard/TotalIncome";
import DailyActivity from "../activities/userActivities";

const TeleconsultorDashboard = () => {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const response = await fetch("/api/auth/getUser", {
          headers: {
            "Cache-Control": "no-cache", // Prevent caching
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch session");
        }

        const data = await response.json();

        const userSession = data;



        if (userSession.user.role === "TELECONSULTER") {
          setStatus(userSession.user.status);
        }
      } catch (error) {
        setError("Failed to load session data.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSession();
  }, []);


  // Show a loading message while session data is being fetched
  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  // Show an error message if session data couldn't be fetched
  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  // Conditionally render the message if the teleconsultor's status is pending
  return (
    <div className="">
      {status === "PENDING" ? (
        <div className="col-span-12 bg-yellow-100 text-yellow-800 p-4 rounded-md mb-6">
          <h1 className="text-xl font-bold mb-2">Approval Pending</h1>
          <p>Your teleconsultor account is pending approval. You will receive an email for an interview soon.</p>
        </div>
      ) : (
        <>
          {/* If status is not pending, show the normal dashboard content */}
          <div className="grid grid-cols-12 gap-30">
            <div className="lg:col-span-8 col-span-12">
              <SalesProfit />
            </div>
            <div className="lg:col-span-4 col-span-12">
              <div className="grid grid-cols-12 h-full items-stretch">
                <div className="col-span-12">
                  <TotalIncome />
                </div>
              </div>
            </div>
            <div className="lg:col-span-4 col-span-12">
              <DailyActivity />
            </div>

          </div>
        </>
      )}
    </div>
  );
};

export default TeleconsultorDashboard;