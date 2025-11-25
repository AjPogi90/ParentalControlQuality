import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Ensure marker icons load correctly with CRA bundler
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const ChildMap = ({ location, name }) => {
  if (!location || location.lat == null || location.lng == null) {
    return (
      <div style={{ padding: 12 }}>
        <div style={{ color: '#666' }}>Location not available</div>
      </div>
    );
  }

  const center = [Number(location.lat), Number(location.lng)];

  return (
    <div style={{ borderRadius: 8, overflow: 'hidden' }}>
      <MapContainer center={center} zoom={15} style={{ height: 260, width: '100%' }} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center}>
          <Popup>{name || 'Child'}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default ChildMap;
