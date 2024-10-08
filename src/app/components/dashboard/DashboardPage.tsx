"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Updated import for Next.js 13+ navigation
import UserDashboard from "./UserDashboard";
import TeleconsultorDashboard from "./TeleconsultorDashboard";
import AdminDashboard from "./AdminDashboard";

const DashboardPage = () => {
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter(); // Initialize Next.js router from next/navigation

  useEffect(() => {
    const checkSessionAndRole = async () => {
      try {
        // Fetch user session and role using your API
        const response = await fetch("/api/auth/getUser");
        const data = await response.json();

        if (!data.success) {
          // If session doesn't exist, redirect to login page
          router.push("/auth/login");
        } else {
          // If session exists, set the role
          setRole(data.user.role);
        }
      } catch (error) {
        console.error("Error fetching session and role:", error);
        router.push("/auth/login"); // Redirect to login if an error occurs
      }
    };

    checkSessionAndRole();
  }, [router]);

  // Display loading message while checking session and role
  if (role === null) return <p>Loading...</p>;

  // Render the appropriate dashboard based on the user's role
  return (
    <>
      {role === "USER" && <UserDashboard />}
      {role === "TELECONSULTER" && <TeleconsultorDashboard />}
      {role === "ADMIN" && <AdminDashboard />}
    </>
  );
};

export default DashboardPage;
