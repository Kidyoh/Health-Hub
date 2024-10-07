"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

interface Facility {
  id: string;
  name: string;
  location: string;
  contact: string;
  type: string;
  services: string[];
}

// Dynamically import FacilitiesMap, disabling SSR
const FacilitiesMap = dynamic(() => import("@/app/components/user/facilities/facilitiesMapper"), {
  ssr: false,
});

const FacilitiesPage = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Fetch the facilities
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const res = await fetch("/api/facilities/getFacilities");
        const data = await res.json();
        if (data.success) {
          setFacilities(data.facilities);
          setFilteredFacilities(data.facilities);
        } else {
          setError("Failed to fetch facilities.");
        }
      } catch (error) {
        setError("Error fetching facilities.");
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  // Filter facilities based on search query
  useEffect(() => {
    const filtered = facilities.filter((facility) =>
      facility.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFacilities(filtered);
  }, [searchQuery, facilities]);

  // Render the component
  if (loading) return <p>Loading facilities...</p>;
  if (error) return <p>{error}</p>;

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
      {/* Render FacilitiesMap with filtered facilities */}
      <FacilitiesMap facilities={filteredFacilities} />
    </div>
  );
};

export default FacilitiesPage;
