import React, { useEffect, useState } from 'react';

const ClusterHighlighter = ({ 
  isVisible, 
  galleryItemRef, 
  markerRef, 
  mapRef, 
  hoveredProject 
}) => {
  const [targetClusterBadge, setTargetClusterBadge] = useState(null);

  useEffect(() => {
    let currentBadge = null;
    let parent = null;

    const cleanup = () => {
      if (currentBadge) {
        currentBadge.classList.remove('highlighted');
      }
      if (parent) {
        parent.classList.remove('highlighted');
      }
    };

    if (!isVisible) {
      cleanup();
      return;
    }

    if (!galleryItemRef?.current || !mapRef?.current || !hoveredProject) {
      cleanup();
      return;
    }

    const highlightLogic = () => {
      // Clean up previous highlight before running again
      cleanup();

      try {
        const map = mapRef.current._leaflet_map || mapRef.current;
        if (!map) return;

        // Do not run if marker is individually visible
        const marker = markerRef?.current;
        if (marker && marker._icon) {
          return;
        }

        const lat = parseFloat(hoveredProject.Latitude);
        const lng = parseFloat(hoveredProject.Longitude);
        if (isNaN(lat) || isNaN(lng)) return;

        const point = map.latLngToContainerPoint([lat, lng]);
        const mapContainer = map.getContainer();
        const mapRect = mapContainer.getBoundingClientRect();
        const projectScreenX = mapRect.left + point.x;
        const projectScreenY = mapRect.top + point.y;

        const clusterBadges = document.querySelectorAll('.cluster-count-badge');
        let closestBadge = null;
        let minDistance = Infinity;

        clusterBadges.forEach(badge => {
          const badgeRect = badge.getBoundingClientRect();
          if (badgeRect.width === 0) return;

          const badgeCenterX = badgeRect.left + badgeRect.width / 2;
          const badgeCenterY = badgeRect.top + badgeRect.height / 2;
          const distance = Math.sqrt(Math.pow(projectScreenX - badgeCenterX, 2) + Math.pow(projectScreenY - badgeCenterY, 2));

          if (distance < minDistance && distance < 100) {
            minDistance = distance;
            closestBadge = badge;
          }
        });

        if (closestBadge) {
          currentBadge = closestBadge;
          currentBadge.classList.add('highlighted');
          
          parent = currentBadge.closest('.storybook-cluster, .desert-cluster, .border-cluster');
          if (parent) {
            parent.classList.add('highlighted');
          }
          setTargetClusterBadge(currentBadge);
        }

      } catch (error) {
        console.error('Error in ClusterHighlighter:', error);
      }
    };

    const timeoutId = setTimeout(highlightLogic, 50);

    const leafletMap = mapRef.current?._leaflet_map || mapRef.current;
    if (leafletMap) {
      leafletMap.on('zoomend', highlightLogic);
      leafletMap.on('moveend', highlightLogic);
    }

    return () => {
      clearTimeout(timeoutId);
      if (leafletMap) {
        leafletMap.off('zoomend', highlightLogic);
        leafletMap.off('moveend', highlightLogic);
      }
      cleanup();
    };

  }, [isVisible, galleryItemRef, markerRef, mapRef, hoveredProject]);

  return null; // This component only handles logic, it doesn't render anything
};

export default ClusterHighlighter; 