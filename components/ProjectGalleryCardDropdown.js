import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDarkMode } from '../contexts/DarkModeContext';
import ClusterHighlighter from './ClusterHighlighter';
import { createCategoryIcon } from './MarkerIcons';
import { getCategoryConfig } from './CategoryConfig';

const ProjectGalleryCardDropdown = ({ 
  isOpen, 
  onClose, 
  projects = [],
  allProjects = [],
  markerRefs,
  mapBounds,
  mapRef,
  onMarkerHover,
  onMarkerLeave,
  onMarkerClick,
  style = {},
  onDropdownProjectHover,
  justRestoredAt = 0
}) => {
  const [hoveredProject, setHoveredProject] = useState(null);
  const [visibleProjects, setVisibleProjects] = useState([]);
  const [lastSelectedProject, setLastSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState('local');
  const dropdownRef = useRef(null);
  const galleryItemRefs = useRef({});
  const { isDarkMode } = useDarkMode();
  const [dropdownLeft, setDropdownLeft] = useState(null);
  

  // Filter projects based on map bounds (exactly like ProjectGallery)
  useEffect(() => {
    if (!projects) {
      setVisibleProjects([]);
      return;
    }

    // If no map bounds, show all projects
    if (!mapBounds) {
      setVisibleProjects(projects);
      return;
    }

    const filtered = projects.filter(project => {
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
    if (filtered.length === 0 && projects.length > 0) {
      setVisibleProjects(projects);
    } else {
      setVisibleProjects(filtered);
    }
  }, [projects, mapBounds]);

  // Get unique categories from all projects
  const getCategories = () => {
    const categories = [...new Set(allProjects.map(p => p.ProjectCategory || 'Other'))];
    return ['all', 'local', ...categories.sort()];
  };

  // Filter projects by active tab
  const getProjectsByTab = () => {
    if (activeTab === 'all') return allProjects;
    if (activeTab === 'local') return visibleProjects;
    
    // For category tabs, filter within local view context
    return visibleProjects.filter(p => (p.ProjectCategory || 'Other') === activeTab);
  };

  // Handle tab selection
  const handleTabSelect = (category) => {
    setActiveTab(category);
  };

  // Handle project click: fly to adjusted coords
  const handleProjectClick = (project) => {
    // This component should not handle map logic directly.
    // It just passes the click event up to the parent (SearchBar).
    if (onMarkerClick) {
      onMarkerClick(project);
    }
  };

  // Enhanced project hover handler
  const handleProjectHover = (project, index) => {
    // Find the marker first to check if it's individually visible
    const originalIndex = allProjects.findIndex(
      (p) => p.Name === project.Name && 
             parseFloat(p.Latitude) === parseFloat(project.Latitude) && 
             parseFloat(p.Longitude) === parseFloat(project.Longitude)
    );
    
    if (originalIndex !== -1) {
      const key = `${project.Name}-${originalIndex}`;
      const marker = markerRefs?.current[key];
      
      if (marker) {
        // Check if marker is individually visible (zoomed in)
        const isMarkerVisible = marker.getElement && marker.getElement();
        
        // Only set hoveredProject (for highlighter) if marker is NOT individually visible
        if (!isMarkerVisible) {
          setHoveredProject(project);
        } else {
          setHoveredProject(null);
        }
        
        // Always highlight the marker with the selected state
        const projectCategory = project.ProjectCategory || 'Other';
        const selectedIcon = createCategoryIcon(projectCategory, true, false, project);
        marker.setIcon(selectedIcon);
        
        // Only open popup if marker is individually visible
        if (isMarkerVisible && marker.openPopup) {
          console.log('Dropdown hover - Opening popup for:', project.Name);
          marker.openPopup();
        }
      }
    }
    
    // Also trigger marker hover to show popup
    if (onMarkerHover) {
      onMarkerHover(project);
    }
    // Notify parent (Map.js) of the hovered project
    if (onDropdownProjectHover) {
      onDropdownProjectHover(project);
    }
  };

  // Enhanced project leave handler
  const handleProjectLeave = (project) => {
    if (justRestoredAt && Date.now() - justRestoredAt < 300) {
      console.log('[Dropdown] handleProjectLeave ignored due to justRestoredAt');
      return;
    }
    console.log('[Dropdown] handleProjectLeave called for:', project?.Name);
    setHoveredProject(null);
    
    // Reset the marker to its default state
    const originalIndex = allProjects.findIndex(
      (p) => p.Name === project.Name && 
             parseFloat(p.Latitude) === parseFloat(project.Latitude) && 
             parseFloat(p.Longitude) === parseFloat(project.Longitude)
    );
    
    if (originalIndex !== -1) {
      const key = `${project.Name}-${originalIndex}`;
      const marker = markerRefs?.current[key];
      
      if (marker) {
        // Reset to default icon
        const projectCategory = project.ProjectCategory || 'Other';
        const defaultIcon = createCategoryIcon(projectCategory, false, false, project);
        marker.setIcon(defaultIcon);
        
        // Only close popup if marker is individually visible
        const isMarkerVisible = marker.getElement && marker.getElement();
        if (isMarkerVisible && marker.closePopup) {
          console.log('Dropdown leave - Closing popup for:', project.Name);
          marker.closePopup();
        }
      }
    }
    
    // Also trigger marker leave to hide popup
    if (onMarkerLeave) {
      onMarkerLeave(project);
    }
    // Notify parent (Map.js) that no project is hovered
    if (onDropdownProjectHover) {
      onDropdownProjectHover(null);
    }
  };

  // Get the marker ref for the hovered project (exactly like ProjectGallery)
  const getHoveredMarkerRef = () => {
    if (!hoveredProject) return { current: null };
    
    const originalIndex = allProjects.findIndex(
      (p) => p.Name === hoveredProject.Name && 
             parseFloat(p.Latitude) === parseFloat(hoveredProject.Latitude) && 
             parseFloat(p.Longitude) === parseFloat(hoveredProject.Longitude)
    );
    
    if (originalIndex === -1) {
      return { current: null };
    }
    
    const key = `${hoveredProject.Name}-${originalIndex}`;
    
    if (markerRefs?.current[key]) {
      return { current: markerRefs.current[key] };
    }
    
    return { current: null };
  };

  // Get the gallery item ref for the hovered project (exactly like ProjectGallery)
  const getHoveredGalleryItemRef = () => {
    if (!hoveredProject) return { current: null };
    
    const currentProjects = getProjectsByTab();
    const visibleIndex = currentProjects.findIndex(
      (p) => p.Name === hoveredProject.Name && 
             parseFloat(p.Latitude) === parseFloat(hoveredProject.Latitude) && 
             parseFloat(p.Longitude) === parseFloat(hoveredProject.Longitude)
    );
    
    if (visibleIndex === -1) return { current: null };
    
    const itemKey = `${hoveredProject.Name}-${visibleIndex}`;
    return { current: galleryItemRefs.current[itemKey] || null };
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  const currentProjects = getProjectsByTab();

  useEffect(() => {
    // Detect the farthest left project by longitude within map bounds
    if (!visibleProjects.length || !mapRef?.current) return;
    let minLng = Infinity;
    let farthestLeftProject = null;
    visibleProjects.forEach((project) => {
      const lng = parseFloat(project.Longitude);
      if (!isNaN(lng) && lng < minLng) {
        minLng = lng;
        farthestLeftProject = project;
      }
    });

    if (farthestLeftProject) {
      const leafletMap = mapRef.current._leaflet_map || mapRef.current;
      const lat = parseFloat(farthestLeftProject.Latitude);
      const lng = parseFloat(farthestLeftProject.Longitude);
      if (!isNaN(lat) && !isNaN(lng) && leafletMap.latLngToContainerPoint) {
        const point = leafletMap.latLngToContainerPoint([lat, lng]);
        const left = Math.max(point.x - 40, 8); // 40px offset, not offscreen
        setDropdownLeft(left);
      }
    }
  }, [visibleProjects, isOpen, mapRef]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          className="fixed z-[9999] left-1/2 top-28 -translate-x-1/2 flex flex-col"
          style={{
            position: 'absolute',
            top: 80,
            left: dropdownLeft !== null ? dropdownLeft : 50,
            width: 400,
            zIndex: 2000,
            borderRadius: 14,
            background: 'rgba(255,255,255,0.18)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
            border: '1.5px solid rgba(255,255,255,0.35)',
            color: isDarkMode ? '#fff' : '#222',
            fontFamily: 'sans-serif',
            fontSize: 15,
            letterSpacing: '0.01em',
            padding: '18px',
            maxWidth: '100%',
            maxHeight: '70vh',
            overflow: 'hidden',
            ...style,
          }}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300, duration: 0.2 }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 rounded-full w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-md z-10"
            title="Close dropdown"
            style={{ fontWeight: 700, fontSize: 22, color: isDarkMode ? '#fff' : '#222', background: 'none', border: 'none', boxShadow: 'none' }}
          >
            ×
          </button>

          {/* Tab Navigation */}
          <div style={{
            display: 'flex',
            gap: 6,
            marginBottom: 18,
            overflowX: 'auto',
            background: 'rgba(255,255,255,0.35)',
            borderRadius: 10,
            padding: '6px 8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
            border: '1px solid rgba(255,255,255,0.18)',
            position: 'relative',
            zIndex: 2,
          }}>
            {getCategories().map((category) => {
              const config = getCategoryConfig(category);
              const isActive = activeTab === category;
              return (
                <button
                  key={category}
                  onClick={() => handleTabSelect(category)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: isActive ? 700 : 500,
                    background: isActive
                      ? '#fff'
                      : 'rgba(255,255,255,0.18)',
                    color: isActive
                      ? '#222'
                      : (isDarkMode ? '#222' : '#374151'),
                    border: isActive
                      ? '1.5px solid rgba(255,255,255,0.35)'
                      : '1.5px solid transparent',
                    transition: 'all 0.18s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    cursor: 'pointer',
                  }}
                >
                  {config.icon && (
                    <span style={{ fontSize: 15 }}>{config.icon}</span>
                  )}
                  <span style={{ textTransform: 'capitalize' }}>
                    {category === 'all' ? 'All' : category === 'local' ? 'Local' : category}
                  </span>
                  {category === 'local' && (
                    <span style={{
                      fontSize: 11,
                      background: isActive ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.28)',
                      color: isActive ? '#222' : (isDarkMode ? '#222' : '#374151'),
                      borderRadius: 6,
                      padding: '1px 6px',
                      marginLeft: 4,
                    }}>
                      {visibleProjects.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Projects Grid */}
          <div className="flex-1 overflow-y-auto">
            {currentProjects.length === 0 ? (
              <div className="flex items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                <div className="flex flex-col items-center space-y-2">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="text-sm">No projects found</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {currentProjects.map((project, index) => (
                  <motion.div
                    key={`${project.Name}-${index}`}
                    ref={el => { galleryItemRefs.current[`${project.Name}-${index}`] = el; }}
                    className="rounded-lg border hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col overflow-hidden group"
                    style={{
                      background: isDarkMode ? 'rgba(0, 195, 255, 0.3)' : 'rgba(255, 140, 0, 0.82)',
                      border: isDarkMode ? '1.5px solid rgba(255, 0, 0, 0.19)' : '1.5px solid rgba(255,255,255,0.35)',
                      color: isDarkMode ? '#fff' : '#222',
                      fontFamily: 'inherit',
                      fontWeight: 500,
                    }}
                    onClick={() => handleProjectClick(project)}
                    onMouseEnter={() => handleProjectHover(project, index)}
                    onMouseLeave={() => handleProjectLeave(project)}
                    whileHover={{ scale: 1.03, y: -2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    layout
                  >
                    {/* Image Container */}
                    <div className="relative w-full aspect-square overflow-hidden">
                      <img
                        src={project.ImageUrl || "https://via.placeholder.com/120x120/4F46E5/FFFFFF?text=Project"}
                        alt={project.Name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {/* Overlay on hover */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        animate={{ opacity: hoveredProject?.Name === project.Name ? 0.6 : 0 }}
                      />
                      {/* Project name overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                        <h4 className="text-white text-xs font-medium leading-tight" style={{ fontFamily: 'inherit', fontWeight: 600 }}>
                          {project.Name}
                        </h4>
                      </div>
                      {/* Hover indicator */}
                      {hoveredProject?.Name === project.Name && (
                        <motion.div
                          className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full shadow-lg"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Use ClusterHighlighter instead of ProjectConnectionLine */}
          <ClusterHighlighter
            isVisible={!!hoveredProject}
            galleryItemRef={getHoveredGalleryItemRef()}
            markerRef={getHoveredMarkerRef()}
            mapRef={mapRef}
            hoveredProject={hoveredProject}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectGalleryCardDropdown;

