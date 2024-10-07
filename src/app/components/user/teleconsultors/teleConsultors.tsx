"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Import the skeleton CSS
import { AiFillStar, AiOutlineStar } from "react-icons/ai"; // Importing star icons

interface Teleconsultor {
  firstName: string;
  lastName: string;
  Teleconsultor: {
    id: number;
    rate: number;
    rating: number;
  }[]; // Array of Teleconsultor
}

const TeleconsultorsList = () => {
  const [teleconsultors, setTeleconsultors] = useState<Teleconsultor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTeleconsultors = async () => {
      try {
        const res = await fetch('/api/teleconsultors');
        const data = await res.json();
        console.log(data);
        if (data.success) {
          setTeleconsultors(data.teleconsultors);
        } else {
          setError(data.error);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch teleconsultors.');
        setLoading(false);
      }
    };

    fetchTeleconsultors();
  }, []);

  const handleBookNow = (id: number) => {
    router.push(`/user/teleconsultors/${id}/book`); // Navigate to the booking page
  };

  const renderStars = (rating: number) => {
    const totalStars = 5;
    const validRating = Math.max(0, Math.min(rating, totalStars)); // Ensure rating is between 0 and totalStars
    const filledStars = Math.floor(validRating);
    const halfStar = validRating % 1 !== 0;
    const emptyStars = Math.max(totalStars - filledStars - (halfStar ? 1 : 0), 0); // Safeguard against negative emptyStars

    return (
      <div className="flex items-center">
        {Array(filledStars)
          .fill(0)
          .map((_, i) => (
            <AiFillStar key={`filled-${i}`} className="text-yellow-500" />
          ))}
        {halfStar && <AiFillStar className="text-yellow-500" />}
        {Array(emptyStars)
          .fill(0)
          .map((_, i) => (
            <AiOutlineStar key={`empty-${i}`} className="text-yellow-500" />
          ))}
      </div>
    );
  };

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Available Teleconsultors</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Display skeletons while loading
          Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="p-6 bg-white shadow-md rounded-md">
                <Skeleton height={30} width={150} /> {/* Skeleton for the name */}
                <Skeleton height={20} width={100} className="mt-2" /> {/* Skeleton for the rate */}
                <Skeleton height={20} width={100} className="mt-2" /> {/* Skeleton for the rating */}
                <Skeleton height={40} width={100} className="mt-4" /> {/* Skeleton for the button */}
              </div>
            ))
        ) : (
          teleconsultors.map((teleconsultor) => (
            <div key={teleconsultor.Teleconsultor[0]?.id} className="p-6 bg-white dark:bg-gray-800 shadow-sm rounded-md transition transform hover:scale-105 duration-200 hover:shadow-xl cursor-pointer">
              <h2 className="text-xl font-bold">
                Dr. {teleconsultor.firstName} {teleconsultor.lastName}
              </h2>
              {/* Check if Teleconsultor exists before rendering */}
              {teleconsultor.Teleconsultor.length > 0 ? (
                <>
                  <p>Rate: ${teleconsultor.Teleconsultor[0].rate}</p>
                  <div className="flex items-center">
                    {renderStars(teleconsultor.Teleconsultor[0].rating)}
                    <span className="ml-2">{teleconsultor.Teleconsultor[0].rating.toFixed(1)}</span>
                  </div>
                  <button
                    className="mt-4 bg-blue-600 text-white py-2 px-4 rounded"
                    onClick={() => handleBookNow(teleconsultor.Teleconsultor[0].id)} // Pass teleconsultorId
                  >
                    Book Now
                  </button>
                </>
              ) : (
                <p className="text-red-500">Teleconsultor information not available.</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeleconsultorsList;
