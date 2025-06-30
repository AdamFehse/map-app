import React from 'react';
import ProjectGallery from './ProjectGallery';

export default function ProjectGalleryDropdown({
  isOpen,
  onClose,
  projects,
  markerRefs,
  mapBounds,
  mapRef,
  onMarkerHover,
  onMarkerLeave,
  onMarkerClick,
  style = {},
}) {
  // Render ProjectGallery in a dropdown position with custom style
  return (
    <div
      style={{
        position: 'absolute',
        top: 80, // adjust as needed for your SearchBar position
        left: 50, // adjust as needed for your SearchBar position
        width: 400, // adjust as needed
        zIndex: 2000,
        borderRadius: 16,
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        overflow: 'hidden',
        ...style,
      }}
    >
      <ProjectGallery
        isOpen={isOpen}
        onClose={onClose}
        projects={projects}
        markerRefs={markerRefs}
        mapBounds={mapBounds}
        mapRef={mapRef}
        onMarkerHover={onMarkerHover}
        onMarkerLeave={onMarkerLeave}
        onMarkerClick={onMarkerClick}
      />
    </div>
  );
} 