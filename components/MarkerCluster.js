import React, { useEffect, useRef } from "react";
import { Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { getCategoryConfig } from "./CategoryConfig";
import { createCategoryIcon } from "./MarkerIcons";
import { createPopupContent } from "./PopupUtils";
import L from 'leaflet'; // Import Leaflet

const MarkerCluster = ({ projects, onMarkerClick, selectedProject, markerRefs }) => {
  // Add global styles for cluster visibility
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .custom-cluster-icon {
        background: transparent !important;
        border: none !important;
      }
      
      .leaflet-cluster-anim .leaflet-marker-icon, 
      .leaflet-cluster-anim .leaflet-marker-shadow {
        transition: transform 0.3s ease-out, opacity 0.3s ease-in;
      }
      
      .marker-cluster {
        background: transparent !important;
        border: none !important;
      }
      
      .marker-cluster div {
        background: transparent !important;
        border: none !important;
      }
      
      .marker-cluster span {
        display: none !important;
      }

      /* Enhanced cluster badge highlighting */
      .cluster-count-badge {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: visible;
      }

      .cluster-count-badge.highlighted {
        transform: scale(1.4) !important;
        z-index: 1000 !important;
        box-shadow: 
          0 0 0 4px rgba(59, 130, 246, 0.3),
          0 0 0 8px rgba(59, 130, 246, 0.2),
          0 0 20px 4px rgba(59, 130, 246, 0.4),
          0 8px 25px rgba(0, 0, 0, 0.3) !important;
        border: 3px solid #fff !important;
        animation: cluster-highlight-pulse 4s ease-in-out infinite;
      }

      @keyframes cluster-highlight-pulse {
        0%, 100% { 
          box-shadow: 
            0 0 0 4px rgba(59, 130, 246, 0.3),
            0 0 0 8px rgba(59, 130, 246, 0.2),
            0 0 20px 4px rgba(59, 130, 246, 0.4),
            0 8px 25px rgba(0, 0, 0, 0.3);
        }
        50% { 
          box-shadow: 
            0 0 0 6px rgba(59, 130, 246, 0.4),
            0 0 0 12px rgba(59, 130, 246, 0.3),
            0 0 30px 8px rgba(59, 130, 246, 0.6),
            0 12px 35px rgba(0, 0, 0, 0.4);
        }
      }

      /* Cluster book highlighting */
      .storybook-cluster.highlighted {
        animation: book-highlight-float 2s ease-in-out infinite;
        filter: drop-shadow(0 0 15px rgba(59, 130, 246, 0.5));
      }

      @keyframes book-highlight-float {
        0%, 100% { 
          transform: translateY(-2px) rotateZ(0deg) scale(1.05);
          filter: drop-shadow(0 0 15px rgba(59, 130, 246, 0.5));
        }
        50% { 
          transform: translateY(-8px) rotateZ(2deg) scale(1.1);
          filter: drop-shadow(0 0 25px rgba(59, 130, 246, 0.7));
        }
      }

      /* Additional ripple effect for highlighted clusters */
      .cluster-count-badge.highlighted::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: ripple-effect 1.5s ease-out infinite;
        pointer-events: none;
        z-index: -1;
      }

      @keyframes ripple-effect {
        0% {
          width: 100%;
          height: 100%;
          opacity: 1;
        }
        100% {
          width: 300%;
          height: 300%;
          opacity: 0;
        }
      }

      /* Highlight the entire cluster container when badge is highlighted */
      .storybook-cluster:has(.cluster-count-badge.highlighted),
      .desert-cluster:has(.cluster-count-badge.highlighted),
      .border-cluster:has(.cluster-count-badge.highlighted) {
        animation-duration: 1.5s !important;
        filter: brightness(1.1) saturate(1.2);
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const lastHoveredMarkerRef = useRef(null); // Track last hovered marker

  if (!projects || projects.length === 0) {
    return null;
  }

  // Enhanced cluster icon creation function
  const createEnhancedClusterIcon = (cluster) => {
    const count = cluster.getChildCount();
    const childMarkers = cluster.getAllChildMarkers();
    
    // Determine the dominant category in the cluster
    const categories = childMarkers.map(marker => 
      marker.options?.project?.ProjectCategory || 
      marker.options?.projectData?.ProjectCategory ||
      'Other'
    );
    
    const categoryCounts = categories.reduce((acc, category) => {
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
    
    const dominantCategory = Object.keys(categoryCounts).reduce((a, b) => 
      categoryCounts[a] > categoryCounts[b] ? a : b
    );

    // Map dominant category to a cluster style class
    let clusterStyleClass = 'storybook-cluster'; // Default
    if (dominantCategory.includes('Environment') || dominantCategory.includes('Ecology')) {
      clusterStyleClass = 'desert-cluster';
    } else if (dominantCategory.includes('Borders') || dominantCategory.includes('Migration')) {
      clusterStyleClass = 'border-cluster';
    } else if (dominantCategory.includes('Storytelling')) {
      clusterStyleClass = 'storybook-cluster';
    }

    // Get project names and create a unique cluster identifier
    const projectNames = childMarkers
      .map(marker => {
        const projectName = 
          marker.options?.projectData?.Name || 
          marker.options?.project?.Name ||     
          marker.properties?.projectName ||    
          marker.projectData?.Name ||         
          marker._icon?.projectData?.Name;    
          
        return projectName;
      })
      .filter(Boolean);

    const projectNamesStr = projectNames.join(',');
    const config = getCategoryConfig(dominantCategory);
    
    // Create a unique cluster ID based on position and projects
    const clusterId = `cluster-${count}-${dominantCategory}-${Math.round(cluster.getLatLng().lat * 1000)}-${Math.round(cluster.getLatLng().lng * 1000)}`;
    
    // Different styles based on cluster size
    const getClusterStyle = (count) => {
      if (count >= 100) {
        return { size: 60, fontSize: '16px', style: 'mega', borderWidth: 4 };
      } else if (count >= 50) {
        return { size: 50, fontSize: '14px', style: 'large', borderWidth: 3 };
      } else if (count >= 10) {
        return { size: 42, fontSize: '13px', style: 'medium', borderWidth: 3 };
      } else {
        return { size: 36, fontSize: '12px', style: 'small', borderWidth: 2 };
      }
    };

    const clusterStyle = getClusterStyle(count);
    
    // Enhanced storybook style with better highlighting support
    const storybookStyle = `
      <style>
        @keyframes book-float {
          0%, 100% { transform: translateY(-1px) rotateZ(0deg) scale(1.02); }
          50% { transform: translateY(-4px) rotateZ(1deg) scale(1.04); }
        }
      </style>
      <div class="${clusterStyleClass}" 
           id="${clusterId}"
           data-project-names="${projectNamesStr}"
           data-category="${dominantCategory}"
           data-count="${count}"
           style="
        position: relative;
        width: ${clusterStyle.size}px;
        height: ${clusterStyle.size}px;
        cursor: pointer;
        background: #f5e6c8;
        border-radius: 14px;
        box-shadow: 0 4px 16px rgba(160,120,60,0.18);
        border: 2px solid #e0c48a;
        animation: book-float 3s ease-in-out infinite;
      ">
        <div class="cluster-count-badge ${dominantCategory.toLowerCase()}-badge cluster-badge-${clusterId}" 
             id="badge-${clusterId}"
             data-cluster-id="${clusterId}"
             data-category="${dominantCategory}"
             data-count="${count}"
             data-project-names="${projectNamesStr}"
             style="
          position: absolute;
          top: -18px;
          left: -18px;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: bold;
          border: 3px solid #fffbe6;
          box-shadow: 0 3px 10px rgba(0,0,0,0.18);
          z-index: 30;
          background: #e0c48a;
          color: #7a5c1e;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: auto;
        ">${count}</div>
        <div style="
          position: absolute;
          left: 50%;
          bottom: 6px;
          transform: translateX(-50%);
          font-size: 20px;
          z-index: 20;
        ">📖</div>
      </div>
    `;

    // Desert style: cactus and setting sun
    const desertStyle = `
      <style>
        @keyframes sun-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.18); opacity: 0.7; }
        }
      </style>
      <div class="${clusterStyleClass}" 
           id="${clusterId}"
           data-project-names="${projectNamesStr}"
           data-category="${dominantCategory}"
           data-count="${count}"
           style="
        position: relative;
        width: ${clusterStyle.size}px;
        height: ${clusterStyle.size}px;
        cursor: pointer;
        background: #fff7d6;
        border-radius: 14px;
        box-shadow: 0 4px 16px rgba(220,180,60,0.18);
        border: 2px solid #ffe082;
      ">
        <div class="cluster-count-badge ${dominantCategory.toLowerCase()}-badge cluster-badge-${clusterId}" 
             id="badge-${clusterId}"
             data-cluster-id="${clusterId}"
             data-category="${dominantCategory}"
             data-count="${count}"
             data-project-names="${projectNamesStr}"
             style="
          position: absolute;
          top: -18px;
          left: -18px;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: bold;
          border: 3px solid #fffbe6;
          box-shadow: 0 3px 10px rgba(0,0,0,0.18);
          z-index: 30;
          background: #ffe082;
          color: #a67c1e;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: auto;
        ">${count}</div>
        <span style="
          position: absolute;
          left: 50%;
          bottom: 2px;
          transform: translateX(-50%) translateY(40%);
          font-size: 28px;
          z-index: 10;
          animation: sun-pulse 2.8s infinite;
          pointer-events: none;
        ">☀️</span>
        <div style="
          position: absolute;
          left: 50%;
          bottom: 6px;
          transform: translateX(-50%);
          font-size: 22px;
          z-index: 20;
        ">🌵</div>
      </div>
    `;

    // Border crossing style: people walking
    const borderCrossingStyle = `
      <style>
        @keyframes person1-walk {
          0% { left: 70%; opacity: 0; }
          10% { opacity: 1; }
          80% { opacity: 1; }
          100% { left: 0%; opacity: 0; }
        }
        @keyframes person2-walk {
          0% { left: 70%; opacity: 0; }
          20% { opacity: 0; }
          30% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 0%; opacity: 0; }
        }
      </style>
      <div class="${clusterStyleClass}" 
           id="${clusterId}"
           data-project-names="${projectNamesStr}"
           data-category="${dominantCategory}"
           data-count="${count}"
           style="
        position: relative;
        width: ${clusterStyle.size}px;
        height: ${clusterStyle.size}px;
        cursor: pointer;
        background: #fff7d6;
        border-radius: 14px;
        box-shadow: 0 4px 16px rgba(220,180,60,0.18);
        border: 2px solid #ffe082;
      ">
        <div class="cluster-count-badge ${dominantCategory.toLowerCase()}-badge cluster-badge-${clusterId}" 
             id="badge-${clusterId}"
             data-cluster-id="${clusterId}"
             data-category="${dominantCategory}"
             data-count="${count}"
             data-project-names="${projectNamesStr}"
             style="
          position: absolute;
          top: -18px;
          left: -18px;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: bold;
          border: 3px solid #fffbe6;
          box-shadow: 0 3px 10px rgba(0,0,0,0.18);
          z-index: 30;
          background: #ffe082;
          color: #a67c1e;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: auto;
        ">${count}</div>
        <span style="
          position: absolute;
          left: 70%;
          bottom: 6px;
          font-size: 22px;
          z-index: 20;
          animation: person1-walk 3.8s linear infinite;
          white-space: nowrap;
        ">🚶🏽‍♂️</span>
        <span style="
          position: absolute;
          left: 70%;
          bottom: 6px;
          font-size: 22px;
          z-index: 20;
          animation: person2-walk 3.8s linear infinite;
          animation-delay: 1.9s;
          white-space: nowrap;
        ">🚶🏾‍♀️</span>
      </div>
    `;

    // Return the correct style based on cluster size
    if (count >= 15) {
      return L.divIcon({
        html: storybookStyle,
        className: 'custom-cluster-icon',
        iconSize: [clusterStyle.size, clusterStyle.size],
      });
    } else if (count >= 10) {
      return L.divIcon({
        html: desertStyle,
        className: 'custom-cluster-icon',
        iconSize: [clusterStyle.size, clusterStyle.size],
      });
    } else {
      return L.divIcon({
        html: borderCrossingStyle,
        className: 'custom-cluster-icon',
        iconSize: [clusterStyle.size, clusterStyle.size],
      });
    }
  };

  return (
    <MarkerClusterGroup
      chunkedLoading
      maxClusterRadius={60}
      spiderfyOnMaxZoom={true}
      showCoverageOnHover={false}
      zoomToBoundsOnClick={true}
      removeOutsideVisibleBounds={true}
      animate={true}
      animateAddingMarkers={true}
      disableClusteringAtZoom={10}
      iconCreateFunction={createEnhancedClusterIcon}
    >
      {projects.map((project, index) => {
        const category = project.ProjectCategory || 'Other';
        const config = getCategoryConfig(category);
        
        // Ensure marker has the project data attached for cluster function to access
        const markerElement = (
          <Marker
            key={`${project.Name}-${index}`}
            position={[project.Latitude, project.Longitude]}
            icon={createCategoryIcon(category, false, false, project)}
            eventHandlers={{
              mouseover: (e) => {
                const marker = e.target;
                // Reset previous expanded marker
                if (lastHoveredMarkerRef.current && lastHoveredMarkerRef.current !== marker) {
                  const prevProject = lastHoveredMarkerRef.current.projectData;
                  const prevCategory = prevProject?.ProjectCategory || 'Other';
                  lastHoveredMarkerRef.current.setIcon(createCategoryIcon(prevCategory, false, false, prevProject));
                }
                // Expand current marker
                marker.setIcon(createCategoryIcon(category, true, false, project));
                lastHoveredMarkerRef.current = marker;
                if (marker && marker.openPopup) {
                  marker.openPopup();
                }
              },
              mouseout: (e) => {
                const marker = e.target;
                marker.setIcon(createCategoryIcon(category, false, false, project));
                if (lastHoveredMarkerRef.current === marker) {
                  lastHoveredMarkerRef.current = null;
                }
                if (marker && marker.closePopup) {
                  marker.closePopup();
                }
              },
              click: () => {
                if (onMarkerClick) {
                  onMarkerClick(project);
                }
              }
            }}
            ref={ref => {
              if (ref) {
                const key = `${project.Name}-${index}`;
                markerRefs.current[key] = ref;
                // Attach project data directly to the marker instance for cluster access
                ref.options.projectData = project;
              }
            }}
          >
            <Popup
              closeButton={true}
              autoPan={true}
              maxWidth={300}
            >
              <div dangerouslySetInnerHTML={{ __html: createPopupContent(project) }} />
            </Popup>
          </Marker>
        );

        return markerElement;
      })}
    </MarkerClusterGroup>
  );
};

export default MarkerCluster;