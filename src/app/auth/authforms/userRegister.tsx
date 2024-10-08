"use client";
import { useRouter } from "next/navigation"; // Use useRouter from next/navigation
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
  const router = useRouter(); // Initialize the router for navigation

  // Step state management
  const [step, setStep] = useState<number>(0);
  const [role, setRole] = useState<string>(""); // Default role is User
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

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
    if (role === "USER") {
      handleSubmit(); // Submit if it's a user, no next step
    } else {
      setStep(step + 1); // Move to the next step for other roles
    }
  };

  // Navigate to the previous step
  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
  
    // Prepare the payload
    const payload = {
      ...userData,
      ...(role === "TELECONSULTER" && teleconsultorData),
      ...(role === "HEALTHCARE_FACILITY" && {
        name: facilityData.name,
        location: facilityData.location,
        services: facilityData.services,
        openHours: facilityData.openHours,
        closeHours: facilityData.closeHours, // Combine open/close hours
        contact: facilityData.contact,
        type: facilityData.type,
      }),
      role,
    };
  
    console.log("Submitting payload:", payload); // Debugging
  
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
      console.log("API Response:", data); // Debugging
  
      if (response.ok) {
        alert("Registration successful!");
  
        // Check the role and navigate accordingly
        if (role === "USER") {
          router.push("/"); // Navigate to homepage if role is USER
        } else if (role === "TELECONSULTER" || role === "HEALTHCARE_FACILITY") {

          router.push("/auth/login");
          window.location.reload();
        }
      } else {
        setError(data.error || "Registration failed.");
        console.error("Registration error:", data.error); // Debugging
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  
  
  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-white rounded-lg shadow-lg">
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading && <p>Loading...</p>}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 0: Role Selection */}
        {step === 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Step 0: Select Role</h2>
            <select
              value={role}
              onChange={handleRoleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="USER">User</option>
              <option value="TELECONSULTER">Teleconsultor</option>
              <option value="HEALTHCARE_FACILITY">Healthcare Facility</option>
            </select>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              >
                {role === "USER" ? "Submit" : "Next"}
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
              {["firstName", "lastName", "email", "password", "location", "phone"].map((field) => (
                <div key={field}>
                  <label className="block text-gray-700 capitalize">
                    {field.replace(/([A-Z])/g, " $1") + ":"}
                  </label>
                  <input
                    type={field === "password" ? "password" : "text"}
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
              <button
                type="button"
                onClick={handlePrevious}
                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Teleconsultor Information */}
        {step === 2 && role === "TELECONSULTER" && (
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
              <button
                type="button"
                onClick={handlePrevious}
                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
              >
                Previous
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Healthcare Facility Information */}
        {step === 2 && role === "HEALTHCARE_FACILITY" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Step 2: Facility Information</h2>
            <div className="grid grid-cols-1 gap-6">
              {/* Facility Name, Location, Services, Open/Close Hours, Contact, Type */}
              {["name", "location", "services", "openHours", "closeHours", "contact", "type"].map((field) => (
                <div key={field}>
                  <label className="block text-gray-700 capitalize">
                    {field.replace(/([A-Z])/g, " $1") + ":"}
                  </label>
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
              <button
                type="button"
                onClick={handlePrevious}
                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
              >
                Previous
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
