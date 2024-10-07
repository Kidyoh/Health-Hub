"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "flowbite-react";
import { toast } from "react-toastify";

const UserReports = () => {
  interface UserReport {
    id: number;
    name: string;
    email: string;
    registrationDate: string;
    totalTeleconsultations: number;
    completedTeleconsultations: number;
    missedTeleconsultations: number;
  }

  const [userReports, setUserReports] = useState<UserReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [userId, setUserId] = useState<number | null>(null);

  // Fetch user reports
  const fetchUserReports = async () => {
    console.log("Fetching user reports...");

    // Validate date inputs
    if (!startDate || !endDate) {
      toast.error("Please provide both start and end dates.");
      return;
    }

    // Set loading state
    setLoading(true);
    setError(null); // Reset error state

    try {
      const res = await axios.get("/api/admin/reports/users", {
        params: {
          startDate,
          endDate,
          userId,
        },
      });

      console.log("API response:", res.data);

      setUserReports(res.data.userReports);
    } catch (err) {
      setError("Failed to load user reports");
      console.error("Error loading user reports:", err);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch on load
  useEffect(() => {
    fetchUserReports();
  }, []);

  if (loading) return <p>Loading user reports...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-6">User Reports</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex flex-col">
          <label htmlFor="start-date" className="mb-2 text-sm">
            Start Date
          </label>
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border px-3 py-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="end-date" className="mb-2 text-sm">
            End Date
          </label>
          <input
            type="date"
            id="end-date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border px-3 py-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="user-id" className="mb-2 text-sm">
            User ID (optional)
          </label>
          <input
            type="number"
            placeholder="User ID"
            value={userId || ""}
            onChange={(e) => setUserId(parseInt(e.target.value) || null)}
            className="border px-3 py-2 rounded"
          />
        </div>
        <Button
          onClick={fetchUserReports}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded self-end"
        >
          Filter
        </Button>
      </div>

      {/* User Reports Table */}
      <table className="table-auto w-full border-collapse border border-gray-300 shadow-lg">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">User ID</th>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Registration Date</th>
            <th className="border border-gray-300 px-4 py-2">Total Consultations</th>
            <th className="border border-gray-300 px-4 py-2">Completed Consultations</th>
            <th className="border border-gray-300 px-4 py-2">Missed Consultations</th>
          </tr>
        </thead>
        <tbody>
          {userReports.length > 0 ? (
            userReports.map((user) => (
              <tr key={user.id}>
                <td className="border border-gray-300 px-4 py-2">{user.id}</td>
                <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(user.registrationDate).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">{user.totalTeleconsultations}</td>
                <td className="border border-gray-300 px-4 py-2">{user.completedTeleconsultations}</td>
                <td className="border border-gray-300 px-4 py-2">{user.missedTeleconsultations}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-4">
                No user reports available for the selected filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserReports;