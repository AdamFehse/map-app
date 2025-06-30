import React, { useEffect, useState } from 'react';

const ProjectConnectionGlow = ({ 
  isVisible, 
  galleryItemRef, 
  markerRef, 
  mapRef, 
  projectName,
  hoveredProject 
}) => {
  const [glowCoords, setGlowCoords] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Reset initialization state when visibility changes
    if (!isVisible) {
      setIsInitialized(false);
      setGlowCoords(null);
      return;
    }

    if (!galleryItemRef?.current || !mapRef?.current) {
      setGlowCoords(null);
      return;
    }

    const calculateGlowCoords = () => {
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
        const galleryY = galleryRect.top + galleryRect.height / 2;

        // Get marker or cluster position on screen
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

        // First try to find the individual marker
        const marker = markerRef?.current;
        let targetX, targetY;

        if (marker && marker._icon) {
          // If marker is visible, use its position
          const markerIcon = marker._icon;
          const markerRect = markerIcon.getBoundingClientRect();
          targetX = markerRect.left + markerRect.width / 2;
          targetY = markerRect.top + markerRect.height / 2;
        } else {
          // If marker is not visible (probably in a cluster), find the cluster
          const clusters = document.querySelectorAll('.marker-cluster');
          let targetCluster = null;

          // Try to find the cluster containing our project
          for (const cluster of clusters) {
            // Get the cluster's marker group
            const clusterMarker = cluster.closest('.leaflet-marker-icon');
            if (!clusterMarker) continue;

            // Get the cluster's position
            const clusterRect = clusterMarker.getBoundingClientRect();
            if (clusterRect.width === 0 || clusterRect.height === 0) continue;

            // Use this cluster's position
            targetCluster = clusterMarker;
            break;
          }

          if (targetCluster) {
            const clusterRect = targetCluster.getBoundingClientRect();
            targetX = clusterRect.left + clusterRect.width / 2;
            targetY = clusterRect.top + clusterRect.height / 2;
          } else {
            // If no cluster found, use the project's coordinates
            const lat = parseFloat(hoveredProject.Latitude);
            const lng = parseFloat(hoveredProject.Longitude);
            
            if (isNaN(lat) || isNaN(lng)) {
              console.warn('Invalid coordinates:', hoveredProject);
              return;
            }

            const point = leafletMap.latLngToContainerPoint([lat, lng]);
            const mapContainer = leafletMap.getContainer();
            const mapRect = mapContainer.getBoundingClientRect();
            
            targetX = mapRect.left + point.x;
            targetY = mapRect.top + point.y;
          }
        }

        // Validate coordinates are within reasonable bounds
        if (targetX < 0 || targetY < 0 || targetX > window.innerWidth || targetY > window.innerHeight) {
          console.log('Target coordinates outside viewport:', { targetX, targetY });
          return;
        }

        console.log('Glow coordinates calculated:', {
          target: { x: targetX, y: targetY },
          project: projectName
        });

        setGlowCoords({
          targetX,
          targetY
        });
        
        // Mark as initialized only after successful calculation
        setIsInitialized(true);

      } catch (error) {
        console.error('Error calculating glow coordinates:', error);
        setGlowCoords(null);
        setIsInitialized(false);
      }
    };

    // Add a small delay to ensure DOM is fully rendered
    const timeoutId = setTimeout(() => {
      calculateGlowCoords();
    }, 50);

    // Recalculate on map move/zoom
    const leafletMap = mapRef.current?._leaflet_map || mapRef.current;
    if (leafletMap) {
      const handleMapUpdate = () => {
        setTimeout(calculateGlowCoords, 10); // Small delay to ensure DOM is updated
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
  if (!isVisible || !isInitialized || !glowCoords) {
    return null;
  }

  return (
    <div
      className="cluster-highlight"
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
      {/* Target (marker/cluster) glow - Multiple layers for intense highlight */}
      <div
        className="glow-point target-glow-outer"
        style={{
          position: 'absolute',
          left: glowCoords.targetX - 35,
          top: glowCoords.targetY - 35,
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.1) 40%, transparent 70%)',
          animation: 'pulse-glow-slow 3s ease-in-out infinite alternate'
        }}
      />
      
      <div
        className="glow-point target-glow-mid"
        style={{
          position: 'absolute',
          left: glowCoords.targetX - 25,
          top: glowCoords.targetY - 25,
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, rgba(59, 130, 246, 0.3) 40%, rgba(59, 130, 246, 0.1) 70%, transparent 100%)',
          animation: 'pulse-glow 2s ease-in-out infinite alternate',
          animationDelay: '0.3s'
        }}
      />
      
      <div
        className="glow-point target-glow-inner"
        style={{
          position: 'absolute',
          left: glowCoords.targetX - 15,
          top: glowCoords.targetY - 15,
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.9) 0%, rgba(59, 130, 246, 0.5) 50%, transparent 100%)',
          animation: 'pulse-glow-fast 1.5s ease-in-out infinite alternate',
          animationDelay: '0.6s'
        }}
      />
      
      <style jsx>{`
        @keyframes pulse-glow {
          0% {
            transform: scale(1);
            opacity: 0.7;
          }
          100% {
            transform: scale(1.3);
            opacity: 1;
          }
        }
        
        @keyframes pulse-glow-slow {
          0% {
            transform: scale(1);
            opacity: 0.4;
          }
          100% {
            transform: scale(1.2);
            opacity: 0.7;
          }
        }
        
        @keyframes pulse-glow-fast {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.4);
            opacity: 1;
          }
        }
        
        .glow-point {
          filter: blur(0.5px);
        }
      `}</style>
    </div>
  );
};

export default ProjectConnectionGlow;