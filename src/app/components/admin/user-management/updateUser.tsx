"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

interface User {
  firstName: string;
  lastName: string;
  role: string;
}

const UserPermissions = () => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const params = useParams();
  const userId = params?.id;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/admin/users/${userId}/permissions`);
        setUser(response.data);
        setRole(response.data.role);
      } catch (error) {
        setError("Failed to fetch user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleRoleChange = async () => {
    setUpdating(true);
    try {
      await axios.put(`/api/admin/users/${userId}/permissions`, { role });
      alert("User role updated successfully");
    } catch (error) {
      alert("Failed to update user role");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p>Loading user details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto py-8">
      {user && (
        <h1 className="text-2xl font-bold mb-4">Manage Permissions for {user.firstName} {user.lastName}</h1>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">User Role</label>
        <select
          className="mt-1 px-3 py-2 border shadow-sm border-gray-300 rounded-md w-full"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="USER">USER</option>
          <option value="TELECONSULTER">TELECONSULTER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </div>

      <button
        className="bg-blue-600 text-white py-2 px-4 rounded"
        onClick={handleRoleChange}
        disabled={updating}
      >
        {updating ? "Updating..." : "Update Role"}
      </button>
    </div>
  );
};

export default UserPermissions;
