import React, { useEffect, useState } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';

export default function RiversD3Layer() {
  const [geojson, setGeojson] = useState(null);
  const map = useMap();
  const canvasRenderer = L.canvas();

  useEffect(() => {
    fetch('/export(1)Simple.json')
      .then(res => res.json())
      .then(setGeojson);
  }, []);

  if (!geojson) return null;

  return (
    <GeoJSON
      data={geojson}
      renderer={canvasRenderer}
      style={{
        color: '#00aaff', // Bright blue
        weight: 3,
        opacity: 0.85,
      }}
    />
  );
}
