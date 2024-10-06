"use client";
import { useState, ChangeEvent, FormEvent } from "react";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface FacilityData {
  name: string;
  location: string;
  services: string;
  openHours: string;
  closeHours: string;
  contact: string;
  type: string;
}

export default function FacilityRegistrationStepper() {
  const [step, setStep] = useState<number>(1);
  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [facilityData, setFacilityData] = useState<FacilityData>({
    name: "",
    location: "",
    services: "",
    openHours: "",
    closeHours: "",
    contact: "",
    type: "",
  });

  const handleUserChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleFacilityChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFacilityData({ ...facilityData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  // Function to get the user's current location
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFacilityData({
            ...facilityData,
            location: `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to retrieve location. Please enter it manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/facility/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...userData,
          ...facilityData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Facility registered successfully");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error registering facility:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Step 1: User Information</h2>
            <div className="mb-4">
              <label className="block text-gray-700">First Name:</label>
              <input
                type="text"
                name="firstName"
                value={userData.firstName}
                onChange={handleUserChange}
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Last Name:</label>
              <input
                type="text"
                name="lastName"
                value={userData.lastName}
                onChange={handleUserChange}
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email:</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleUserChange}
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700">Password:</label>
              <input
                type="password"
                name="password"
                value={userData.password}
                onChange={handleUserChange}
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
                required
              />
            </div>
            <button
              type="button"
              onClick={handleNext}
              className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Step 2: Facility Information</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Facility Name:</label>
              <input
                type="text"
                name="name"
                value={facilityData.name}
                onChange={handleFacilityChange}
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Location:</label>
              <input
                type="text"
                name="location"
                value={facilityData.location}
                onChange={handleFacilityChange}
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
                required
              />
              <button
                type="button"
                onClick={handleGetLocation}
                className="mt-2 text-blue-500 hover:underline"
              >
                Use my current location
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Services:</label>
              <input
                type="text"
                name="services"
                value={facilityData.services}
                onChange={handleFacilityChange}
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Opening Hours:</label>
              <input
                type="time"
                name="openHours"
                value={facilityData.openHours}
                onChange={handleFacilityChange}
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Closing Hours:</label>
              <input
                type="time"
                name="closeHours"
                value={facilityData.closeHours}
                onChange={handleFacilityChange}
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Contact:</label>
              <input
                type="text"
                name="contact"
                value={facilityData.contact}
                onChange={handleFacilityChange}
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700">Type:</label>
              <input
                type="text"
                name="type"
                value={facilityData.type}
                onChange={handleFacilityChange}
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
                required
              />
            </div>

            <button
              type="button"
              onClick={handlePrevious}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition mr-2"
            >
              Previous
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
            >
              Submit
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
