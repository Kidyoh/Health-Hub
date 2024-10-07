"use client";
import { useState, useEffect } from "react";
import { Button, Modal } from "flowbite-react";
import axios from "axios";
import ProfileField from "./profileField";


interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: string;
  location?: string;
  rate?: number;
  doctorInfo?: string;
  specialties?: string;
}

const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editField, setEditField] = useState<string | null>(null); // To track which field is being edited
  const [updatedProfile, setUpdatedProfile] = useState<UserProfile | null>(null);

  // Fetch the user's profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/profile");
        setUserProfile(res.data.user);
        setUpdatedProfile(res.data.user); // Initialize updated profile
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleEditClick = (field: string) => {
    setEditField(field); // Set the current field to edit
    setModalOpen(true);  // Open the modal
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (updatedProfile) {
      setUpdatedProfile({ ...updatedProfile, [editField as string]: e.target.value });
    }
  };

  const handleSave = async () => {
    try {
      await axios.put("/api/profile", updatedProfile);
      setUserProfile(updatedProfile); // Update the profile page
      setModalOpen(false); // Close modal
      setEditField(null);  // Clear edit field
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-6">Your Profile</h1>
      <div className="bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto">
        {userProfile ? (
          <div className="grid grid-cols-1 gap-4">
            {/* Profile Row: First Name */}
            <ProfileField
              label="First Name"
              value={userProfile.firstName}
              onEdit={() => handleEditClick("firstName")}
            />

            {/* Profile Row: Last Name */}
            <ProfileField
              label="Last Name"
              value={userProfile.lastName}
              onEdit={() => handleEditClick("lastName")}
            />

            {/* Profile Row: Email */}
            <ProfileField
              label="Email"
              value={userProfile.email}
              onEdit={() => handleEditClick("email")}
            />

            {/* Profile Row: Phone */}
            <ProfileField
              label="Phone"
              value={userProfile.phone}
              onEdit={() => handleEditClick("phone")}
            />

            {/* Role-Based Display */}
            {userProfile.role === "TELECONSULTER" && (
              <>
                {/* Profile Row: Rate */}
                <ProfileField
                  label="Rate"
                  value={userProfile.rate ? `$${userProfile.rate}` : "N/A"}
                  onEdit={() => handleEditClick("rate")}
                />
                {/* Profile Row: Specialties */}
                <ProfileField
                  label="Specialties"
                  value={userProfile.specialties}
                  onEdit={() => handleEditClick("specialties")}
                />
              </>
            )}

            {/* Add more fields as needed */}
          </div>
        ) : (
          <p>Loading profile...</p>
        )}
      </div>

      {/* Edit Modal */}
      <Modal show={modalOpen} onClose={() => setModalOpen(false)}>
        <Modal.Header>Edit {editField}</Modal.Header>
        <Modal.Body>
          <input
            className="border p-2 w-full rounded-md"
            value={updatedProfile ? (updatedProfile[editField as keyof UserProfile] || "") : ""}
            onChange={handleChange}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button className="bg-blue-500 text-white" onClick={handleSave}>
            Save
          </Button>
          <Button color="gray" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};



export default ProfilePage;
