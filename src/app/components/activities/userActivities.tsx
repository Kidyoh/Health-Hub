"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

// Define the structure of the activity data, including status
interface Activity {
  time: string;
  action: string;
  color: string;
  line?: string;
  id?: string;
  link?: string;
  status?: string; // Add status to the Activity interface
}

// Function to fetch user activities
const fetchUserDailyActivities = async (): Promise<Activity[]> => {
  try {
    const response = await fetch(`/api/activities`);
    const data = await response.json();
    return data.activities;
  } catch (error) {
    console.error("Error fetching user activities:", error);
    throw error;
  }
};

const DailyActivity: React.FC = () => {
  const [activitySteps, setActivitySteps] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user activity data when the component mounts
  useEffect(() => {
    const getUserActivities = async () => {
      try {
        const activities = await fetchUserDailyActivities();
        setActivitySteps(activities);
      } catch (err) {
        console.error("Error fetching activities:", err);
        setError("Failed to fetch activities.");
      } finally {
        setLoading(false);
      }
    };
    getUserActivities();
  }, []);

  return (
    <div className="rounded-xl dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words">
      <h5 className="card-title mb-6 text-lg font-semibold">Daily Activities</h5>

      <div className="flex flex-col mt-2">
        {loading ? (
          <p>Loading activities...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : activitySteps.length === 0 ? (
          <p>No activities found for today.</p>
        ) : (
          <ul>
            {activitySteps.map((item, index) => (
              <li key={index}>
                <div className="flex gap-4 min-h-16">
                  <div>
                    <p className="text-gray-500">{item.time}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className={`rounded-full ${item.color} p-1.5 w-fit`}></div>
                    <div className={`${item.line || "h-full w-px bg-gray-300"}`}></div>
                  </div>
                  <div>
                    <p className="text-dark text-start">{item.action}</p>
                    {item.status && (
                      <p className="text-sm text-gray-600">Status: {item.status}</p>
                    )}
                    {item.link && (
                      <Link href={item.link} className="text-blue-700">
                        {item.id}
                      </Link>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DailyActivity;
