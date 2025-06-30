import React, { useState, useRef, useEffect } from "react";
import { useDarkMode } from "../contexts/DarkModeContext";
import { getCategoryConfig } from "./CategoryConfig";
import { createCategoryIcon } from "./MarkerIcons";
import ProjectGalleryCardDropdown from './ProjectGalleryCardDropdown';

const SEARCH_BAR_WIDTH = 280;
const SEARCH_BAR_LEFT = 50;
const SEARCH_BAR_TOP = 20;

// Category Marker Highlighter Component
const CategoryMarkerHighlighter = ({ 
  activeCategory, 
  filteredProjects, 
  markerRefs, 
  mapRef,
  isVisible = false 
}) => {
  const [highlightedMarkers, setHighlightedMarkers] = useState([]);
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    if (!isVisible || !activeCategory || activeCategory === 'all' || activeCategory === 'local') {
      setHighlightedMarkers([]);
      return;
    }

    // Find all projects in the selected category
    const categoryProjects = filteredProjects.filter(
      project => (project.ProjectCategory || 'Other') === activeCategory
    );

    // Get marker references for these projects
    const markers = categoryProjects.map(project => {
      const originalIndex = filteredProjects.findIndex(
        (p) => p.Name === project.Name && 
               parseFloat(p.Latitude) === parseFloat(project.Latitude) && 
               parseFloat(p.Longitude) === parseFloat(project.Longitude)
      );
      const key = `${project.Name}-${originalIndex}`;
      return {
        project,
        markerRef: markerRefs?.current[key],
        key
      };
    }).filter(item => item.markerRef);

    setHighlightedMarkers(markers);

    // Highlight markers with selected state
    markers.forEach(({ markerRef, project }) => {
      if (markerRef) {
        const projectCategory = project.ProjectCategory || 'Other';
        const selectedIcon = createCategoryIcon(projectCategory, true, false, project);
        markerRef.setIcon(selectedIcon);
      }
    });

    // Cleanup function to reset markers when category changes
    return () => {
      markers.forEach(({ markerRef, project }) => {
        if (markerRef) {
          const projectCategory = project.ProjectCategory || 'Other';
          const defaultIcon = createCategoryIcon(projectCategory, false, false, project);
          markerRef.setIcon(defaultIcon);
        }
      });
    };
  }, [activeCategory, filteredProjects, markerRefs, isVisible]);

  return null; // This component only handles marker highlighting
};

