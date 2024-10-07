"use client";
import { useEffect, useState } from "react";
import FacilitiesMap from "@/app/components/user/facilities/facilitiesMapper";

interface Facility {
  id: string;
  name: string;
  location: string;
  contact: string;
  type: string;
  services: string[]; // Update to array of strings
}

const FacilitiesPage = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([]);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const res = await fetch("/api/facilities/getFacilities");
        const data = await res.json();
        if (data.success) {
          setFacilities(data.facilities);
          setFilteredFacilities(data.facilities); // Initialize filtered facilities
        } else {
          console.error("Failed to fetch facilities:", data.error);
        }
      } catch (error) {
        console.error("Error fetching facilities:", error);
      }
    };

    fetchFacilities();
  }, []);

  useEffect(() => {
    const filtered = facilities.filter((facility) =>
      facility.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFacilities(filtered);
  }, [searchQuery, facilities]);

  return (
    <div className="container mx-auto my-10">
      <h1 className="text-3xl font-bold mb-8">Nearby Healthcare Facilities</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search for facilities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
      </div>
      <FacilitiesMap facilities={filteredFacilities} />
    </div>
  );
};

export default FacilitiesPage;