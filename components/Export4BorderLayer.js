import React, { useEffect, useState } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';

export default function Export4BorderLayer() {
  const [geojson, setGeojson] = useState(null);
  const map = useMap();
  const canvasRenderer = L.canvas();

  useEffect(() => {
    fetch('/export (4).geojson')
      .then(res => res.json())
      .then(setGeojson);
  }, []);

  if (!geojson) return null;

  return (
    <GeoJSON
      data={geojson}
      renderer={canvasRenderer}
      style={{
        color: '#00ffea',      // Border color (bright cyan)
        weight: 4,             // Border thickness
        fillColor: '#00fff7',  // Fill color (lighter cyan)
        fillOpacity: 0,        // Adjust for desired transparency
        opacity: 0.9,
      }}
    />
  );
} 