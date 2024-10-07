"use client";

import { useState, useEffect } from "react";
import { Button, Modal } from "flowbite-react";
import axios from "axios";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  location?: string;
  teleconsultor?: TeleconsultorProfile;
  password?: string;
}

interface TeleconsultorProfile {
  rate?: number;
  doctorInfo?: string;
  specialties?: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/admin/users");
        setUsers(res.data.users); 
        setLoading(false);
      } catch (err) {
        setError("Failed to load users");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Open modal and set the current user for editing
  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  // Handle input changes for user fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingUser) {
      setEditingUser({ ...editingUser, [e.target.name]: e.target.value });
    }
  };

  // Save the updated user information
  const handleSave = async () => {
    if (editingUser) {
      try {
        await axios.put(`/api/admin/users/${editingUser.id}`, editingUser);
        setModalOpen(false);
        alert("User updated successfully");
      } catch (error) {
        console.error("Error updating user", error);
        alert("Failed to update user");
      }
    }
  };

  // Conditional rendering based on loading or error state
  if (loading) return <p>Loading users...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-6">User Management</h1>
      <table className="table-auto w-full border-collapse border border-gray-300 shadow-lg">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Role</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">
                {user.firstName} {user.lastName}
              </td>
              <td className="border border-gray-300 px-4 py-2">{user.email}</td>
              <td className="border border-gray-300 px-4 py-2">{user.role}</td>
              <td className="border border-gray-300 px-4 py-2">
                <Button
                  onClick={() => handleEditClick(user)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                >
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit User Modal */}
      {editingUser && (
        <Modal show={modalOpen} onClose={() => setModalOpen(false)}>
          <Modal.Header>Edit User</Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              <input
                name="firstName"
                placeholder="First Name"
                value={editingUser.firstName}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="lastName"
                placeholder="Last Name"
                value={editingUser.lastName}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="email"
                placeholder="Email"
                value={editingUser.email}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="phone"
                placeholder="Phone"
                value={editingUser.phone}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                name="role"
                value={editingUser.role}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, role: e.target.value })
                }
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="USER">USER</option>
                <option value="TELECONSULTER">TELECONSULTER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              <input
                name="password"
                placeholder="Password"
                value={editingUser.password || ""}
                onChange={handleChange}
                type="password"
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
            >
              Save
            </Button>
            <Button
              color="gray"
              onClick={() => setModalOpen(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default UserManagement;