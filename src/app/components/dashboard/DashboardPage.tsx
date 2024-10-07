"use client"
import React, { useEffect, useState } from "react";
import UserDashboard from "./UserDashboard";
import TeleconsultorDashboard from "./TeleconsultorDashboard";
import AdminDashboard from "./AdminDashboard";
import { fetchUserRole } from "@/utils/fetchRole"


const DashboardPage = () => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const getUserRole = async () => {
      const userRole = await fetchUserRole();
      setRole(userRole);
    };
    console.log("Fetching user role...");

    getUserRole();
  }, []);

  if (role === null) return <p>Loading...</p>;

  return (
    <>
      {role === "USER" && <UserDashboard />}
      {role === "TELECONSULTOR" && <TeleconsultorDashboard />}
      {role === "ADMIN" && <AdminDashboard />}
    </>
  );
};

export default DashboardPage;