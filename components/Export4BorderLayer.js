import React, { useEffect, useState } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';

export default function Export4BorderLayer() {
  const [geojson, setGeojson] = useState(null);
  const map = useMap();
  const canvasRenderer = L.canvas();

  useEffect(() => {
    fetch('/export (8).geojson')
      .then(res => res.json())
      .then(setGeojson);
  }, []);

  if (!geojson) return null;

  return (
    <GeoJSON
      data={geojson}
      renderer={canvasRenderer}
      style={{
        color: 'white',      // Border color (bright cyan)
        weight: 5,             // Border thickness
        fillOpacity: .5,        // Adjust for desired transparency
        opacity: .5,
      }}
    />
  );
} 