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
  const [targetClusterBadge, setTargetClusterBadge] = useState(null);

  useEffect(() => {
    // Reset initialization state when visibility changes
    if (!isVisible) {
      setIsInitialized(false);
      setLineCoords(null);
      setTargetClusterBadge(null);
      return;
    }

    if (!galleryItemRef?.current || !mapRef?.current) {
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
        let targetX, targetY, foundBadge = null;

        if (marker && marker._icon) {
          // If marker is visible, use its position
          const markerIcon = marker._icon;
          const markerRect = markerIcon.getBoundingClientRect();
          targetX = markerRect.left + markerRect.width / 2;
          targetY = markerRect.top + markerRect.height / 2;
        } else {
          // If marker is not visible (probably in a cluster), find the cluster
          // Enhanced cluster finding with badge targeting
          const lat = parseFloat(hoveredProject.Latitude);
          const lng = parseFloat(hoveredProject.Longitude);
          
          if (isNaN(lat) || isNaN(lng)) {
            console.warn('Invalid coordinates:', hoveredProject);
            return;
          }

          const point = leafletMap.latLngToContainerPoint([lat, lng]);
          const mapContainer = leafletMap.getContainer();
          const mapRect = mapContainer.getBoundingClientRect();
          
          const projectScreenX = mapRect.left + point.x;
          const projectScreenY = mapRect.top + point.y;

          // Find the closest cluster badge
          const clusterBadges = document.querySelectorAll('.cluster-count-badge');
          let closestBadge = null;
          let minDistance = Infinity;

          clusterBadges.forEach(badge => {
            const badgeRect = badge.getBoundingClientRect();
            const badgeCenterX = badgeRect.left + badgeRect.width / 2;
            const badgeCenterY = badgeRect.top + badgeRect.height / 2;
            
            // Calculate distance from project to badge center
            const distance = Math.sqrt(
              Math.pow(projectScreenX - badgeCenterX, 2) + 
              Math.pow(projectScreenY - badgeCenterY, 2)
            );
            
            if (distance < minDistance && distance < 100) { // Only consider badges within 100px
              minDistance = distance;
              closestBadge = badge;
            }
          });

          if (closestBadge) {
            const badgeRect = closestBadge.getBoundingClientRect();
            targetX = badgeRect.left + badgeRect.width / 2;
            targetY = badgeRect.top + badgeRect.height / 2;
            foundBadge = closestBadge;
            
            // Highlight the cluster badge
            closestBadge.classList.add('highlighted');
            
            // Also highlight the parent cluster if it exists
            const parentCluster = closestBadge.closest('.storybook-cluster, .desert-cluster, .border-cluster');
            if (parentCluster) {
              parentCluster.classList.add('highlighted');
            }
          } else {
            // Fallback to project coordinates
            targetX = projectScreenX;
            targetY = projectScreenY;
          }
        }

        // Validate coordinates are within reasonable bounds
        if (targetX < 0 || targetY < 0 || targetX > window.innerWidth || targetY > window.innerHeight) {
          console.log('Target coordinates outside viewport:', { targetX, targetY });
          return;
        }

        console.log('Line coordinates calculated:', {
          gallery: { x: galleryX, y: galleryY },
          target: { x: targetX, y: targetY },
          project: projectName,
          hasClusterBadge: !!foundBadge
        });

        setLineCoords({
          x1: galleryX,
          y1: galleryY,
          x2: targetX,
          y2: targetY
        });
        
        setTargetClusterBadge(foundBadge);
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
        setTimeout(calculateLineCoords, 10);
      };

      leafletMap.on('zoom', handleMapUpdate);
      leafletMap.on('move', handleMapUpdate);

      return () => {
        clearTimeout(timeoutId);
        leafletMap.off('zoom', handleMapUpdate);
        leafletMap.off('move', handleMapUpdate);
        
        // Clean up cluster badge highlighting
        if (targetClusterBadge) {
          targetClusterBadge.classList.remove('highlighted');
          const parentCluster = targetClusterBadge.closest('.storybook-cluster, .desert-cluster, .border-cluster');
          if (parentCluster) {
            parentCluster.classList.remove('highlighted');
          }
        }
      };
    }

    return () => {
      clearTimeout(timeoutId);
      // Clean up cluster badge highlighting
      if (targetClusterBadge) {
        targetClusterBadge.classList.remove('highlighted');
        const parentCluster = targetClusterBadge.closest('.storybook-cluster, .desert-cluster, .border-cluster');
        if (parentCluster) {
          parentCluster.classList.remove('highlighted');
        }
      }
    };

  }, [isVisible, galleryItemRef, markerRef, mapRef, projectName, hoveredProject]);

  // Clean up highlighting when component unmounts or visibility changes
  useEffect(() => {
    return () => {
      if (targetClusterBadge) {
        targetClusterBadge.classList.remove('highlighted');
        const parentCluster = targetClusterBadge.closest('.storybook-cluster, .desert-cluster, .border-cluster');
        if (parentCluster) {
          parentCluster.classList.remove('highlighted');
        }
      }
    };
  }, [targetClusterBadge]);

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
        {/* Enhanced gradient with cluster badge color */}
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: targetClusterBadge ? '#F59E0B' : '#8B5CF6', stopOpacity: 1 }} />
        </linearGradient>
        
        {/* Enhanced glow filter */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="
            1 0 0 0 0
            0 1 0 0 0
            0 0 1 0 0
            0 0 0 20 -8
          " result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Enhanced arrow marker */}
        <marker
          id="arrowhead"
          markerWidth="14"
          markerHeight="10"
          refX="12"
          refY="5"
          orient="auto"
        >
          <path
            d="M0 0, L14 5, L0 10 L4 5 Z"
            fill="url(#lineGradient)"
            filter="url(#glow)"
          />
        </marker>
      </defs>

      {/* Enhanced glow effect base */}
      <line
        x1={lineCoords.x1}
        y1={lineCoords.y1}
        x2={lineCoords.x2}
        y2={lineCoords.y2}
        stroke="url(#lineGradient)"
        strokeWidth="10"
        strokeLinecap="round"
        opacity="0.3"
        filter="url(#glow)"
      />

      {/* Main line with enhanced animation */}
      <line
        x1={lineCoords.x1}
        y1={lineCoords.y1}
        x2={lineCoords.x2}
        y2={lineCoords.y2}
        stroke="url(#lineGradient)"
        strokeWidth="3"
        strokeDasharray="8,6"
        markerEnd="url(#arrowhead)"
        filter="url(#glow)"
        opacity="0.9"
      >
        <animate
          attributeName="stroke-dashoffset"
          values="0;14"
          dur="1.2s"
          repeatCount="indefinite"
        />
      </line>

      {/* Enhanced pulse effect at cluster end */}
      <circle
        cx={lineCoords.x2}
        cy={lineCoords.y2}
        r="8"
        fill="url(#lineGradient)"
        opacity="0.7"
        filter="url(#glow)"
      >
        <animate
          attributeName="r"
          values="4;12;4"
          dur="1.2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.7;0;0.7"
          dur="1.2s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
};

export default ProjectConnectionLine;