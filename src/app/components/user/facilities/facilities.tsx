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

// Loading and error messages component
const LoadingOrError = ({ loading, error }: { loading: boolean; error: string | null }) => {
  if (loading) return <p className="text-center text-blue-600">Loading facilities...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  return null;
};

// Search input component with enhanced styling
const SearchInput = ({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: (query: string) => void }) => (
  <div className="relative mb-6">
    <input
      type="text"
      placeholder="Search for healthcare facilities..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="block w-full px-4 py-3 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
    />
  </div>
);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg p-8">
        {/* Title Section */}
        <h1 className="text-4xl font-semibold text-center text-gray-800 mb-8">
          Nearby Healthcare Facilities
        </h1>

        {/* Search Bar */}
        <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Loading and Error Messages */}
        <LoadingOrError loading={loading} error={error} />

        {/* Facilities Map */}
        {!loading && !error && (
          <div className="mt-8">
            <FacilitiesMap facilities={filteredFacilities} />
          </div>
        )}
      </div>
    </div>
  );
};

export default FacilitiesPage;
