"use client"
import { useEffect, useState } from 'react';
import FacilitiesMap from '@/app/components/user/facilities/facilitiesMapper';

const FacilitiesPage = () => {
  const [facilities, setFacilities] = useState([]);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const res = await fetch('/api/facilities/getFacilities');
        const data = await res.json();
        if (data.success) {
          setFacilities(data.facilities);
        } else {
          console.error('Failed to fetch facilities:', data.error);
        }
      } catch (error) {
        console.error('Error fetching facilities:', error);
      }
    };

    fetchFacilities();
  }, []);

  return (
    <div className="container mx-auto my-10">
      <h1 className="text-3xl font-bold mb-8">Nearby Healthcare Facilities</h1>
      <FacilitiesMap facilities={facilities} />
    </div>
  );
};

export default FacilitiesPage;
