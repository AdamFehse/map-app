import React, { useEffect, useState } from 'react';

const ProjectConnectionLine = ({ 
  isVisible, 
  galleryItemRef, 
  markerRef, 
  mapRef, 
  projectName,
  hoveredProject 
}) => {
  const [lineCoords, setLineCoords] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Reset initialization state when visibility changes
    if (!isVisible) {
      setIsInitialized(false);
      setLineCoords(null);
      return;
    }

    if (!galleryItemRef?.current || !markerRef?.current || !mapRef?.current) {
      setLineCoords(null);
      return;
    }

    const calculateLineCoords = () => {
      try {
        // Get gallery item position (bottom of screen)
        const galleryItem = galleryItemRef.current;
        const galleryRect = galleryItem.getBoundingClientRect();
        
        // Check if gallery item is properly positioned
        if (galleryRect.width === 0 || galleryRect.height === 0) {
          console.log('Gallery item not properly positioned yet');
          return;
        }
        
        const galleryX = galleryRect.left + galleryRect.width / 2;
        const galleryY = galleryRect.top; // Top of gallery item

        // Get marker position on screen
        const marker = markerRef.current;
        const map = mapRef.current;
        
        // Get the leaflet map instance
        const leafletMap = map._leaflet_map || map;
        
        if (!leafletMap) {
          console.warn('Leaflet map instance not found');
          return;
        }

        // Check if map is properly initialized
        if (!leafletMap.getSize || !leafletMap.getSize().x) {
          console.log('Map not fully initialized yet');
          return;
        }

        // Convert lat/lng to screen coordinates
        const lat = parseFloat(hoveredProject.Latitude);
        const lng = parseFloat(hoveredProject.Longitude);
        
        if (isNaN(lat) || isNaN(lng)) {
          console.warn('Invalid coordinates:', hoveredProject);
          return;
        }

        const point = leafletMap.latLngToContainerPoint([lat, lng]);
        const mapContainer = leafletMap.getContainer();
        const mapRect = mapContainer.getBoundingClientRect();
        
        // Check if map container is properly positioned
        if (mapRect.width === 0 || mapRect.height === 0) {
          console.log('Map container not properly positioned yet');
          return;
        }
        
        const markerX = mapRect.left + point.x;
        const markerY = mapRect.top + point.y;

        // Validate coordinates are within reasonable bounds
        if (markerX < 0 || markerY < 0 || markerX > window.innerWidth || markerY > window.innerHeight) {
          console.log('Marker coordinates outside viewport:', { markerX, markerY });
          return;
        }

        console.log('Line coordinates calculated:', {
          gallery: { x: galleryX, y: galleryY },
          marker: { x: markerX, y: markerY },
          project: projectName
        });

        setLineCoords({
          x1: galleryX,
          y1: galleryY,
          x2: markerX,
          y2: markerY
        });
        
        // Mark as initialized only after successful calculation
        setIsInitialized(true);

      } catch (error) {
        console.error('Error calculating line coordinates:', error);
        setLineCoords(null);
        setIsInitialized(false);
      }
    };

    // Add a small delay to ensure DOM is fully rendered
    const timeoutId = setTimeout(() => {
      calculateLineCoords();
    }, 50);

    // Recalculate on map move/zoom
    const leafletMap = mapRef.current?._leaflet_map || mapRef.current;
    if (leafletMap) {
      const handleMapUpdate = () => {
        setTimeout(calculateLineCoords, 10); // Small delay to ensure DOM is updated
      };

      leafletMap.on('zoom', handleMapUpdate);
      leafletMap.on('move', handleMapUpdate);

      return () => {
        clearTimeout(timeoutId);
        leafletMap.off('zoom', handleMapUpdate);
        leafletMap.off('move', handleMapUpdate);
      };
    }

    return () => {
      clearTimeout(timeoutId);
    };

  }, [isVisible, galleryItemRef, markerRef, mapRef, projectName, hoveredProject]);

  // Only render if visible, initialized, and have valid coordinates
  if (!isVisible || !isInitialized || !lineCoords) {
    return null;
  }

  return (
    <svg
      className="connection-line visible"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999
      }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="#3B82F6"
          />
        </marker>
      </defs>
      <line
        x1={lineCoords.x1}
        y1={lineCoords.y1}
        x2={lineCoords.x2}
        y2={lineCoords.y2}
        stroke="#3B82F6"
        strokeWidth="2"
        strokeDasharray="5,5"
        markerEnd="url(#arrowhead)"
        opacity="0.8"
      >
        <animate
          attributeName="stroke-dashoffset"
          values="0;10"
          dur="1s"
          repeatCount="indefinite"
        />
      </line>
      {/* Glow effect using existing CSS */}
      <line
        x1={lineCoords.x1}
        y1={lineCoords.y1}
        x2={lineCoords.x2}
        y2={lineCoords.y2}
        stroke="#3B82F6"
        strokeWidth="4"
        opacity="0.2"
      />
    </svg>
  );
};

export default ProjectConnectionLine;
