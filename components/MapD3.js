import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import VoronoiD3Layer from './VoronoiD3Layer';

export default function MapD3() {
  // Define bounds for the map (South Arizona and North Mexico)
  const bounds = [
    [30.656, -111.833], // Southwest corner (near Altar, MX)
    [32.47, -110.97], // Northeast corner (near Tucson, AZ)
  ];

  return (
    <MapContainer
      center={[31.916004, -110.990274]} // Default center
      zoom={9} // Default zoom
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {/* Voronoi Diagram Layer */}
      <VoronoiD3Layer />
    </MapContainer>
  );
}
