"use client";
import { Router } from "next/router";
import { useState, ChangeEvent, FormEvent } from "react";

// Define the structure of the form data for User, Teleconsultor, and Healthcare Facility
interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  location: string;
  phone: string;
}

interface TeleconsultorData {
  specialties: string;
  rate: string;
  workingHours: string;
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

export default function RegistrationStepper() {
  // Step state management
  const [step, setStep] = useState<number>(0);
  const [role, setRole] = useState<string>(''); // Default role is User

  // User data state
  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    location: "",
    phone: "",
  });

  // Teleconsultor data state
  const [teleconsultorData, setTeleconsultorData] = useState<TeleconsultorData>({
    specialties: "",
    rate: "",
    workingHours: "",
  });

  // Facility data state
  const [facilityData, setFacilityData] = useState<FacilityData>({
    name: "",
    location: "",
    services: "",
    openHours: "",
    closeHours: "",
    contact: "",
    type: "",
  });

  // Handle changes in User data inputs
  const handleUserChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Handle changes in Teleconsultor data inputs
  const handleTeleconsultorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTeleconsultorData({ ...teleconsultorData, [e.target.name]: e.target.value });
  };

  // Handle changes in Facility data inputs
  const handleFacilityChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFacilityData({ ...facilityData, [e.target.name]: e.target.value });
  };

  // Handle role selection change
  const handleRoleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value);
    setStep(1); // Reset stepper when role changes
  };

  // Navigate to the next step
  const handleNext = () => {
    setStep(step + 1);
  };

  // Navigate to the previous step
  const handlePrevious = () => {
    setStep(step - 1);
  };

  // Form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Prepare the payload based on role
    const payload = {
      ...userData,
      ...(role === 'TELECONSULTER' && teleconsultorData),
      ...(role === 'HEALTHCARE_FACILITY' && facilityData),
      role,
    };

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Registration successful!");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error registering:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-white rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 0: Role Selection */}
        {step === 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Step 0: Select Role</h2>
            <select value={role} onChange={handleRoleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md">
              <option value="USER">User</option>
              <option value="TELECONSULTER">Teleconsultor</option>
              <option value="HEALTHCARE_FACILITY">Healthcare Facility</option>
            </select>
            <div className="mt-6 flex justify-end">
              <button type="button" onClick={handleNext} className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 1: User Information */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Step 1: User Information</h2>
            <div className="grid grid-cols-1 gap-6">
              {/* First Name, Last Name, Email, Password, Location, Phone */}
              {['firstName', 'lastName', 'email', 'password', 'location', 'phone'].map((field) => (
                <div key={field}>
                  <label className="block text-gray-700 capitalize">{field.replace(/([A-Z])/g, ' $1') + ':'}</label>
                  <input
                    type={field === 'password' ? 'password' : 'text'}
                    name={field}
                    value={userData[field as keyof UserData]}
                    onChange={handleUserChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-between">
              <button type="button" onClick={handlePrevious} className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition">
                Previous
              </button>
              <button type="button" onClick={handleNext} className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Teleconsultor Information */}
        {step === 2 && role === 'TELECONSULTER' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Step 2: Teleconsultor Information</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-gray-700">Specialties:</label>
                <input
                  type="text"
                  name="specialties"
                  value={teleconsultorData.specialties}
                  onChange={handleTeleconsultorChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Rate:</label>
                <input
                  type="text"
                  name="rate"
                  value={teleconsultorData.rate}
                  onChange={handleTeleconsultorChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Working Hours:</label>
                <input
                  type="text"
                  name="workingHours"
                  value={teleconsultorData.workingHours}
                  onChange={handleTeleconsultorChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <button type="button" onClick={handlePrevious} className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition">
                Previous
              </button>
              <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
                Submit
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Healthcare Facility Information */}
        {step === 2 && role === 'HEALTHCARE_FACILITY' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Step 2: Facility Information</h2>
            <div className="grid grid-cols-1 gap-6">
              {/* Facility Name, Location, Services, Open/Close Hours, Contact, Type */}
              {['name', 'location', 'services', 'openHours', 'closeHours', 'contact', 'type'].map((field) => (
                <div key={field}>
                  <label className="block text-gray-700 capitalize">{field.replace(/([A-Z])/g, ' $1') + ':'}</label>
                  <input
                    type="text"
                    name={field}
                    value={facilityData[field as keyof FacilityData]}
                    onChange={handleFacilityChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-between">
              <button type="button" onClick={handlePrevious} className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition">
                Previous
              </button>
              <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
                Submit
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