export default function SearchBar({
  onSearch,
  searchTerm,
  setSearchTerm,
  filteredProjects = [],
  isInSidebar = false,
  closeOnSelect = true,
  onTabChange = null,
  onMenuClick = null,
  markerRefs = null,
  mapRef = null,
  mapBounds = null,
  onMarkerClick = null,
  isLayoutOpen = false,
  showDropdown = false,
  setShowDropdown = () => {},
  justRestoredAt = 0,
}) {
  const [activeTab, setActiveTab] = useState('all');
  const [hoveredProject, setHoveredProject] = useState(null);
  const [lastSelectedProject, setLastSelectedProject] = useState(null);
  const [visibleProjects, setVisibleProjects] = useState([]);
  const [isFlying, setIsFlying] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ left: SEARCH_BAR_LEFT, top: SEARCH_BAR_TOP + 60 });
  const inputRef = useRef(null);
  const { isDarkMode } = useDarkMode();

  // Calculate optimal dropdown position based on map view
  const calculateDropdownPosition = () => {
    return { left: SEARCH_BAR_LEFT, top: SEARCH_BAR_TOP + 60 };
  };

  // Update dropdown position when map changes
  useEffect(() => {
    if (showDropdown) {
      const newPosition = calculateDropdownPosition();
      setDropdownPosition(newPosition);
    }
  }, [showDropdown, mapRef]);

  // Filter projects based on map bounds (exactly like ProjectGallery)
  useEffect(() => {
    if (!filteredProjects) {
      setVisibleProjects([]);
      return;
    }

    // If no map bounds, show all projects
    if (!mapBounds) {
      setVisibleProjects(filteredProjects);
      return;
    }

    // Don't update visible projects while flying to prevent dropdown from closing
    if (isFlying) {
      return;
    }

    const filtered = filteredProjects.filter(project => {
      const lat = parseFloat(project.Latitude);
      const lng = parseFloat(project.Longitude);
      
      // Check if coordinates are valid
      if (isNaN(lat) || isNaN(lng)) {
        return false;
      }
      
      // Use contains method if available, otherwise use manual bounds check
      const isInBounds = mapBounds.contains ? 
        mapBounds.contains([lat, lng]) :
        lat >= mapBounds.south && 
        lat <= mapBounds.north && 
        lng >= mapBounds.west && 
        lng <= mapBounds.east;
      
      return isInBounds;
    });

    // If no projects in view, show all projects as fallback
    if (filtered.length === 0 && filteredProjects.length > 0) {
      setVisibleProjects(filteredProjects);
    } else {
      setVisibleProjects(filtered);
    }
  }, [filteredProjects, mapBounds, isFlying]);

  // Get unique categories from projects
  const getCategories = () => {
    const categories = [...new Set(filteredProjects.map(p => p.ProjectCategory || 'Other'))];
    return ['all', 'local', ...categories.sort()];
  };

  // Filter projects by active tab
  const getProjectsByTab = () => {
    if (activeTab === 'all') return filteredProjects;
    if (activeTab === 'local') return visibleProjects;
    
    // For category tabs, always filter within local view context
    // This ensures we're showing only visible projects in the selected category
    return visibleProjects.filter(p => (p.ProjectCategory || 'Other') === activeTab);
  };

  // Handle tab selection
  const handleTabSelect = (category) => {
    setActiveTab(category);
    
    // If selecting a category tab, we're effectively in "local view" mode
    // but showing only that category within the local view
    console.log(`Selected tab: ${category} - filtering within local view`);
  };

  const handleProjectSelect = (project) => {
    if (mapRef?.current) {
      const map = mapRef.current._leaflet_map || mapRef.current;
      if (map) {
        // Find the marker to check if it's individually visible
        const originalIndex = filteredProjects.findIndex(
          (p) => p.Name === project.Name && 
                 parseFloat(p.Latitude) === parseFloat(project.Latitude) && 
                 parseFloat(p.Longitude) === parseFloat(project.Longitude)
        );
        
        if (originalIndex !== -1) {
          const key = `${project.Name}-${originalIndex}`;
          const marker = markerRefs?.current[key];
          
          // Check if marker is individually visible (can show popup)
          const isMarkerVisible = marker && marker.getElement && marker.getElement();
          
          if (isMarkerVisible) {
            // If marker is individually visible, open ProjectGalleryLayout
            if (onMarkerClick) {
              onMarkerClick(project);
            }
          } else {
            // If marker is clustered, fly to the location
            const lat = parseFloat(project.Latitude);
            const lng = parseFloat(project.Longitude);
            const targetZoom = 12;

            if (!isNaN(lat) && !isNaN(lng)) {
              setIsFlying(true);
              
              // Basic flyTo: center directly on the clicked project
              map.flyTo([lat, lng], targetZoom, {
                duration: 1.5,
                easeLinearity: 0.25
              });
              
              setTimeout(() => {
                setIsFlying(false);
                // Find the marker again after the flyTo
                const markerAfterFly = markerRefs?.current[key];
                if (markerAfterFly && markerAfterFly.openPopup) {
                  markerAfterFly.openPopup();
                  
                  // Also highlight the marker
                  const projectCategory = project.ProjectCategory || 'Other';
                  const selectedIcon = createCategoryIcon(projectCategory, true, false, project);
                  markerAfterFly.setIcon(selectedIcon);
                }
              }, 1600); // Slightly longer than the flyTo duration to ensure it's complete
            }
          }
        }
      }
    }
  };

  const handleDropdownClose = () => {
    setShowDropdown(false);
  };

  const handleProjectHover = (project) => {
    setHoveredProject(project);
    const originalIndex = filteredProjects.findIndex(
      (p) => p.Name === project.Name && 
             parseFloat(p.Latitude) === parseFloat(project.Latitude) && 
             parseFloat(p.Longitude) === parseFloat(project.Longitude)
    );
    if (originalIndex !== -1) {
      const key = `${project.Name}-${originalIndex}`;
      const marker = markerRefs?.current[key];
      if (marker) {
        const projectCategory = project.ProjectCategory || 'Other';
        const selectedIcon = createCategoryIcon(projectCategory, true, false, project);
        marker.setIcon(selectedIcon);
        
        // Only open popup if the marker is individually visible
        const isMarkerVisible = marker.getElement && marker.getElement();
        if (isMarkerVisible) {
            console.log('SearchBar hover - Opening popup for:', project.Name);
            marker.openPopup();
        }
      }
    }
  };

  const handleProjectLeave = (project) => {
    if (justRestoredAt && Date.now() - justRestoredAt < 300) {
      console.log('[SearchBar] handleProjectLeave ignored due to justRestoredAt');
      return;
    }
    console.log('[SearchBar] handleProjectLeave called for:', project?.Name);
    setHoveredProject(null);
    const originalIndex = filteredProjects.findIndex(
      (p) => p.Name === project.Name && 
             parseFloat(p.Latitude) === parseFloat(project.Latitude) && 
             parseFloat(p.Longitude) === parseFloat(project.Longitude)
    );
    if (originalIndex !== -1) {
      const key = `${project.Name}-${originalIndex}`;
      const marker = markerRefs?.current[key];
      if (marker) {
        const projectCategory = project.ProjectCategory || 'Other';
        const defaultIcon = createCategoryIcon(projectCategory, false, false, project);
        marker.setIcon(defaultIcon);

        // Only close popup if the marker is individually visible
        const isMarkerVisible = marker.getElement && marker.getElement();
        if (isMarkerVisible) {
            console.log('SearchBar leave - Closing popup for:', project.Name);
            marker.closePopup();
        }
      }
    }
  };

  const handleInputFocus = () => {
    setShowDropdown(true);
    setTimeout(() => {
      const newPosition = calculateDropdownPosition();
      setDropdownPosition(newPosition);
    }, 100);
  };

  return (
    <>
      {/* Search Bar */}
      <div
        style={{
          position: isInSidebar ? "relative" : "absolute",
          top: isInSidebar ? "auto" : SEARCH_BAR_TOP,
          left: isInSidebar ? "auto" : dropdownPosition.left,
          zIndex: isInSidebar ? "auto" : 1000,
          width: isInSidebar ? "100%" : SEARCH_BAR_WIDTH,
        }}
      >
        <div
          style={{
            width: "100%",
            background: isDarkMode ? "#181c24" : "#ffffff",
            borderRadius: 14,
            boxShadow: isDarkMode 
              ? "0 2px 12px rgba(0,0,0,0.13)" 
              : "0 2px 12px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            padding: "0 10px",
            minHeight: 48,
            border: isDarkMode ? "1.5px solid #23293a" : "1.5px solid #e0e0e0",
          }}
        >
          {/* Menu button */}
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "8px",
                marginRight: "8px",
                color: isDarkMode ? "#fff" : "#000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDarkMode ? "#23293a" : "#f5f5f5";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
              title="Open sidebar"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          )}
          
          <input
            ref={inputRef}
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={handleInputFocus}
            style={{
              border: "none",
              outline: "none",
              fontSize: 17,
              width: "100%",
              background: "transparent",
              color: isDarkMode ? "#fff" : "#000",
              padding: "12px 0",
              fontWeight: 500,
            }}
          />
        </div>
      </div>

      {/* Category Marker Highlighter */}
      <CategoryMarkerHighlighter
        activeCategory={activeTab}
        filteredProjects={filteredProjects}
        markerRefs={markerRefs}
        mapRef={mapRef}
        isVisible={showDropdown && activeTab !== 'all' && activeTab !== 'local'}
      />

      {/* Dropdown */}
      {showDropdown && !isLayoutOpen && (
        <ProjectGalleryCardDropdown
          isOpen={showDropdown}
          onClose={handleDropdownClose}
          projects={getProjectsByTab ? getProjectsByTab() : filteredProjects}
          allProjects={filteredProjects}
          markerRefs={markerRefs}
          mapBounds={mapBounds}
          mapRef={mapRef}
          onMarkerHover={handleProjectHover}
          onMarkerLeave={handleProjectLeave}
          onMarkerClick={handleProjectSelect}
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: 400,
            borderRadius: 16,
            boxShadow: isDarkMode 
              ? '0 8px 32px rgba(0,0,0,0.22)' 
              : '0 8px 32px rgba(0,0,0,0.1)',
            background: isDarkMode ? '#181c24' : '#ffffff',
          }}
          justRestored={justRestoredAt}
        />
      )}
    </>
  );
}

// Helper function for more accurate longitude span calculation
const calculateLongitudeSpan = (map, targetZoom, latitude) => {
  const currentBounds = map.getBounds();
  const currentZoom = map.getZoom();
  const mapContainer = map.getContainer();
  const mapWidth = mapContainer.offsetWidth;
  
  // More accurate calculation considering Mercator projection
  const metersPerPixel = 156543.03392 * Math.cos(latitude * Math.PI / 180) / Math.pow(2, targetZoom);
  const metersWidth = mapWidth * metersPerPixel;
  
  // Convert meters to longitude degrees (approximate)
  const metersPerLngDegree = 111320 * Math.cos(latitude * Math.PI / 180);
  const lngSpan = metersWidth / metersPerLngDegree;
  
  return lngSpan;
};
