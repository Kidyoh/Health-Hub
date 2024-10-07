import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom Marker Icon (example)
const customIcon = new L.Icon({
  iconUrl: '/images/markers/hospital-marker.svg', // Provide the path to your custom icon
  iconSize: [32, 32], // Size of the icon
  iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -32], // Point from which the popup should open relative to the iconAnchor
});

interface Facility {
  id: string;
  name: string;
  location: string;
  contact: string;
  type: string;
  services: string[]; // Ensure services is an array of strings
}

const center: [number, number] = [9.145, 40.489673]; // Default center for Ethiopia

const FacilitiesMap: React.FC<{ facilities: Facility[] }> = ({ facilities }) => {
  // Convert facility location to [lat, lng]
  const parseLocation = (location: string): [number, number] => {
    const [lat, lng] = location
      .replace('Latitude: ', '')
      .replace('Longitude: ', '')
      .split(', ')
      .map(parseFloat);
    return [lat, lng];
  };

  // Component to set the map view to the first facility location when loaded
  const SetMapView: React.FC<{ position: [number, number] }> = ({ position }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(position, 12); // Adjust zoom as needed
    }, [map, position]);

    return null; // This component doesn't render anything
  };

  return (
    <MapContainer center={center} zoom={8} style={{ height: '600px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {facilities.length > 0 && (
        // Set the map view to the first facility's location when loaded
        <SetMapView position={parseLocation(facilities[0].location)} />
      )}

      {facilities.map((facility) => {
        const position = parseLocation(facility.location);
        return (
          <Marker key={facility.id} position={position} icon={customIcon}>
            <Popup>
              <div>
                <h2>{facility.name}</h2>
                <p>{Array.isArray(facility.services) ? facility.services.join(', ') : facility.services}</p> {/* Type check */}
                <p>{facility.contact}</p>
                <p>{facility.type}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default FacilitiesMap;