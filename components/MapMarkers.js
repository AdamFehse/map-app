// components/MapMarkers.js
import React from "react";
import { Marker, Popup } from "react-leaflet";
import { createCategoryIcon } from "./MarkerIcons";
import { getCategoryConfig } from "./CategoryConfig";

export default function MapMarkers({ projects }) {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <>
      {/* Category-based markers with responsive popups */}
      {projects.slice(0, 5).map((project, index) => {
        const category = project.ProjectCategory || 'Other';
        const config = getCategoryConfig(category);
        let markerRef = React.createRef();
        return (
          <Marker
            key={`${project.Name}-${index}`}
            position={[project.Latitude, project.Longitude]}
            icon={createCategoryIcon(category, false, false, project)}
            ref={markerRef}
            eventHandlers={{
              mouseover: (e) => {
                const marker = markerRef.current;
                if (marker) {
                  marker.setIcon(createCategoryIcon(category, true, false, project));
                }
              },
              mouseout: (e) => {
                const marker = markerRef.current;
                if (marker) {
                  marker.setIcon(createCategoryIcon(category, false, false, project));
                }
              },
            }}
          >
            <Popup>
              <div style={{ minWidth: '200px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  marginBottom: '8px' 
                }}>
                  <div style={{
                    backgroundColor: config.color,
                    color: 'white',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {config.symbol}
                  </div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
                    {project.Name}
                  </h3>
                </div>
                <div style={{
                  backgroundColor: config.color,
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '500',
                  display: 'inline-block',
                  marginBottom: '8px'
                }}>
                  {config.label}
                </div>
                {project.DescriptionShort && (
                  <p style={{ 
                    margin: 0, 
                    color: '#666', 
                    lineHeight: '1.4', 
                    fontSize: '13px' 
                  }}>
                    {project.DescriptionShort}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
} 