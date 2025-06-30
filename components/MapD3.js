import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import VoronoiD3Layer from './VoronoiD3Layer';

export default function MapD3() {
  // Define bounds for the Fronteridades border region (Arizona-Sonora border)
  // This covers the main border region between Arizona and Sonora, Mexico
  const fronteridadesBounds = [
    [29.0, -113.5], // Southwest corner (south of Puerto Peñasco, MX)
    [33.5, -108.5], // Northeast corner (north of Flagstaff, AZ)
  ];

  return (
    <MapContainer
      center={[31.916004, -110.990274]} // Default center
      zoom={9} // Default zoom
      style={{ height: '100vh', width: '100%' }}
      maxBounds={fronteridadesBounds}
      bounds={fronteridadesBounds}
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
