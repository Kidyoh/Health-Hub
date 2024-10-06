import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface Facility {
  id: string;
  name: string;
  location: string;
  contact: string;
  type: string;
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

  return (
    <MapContainer center={center} zoom={8} style={{ height: '600px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {facilities.map((facility) => {
        const position = parseLocation(facility.location);
        return (
          <Marker key={facility.id} position={position}>
            <Popup>
              <div>
                <h2>{facility.name}</h2>
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
