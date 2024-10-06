"use client";
import { useState, useEffect } from "react";
import { Modal, Button } from "flowbite-react";
import axios from "axios";

interface UserProfile {
  firstName?: string;
  lastName?: string;
  location?: string;
  phone?: string;
  role?: string;
  rate?: number;
  doctorInfo?: string;
  specialties?: string;
  workingHours?: string;
  services?: string;
  hours?: string;
  contact?: string;
  type?: string;
}

const ProfileModal = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [editField, setEditField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/profile");
        setUserProfile(res.data.user);
        setUpdatedProfile(res.data.user); // Copy profile to allow edits
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleEditClick = (field: string) => {
    setEditField(field); // Enable editing for this field
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    if (updatedProfile) {
      setUpdatedProfile({ ...updatedProfile, [field]: e.target.value });
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await axios.put("/api/profile", updatedProfile);
      setEditField(null); // Disable editing mode
      alert("Profile updated successfully!");
      setLoading(false);
      setModalOpen(false); // Close modal after save
    } catch (error) {
      console.error("Error updating profile:", error);
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setModalOpen(true)} className="bg-blue-500 text-white p-2 rounded-md">
        View Profile
      </Button>

      <Modal show={modalOpen} onClose={() => setModalOpen(false)} size="lg">
        <Modal.Header className="text-2xl font-bold text-gray-800">Your Profile</Modal.Header>
        <Modal.Body>
          {loading ? (
            <p>Loading...</p>
          ) : userProfile ? (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="font-semibold">First Name</label>
                {editField === "firstName" ? (
                  <input
                    className="border p-2 w-full rounded-md"
                    value={updatedProfile?.firstName || ""}
                    onChange={(e) => handleChange(e, "firstName")}
                  />
                ) : (
                  <div className="flex justify-between items-center">
                    <p>{userProfile.firstName}</p>
                    <Button onClick={() => handleEditClick("firstName")} className="text-blue-500">
                      Edit
                    </Button>
                  </div>
                )}
              </div>

              <div>
                <label className="font-semibold">Last Name</label>
                {editField === "lastName" ? (
                  <input
                    className="border p-2 w-full rounded-md"
                    value={updatedProfile?.lastName || ""}
                    onChange={(e) => handleChange(e, "lastName")}
                  />
                ) : (
                  <div className="flex justify-between items-center">
                    <p>{userProfile.lastName}</p>
                    <Button onClick={() => handleEditClick("lastName")} className="text-blue-500">
                      Edit
                    </Button>
                  </div>
                )}
              </div>

              <div>
                <label className="font-semibold">Phone</label>
                {editField === "phone" ? (
                  <input
                    className="border p-2 w-full rounded-md"
                    value={updatedProfile?.phone || ""}
                    onChange={(e) => handleChange(e, "phone")}
                  />
                ) : (
                  <div className="flex justify-between items-center">
                    <p>{userProfile.phone}</p>
                    <Button onClick={() => handleEditClick("phone")} className="text-blue-500">
                      Edit
                    </Button>
                  </div>
                )}
              </div>

              {/* Example for Teleconsultor-specific fields */}
              {userProfile.role === "TELECONSULTER" && (
                <>
                  <div>
                    <label className="font-semibold">Rate</label>
                    {editField === "rate" ? (
                      <input
                        className="border p-2 w-full rounded-md"
                        type="number"
                        value={updatedProfile?.rate || ""}
                        onChange={(e) => handleChange(e, "rate")}
                      />
                    ) : (
                      <div className="flex justify-between items-center">
                        <p>{userProfile.rate}</p>
                        <Button onClick={() => handleEditClick("rate")} className="text-blue-500">
                          Edit
                        </Button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="font-semibold">Specialties</label>
                    {editField === "specialties" ? (
                      <textarea
                        className="border p-2 w-full rounded-md"
                        value={updatedProfile?.specialties || ""}
                        onChange={(e) => handleChange(e, "specialties")}
                      />
                    ) : (
                      <div className="flex justify-between items-center">
                        <p>{userProfile.specialties}</p>
                        <Button onClick={() => handleEditClick("specialties")} className="text-blue-500">
                          Edit
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* More fields for healthcare facility */}
              {userProfile.role === "HEALTHCARE_FACILITY" && (
                <>
                  <div>
                    <label className="font-semibold">Services</label>
                    {editField === "services" ? (
                      <textarea
                        className="border p-2 w-full rounded-md"
                        value={updatedProfile?.services || ""}
                        onChange={(e) => handleChange(e, "services")}
                      />
                    ) : (
                      <div className="flex justify-between items-center">
                        <p>{userProfile.services}</p>
                        <Button onClick={() => handleEditClick("services")} className="text-blue-500">
                          Edit
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}

              <Button className="bg-green-500 text-white p-2 rounded-md" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          ) : (
            <p>No profile data available</p>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProfileModal;
