import React, { useEffect, useState } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';

// Helper: decide which places to show at each zoom
function getVisibleFeatures(features, zoom) {
  if (zoom < 8) {
    // Only the very largest cities
    return features.filter(f => {
      const place = (f.properties.place || '').toLowerCase();
      const pop = parseInt(f.properties.population, 10);
      return (place === 'city' || place === 'town') && pop && pop > 500000;
    });
  } else if (zoom < 10) {
    // Major cities and towns
    return features.filter(f => {
      const place = (f.properties.place || '').toLowerCase();
      const pop = parseInt(f.properties.population, 10);
      return (place === 'city' || place === 'town') && pop && pop > 300000;
    });
  } else if (zoom < 12) {
    // Medium cities and towns
    return features.filter(f => {
      const place = (f.properties.place || '').toLowerCase();
      const pop = parseInt(f.properties.population, 10);
      return (place === 'city' || place === 'town') && pop && pop > 20000;
    });
  } else {
    // All cities and towns
    return features.filter(f => {
      const place = (f.properties.place || '').toLowerCase();
      return place === 'city' || place === 'town';
    });
  }
}

export default function TownsLabelLayer() {
  const [geojson, setGeojson] = useState(null);
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());

  useEffect(() => {
    fetch('/export (7).geojson')
      .then(res => res.json())
      .then(setGeojson);
  }, []);

  useEffect(() => {
    const onZoom = () => setZoom(map.getZoom());
    map.on('zoomend', onZoom);
    return () => map.off('zoomend', onZoom);
  }, [map]);

  if (!geojson) return null;

  const filteredFeatures = getVisibleFeatures(geojson.features, zoom);
  const filteredGeojson = { ...geojson, features: filteredFeatures };

  // Debug: log zoom, number, and names of visible features
  console.log('[TownsLabelLayer] zoom:', zoom, 'visible features:', filteredFeatures.length, 'names:', filteredFeatures.map(f => f.properties.name));

  // Plain map label style
  const labelStyle = `
    color: #222;
    font-size: 15px;
    font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
    font-weight: 500;
    text-align: center;
    white-space: nowrap;
    pointer-events: none;
    text-shadow: 0 1px 4px rgba(255,255,255,0.7), 0 0px 2px rgba(0,0,0,0.18);
    background: none;
    border: none;
    padding: 0;
    margin: 0;
  `;

  return (
    <GeoJSON
      key={zoom}
      data={filteredGeojson}
      pointToLayer={(feature, latlng) => {
        const name = feature.properties.name || 'Unknown';
        // Estimate width for centering
        const width = Math.max(40, name.length * 8);
        return L.marker(latlng, {
          icon: L.divIcon({
            className: 'map-town-label',
            html: `<span style="${labelStyle}">${name}</span>`,
            iconSize: [width, 20],
            iconAnchor: [width/2, 10],
          }),
          interactive: false,
          keyboard: false,
        });
      }}
    />
  );
}
