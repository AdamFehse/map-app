import React, { useEffect, useState } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';

export default function TownsD3Layer() {
  const [geojson, setGeojson] = useState(null);
  const map = useMap();

  useEffect(() => {
    fetch('/export(3).geojson')
      .then(res => res.json())
      .then(setGeojson);
  }, []);

  // Simple size calculation based on text length
  const calculateLabelSize = (text) => {
    let width;
    if (text.length <= 4) width = 60;
    else if (text.length <= 8) width = 100;
    else width = 140;
    
    return [width, 30];
  };

  if (!geojson) return null;

  return (
    <GeoJSON
      data={geojson}
      pointToLayer={(feature, latlng) => {
        const townName = feature.properties.name || 'Unknown';
        const [width, height] = calculateLabelSize(townName);
        
        return L.marker(latlng, {
          icon: L.divIcon({
            className: 'custom-city-label',
            html: `<div style="
              background: linear-gradient(135deg,rgba(26, 26, 26, 0.66) 0%,rgb(45, 45, 45) 100%);
              color: #00ff88;
              border: 2px solid #00ff88;
              border-radius: 6px;
              padding: 1px 1px;
              font-weight: bold;
              font-size: 16px;
              white-space: nowrap;
              text-align: center;
              box-shadow: 0 0 10px rgba(0, 255, 136, 0.3), 0 2px 4px rgba(0, 0, 0, 0.3);
              text-shadow: 0 0 4px rgba(0, 255, 136, 0.5);
            ">${townName}</div>`,
            iconSize: [width, height],
            iconAnchor: [width / 2, height / 2]
          })
        });
      }}
    />
  );
}