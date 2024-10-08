import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Custom Marker Icon
const customIcon = new L.Icon({
  iconUrl: '/images/markers/hospital-marker.svg',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface Facility {
  id: string;
  name: string;
  location: string;
  contact: string;
  type: string; // Hospital type (e.g., General, Specialist)
  services: string[]; // List of services offered
}

const center: [number, number] = [9.145, 40.489673]; // Default center for Ethiopia

const FacilitiesMap: React.FC<{ facilities: Facility[] }> = ({ facilities }) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [nearestFacility, setNearestFacility] = useState<[number, number] | null>(null);
  const [selectedFacilities, setSelectedFacilities] = useState<[number, number][]>([]);
  const [filterType, setFilterType] = useState<string>(''); // Filter for hospital type
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>(facilities);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLoc: [number, number] = [position.coords.latitude, position.coords.longitude];
        setUserLocation(userLoc);
        const nearest = findNearestFacility(userLoc, facilities);
        setNearestFacility(nearest);
      });
    }
  }, [facilities]);

  // Filter facilities based on selected type
  useEffect(() => {
    if (filterType) {
      const filtered = facilities.filter(facility => facility.type === filterType);
      setFilteredFacilities(filtered);
    } else {
      setFilteredFacilities(facilities);
    }
  }, [filterType, facilities]);

  const calculateDistance = (loc1: [number, number], loc2: [number, number]) => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const lat1 = loc1[0];
    const lon1 = loc1[1];
    const lat2 = loc2[0];
    const lon2 = loc2[1];
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const findNearestFacility = (userLoc: [number, number], facilities: Facility[]) => {
    let nearest = facilities[0];
    let minDistance = calculateDistance(userLoc, parseLocation(facilities[0].location));
    facilities.forEach(facility => {
      const distance = calculateDistance(userLoc, parseLocation(facility.location));
      if (distance < minDistance) {
        nearest = facility;
        minDistance = distance;
      }
    });
    return parseLocation(nearest.location);
  };

  const parseLocation = (location: string): [number, number] => {
    const [lat, lng] = location
      .replace('Latitude: ', '')
      .replace('Longitude: ', '')
      .split(', ')
      .map(parseFloat);
    return [lat, lng];
  };

  const handleFacilitySelect = (position: [number, number]) => {
    setSelectedFacilities((prev) => [...prev, position]);
  };

  return (
    <>
      {/* Filter dropdown */}
      <div className="filter-container mb-4 text-center">
        <label className="font-medium text-lg">Filter by Type: </label>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="ml-2 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All</option>
          <option value="General">General Hospital</option>
          <option value="Specialist">Specialist Clinic</option>
          <option value="Clinic">Clinic</option>
        </select>
      </div>

      <MapContainer center={center} zoom={8} style={{ height: '600px', width: '100%', borderRadius: '10px' }} className="shadow-lg">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Auto-navigate to the nearest facility */}
        {nearestFacility && <SetMapView position={nearestFacility} />}

        {/* Draw polyline connecting selected facilities */}
        {selectedFacilities.length > 1 && (
          <Polyline positions={selectedFacilities} color="blue" weight={4} />
        )}

        {filteredFacilities.map((facility) => {
          const position = parseLocation(facility.location);
          return (
            <Marker key={facility.id} position={position} icon={customIcon}>
              <Popup>
                <div className="font-sans">
                  <h2 className="text-lg font-bold text-blue-800">{facility.name}</h2>
                  <p className="text-sm text-gray-600">{Array.isArray(facility.services) ? facility.services.join(', ') : facility.services}</p>
                  <p className="text-sm text-gray-600">{facility.contact}</p>
                  <p className="text-sm text-gray-600">{facility.type}</p>
                  <button
                    onClick={() => handleFacilitySelect(position)}
                    className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow"
                  >
                    Add to Route
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {userLocation && selectedFacilities.length > 0 && (
          <RoutingControl
            waypoints={[L.latLng(userLocation[0], userLocation[1]), ...selectedFacilities.map((pos) => L.latLng(pos[0], pos[1]))]}
          />
        )}
      </MapContainer>
    </>
  );
};

const RoutingControl: React.FC<{ waypoints: L.LatLng[] }> = ({ waypoints }) => {
  const map = useMap();

  useEffect(() => {
    if (!waypoints || waypoints.length < 2) return;

    const routingControl = L.Routing.control({
      waypoints,
      routeWhileDragging: true,
      show: true,
    }).addTo(map);

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, waypoints]);

  return null;
};

const SetMapView: React.FC<{ position: [number, number] }> = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 12);
    }
  }, [map, position]);

  return null;
};

export default FacilitiesMap;
