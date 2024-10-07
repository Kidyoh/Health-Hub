"use client";
import { useState, useEffect } from "react";
import { Button, Modal } from "flowbite-react";
import axios from "axios";
import ProfileField from "./profileField";

interface TeleconsultorProfile {
  rate?: number;
  doctorInfo?: string;
  specialties?: string;
}

interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: string;
  location?: string;
  teleconsultor?: TeleconsultorProfile; // Add teleconsultor as a nested object
}

const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editField, setEditField] = useState<string | null>(null);
  const [updatedProfile, setUpdatedProfile] = useState<UserProfile | null>(null);

  // Fetch the user's profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/profile");
        console.log("Profile data:", res.data.user); // Log API response
        
        const user = res.data.user;

        // If the user is a TELECONSULTER, extract the first teleconsultor record
        if (user.role === "TELECONSULTER" && user.Teleconsultor.length > 0) {
          user.teleconsultor = user.Teleconsultor[0]; // Set teleconsultor from the array
        }

        setUserProfile(user);
        setUpdatedProfile(user); // Initialize updated profile
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleEditClick = (field: string) => {
    setEditField(field); // Set the current field to edit
    setModalOpen(true); // Open the modal
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (updatedProfile) {
      if (editField && editField.includes("teleconsultor.")) {
        // Handle nested teleconsultor fields
        const teleconsultorField = editField.split(".")[1];
        setUpdatedProfile({
          ...updatedProfile,
          teleconsultor: {
            ...updatedProfile.teleconsultor,
            [teleconsultorField as keyof TeleconsultorProfile]: e.target.value,
          },
        });
      } else {
        setUpdatedProfile({ ...updatedProfile, [editField as keyof UserProfile]: e.target.value });
      }
    }
  };

  const handleSave = async () => {
    try {
      await axios.put("/api/profile", updatedProfile);
      setUserProfile(updatedProfile); // Update the profile page
      setModalOpen(false); // Close modal
      setEditField(null); // Clear edit field
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

            {/* Role-Based Display for TELECONSULTER */}
            {userProfile.role === "TELECONSULTER" && userProfile.teleconsultor && (
              <>
                {/* Profile Row: Rate */}
                <ProfileField
                  label="Rate"
                  value={userProfile.teleconsultor.rate ? `$${userProfile.teleconsultor.rate}` : "N/A"}
                  onEdit={() => handleEditClick("teleconsultor.rate")}
                />

                {/* Profile Row: Specialties */}
                <ProfileField
                  label="Specialties"
                  value={userProfile.teleconsultor.specialties || "N/A"}
                  onEdit={() => handleEditClick("teleconsultor.specialties")}
                />

                {/* Profile Row: Doctor Info */}
                <ProfileField
                  label="Doctor Info"
                  value={userProfile.teleconsultor.doctorInfo || "N/A"}
                  onEdit={() => handleEditClick("teleconsultor.doctorInfo")}
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
            value={
              updatedProfile
                ? editField && editField.includes("teleconsultor.")
                  ? String(updatedProfile.teleconsultor?.[editField.split(".")[1] as keyof TeleconsultorProfile] || "")
                  : String(updatedProfile[editField as keyof UserProfile] || "")
                : ""
            }
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
