import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDarkMode } from '../contexts/DarkModeContext';
import ProjectConnectionLine from './ProjectConnectionLine';
import { createCategoryIcon } from './MarkerIcons';

const ProjectGallery = ({ 
  isOpen, 
  onClose, 
  projects, 
  markerRefs,
  mapBounds,
  mapRef,
  onMarkerHover,
  onMarkerLeave,
  onMarkerClick
}) => {
  const [hoveredProject, setHoveredProject] = useState(null);
  const [visibleProjects, setVisibleProjects] = useState([]);
  const [lastSelectedProject, setLastSelectedProject] = useState(null);
  const galleryItemRefs = useRef({});
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // Filter projects based on map bounds
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

  // Handle project click to fly to location or open ProjectGalleryLayout
  const handleProjectClick = (project) => {
    // Reset previous selected marker if different project
    if (lastSelectedProject && lastSelectedProject.Name !== project.Name) {
      const prevOriginalIndex = projects.findIndex(
        (p) => p.Name === lastSelectedProject.Name && 
               parseFloat(p.Latitude) === parseFloat(lastSelectedProject.Latitude) && 
               parseFloat(p.Longitude) === parseFloat(lastSelectedProject.Longitude)
      );
      
      if (prevOriginalIndex !== -1) {
        const prevKey = `${lastSelectedProject.Name}-${prevOriginalIndex}`;
        const prevMarker = markerRefs?.current[prevKey];
        
        if (prevMarker) {
          const prevProjectCategory = lastSelectedProject.ProjectCategory || 'Other';
          const defaultIcon = createCategoryIcon(prevProjectCategory, false, false, lastSelectedProject);
          prevMarker.setIcon(defaultIcon);
        }
      }
    }
    
    // Set new selected project
    setLastSelectedProject(project);
    
    if (mapRef?.current) {
      const map = mapRef.current._leaflet_map || mapRef.current;
      if (map) {
        // Find the marker to check if it's individually visible
        const key = `${project.Name}-${projects.findIndex(p => 
          p.Name === project.Name && 
          parseFloat(p.Latitude) === parseFloat(project.Latitude) && 
          parseFloat(p.Longitude) === parseFloat(project.Longitude)
        )}`;
        
        const marker = markerRefs?.current[key];
        const currentZoom = map.getZoom();
        console.log('Gallery click - Current zoom level:', currentZoom);
        console.log('Gallery click - Marker found:', !!marker);
        
        // Check if marker is individually visible (can show popup)
        const isMarkerVisible = marker && marker.getElement && marker.getElement();
        console.log('Gallery click - Marker is individually visible:', isMarkerVisible);
        
        if (isMarkerVisible) {
          // If marker is individually visible, open ProjectGalleryLayout
          console.log('Gallery click - Opening ProjectGalleryLayout for:', project.Name);
          if (onMarkerClick) {
            onMarkerClick(project);
          }
        } else {
          // If marker is clustered, fly to the location
          console.log('Gallery click - Flying to project:', project.Name);
          const lat = parseFloat(project.Latitude);
          const lng = parseFloat(project.Longitude);
          
          if (!isNaN(lat) && !isNaN(lng)) {
            map.flyTo([lat, lng], 13, {
              duration: 1.5,
              easeLinearity: 0.25
            });
            
            // Wait for flyTo to complete, then open popup
            setTimeout(() => {
              // Find the marker again after the flyTo
              const key = `${project.Name}-${projects.findIndex(p => 
                p.Name === project.Name && 
                parseFloat(p.Latitude) === parseFloat(project.Latitude) && 
                parseFloat(p.Longitude) === parseFloat(project.Longitude)
              )}`;
              
              const markerAfterFly = markerRefs?.current[key];
              if (markerAfterFly && markerAfterFly.openPopup) {
                console.log('Gallery - Opening popup after flyTo for:', project.Name);
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
  };

  // Handle hover to draw line to marker
  const handleProjectHover = (project, index) => {
    setHoveredProject(project);
    
    // Find the marker and highlight it with the same circle image enlargement
    const originalIndex = projects.findIndex(
      (p) => p.Name === project.Name && 
             parseFloat(p.Latitude) === parseFloat(project.Latitude) && 
             parseFloat(p.Longitude) === parseFloat(project.Longitude)
    );
    
    if (originalIndex !== -1) {
      const key = `${project.Name}-${originalIndex}`;
      const marker = markerRefs?.current[key];
      
      if (marker) {
        // Use the same selected state as the flyTo selection (circle image enlargement)
        const projectCategory = project.ProjectCategory || 'Other';
        const selectedIcon = createCategoryIcon(projectCategory, true, false, project);
        marker.setIcon(selectedIcon);
      }
    }
    
    // Also trigger marker hover to show popup
    if (onMarkerHover) {
      onMarkerHover(project);
    }
  };

  const handleProjectLeave = (project) => {
    setHoveredProject(null);
    
    // Reset the marker to its default state
    const originalIndex = projects.findIndex(
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
      }
    }
    
    // Also trigger marker leave to hide popup
    if (onMarkerLeave) {
      onMarkerLeave(project);
    }
  };

  // Get the marker ref for the hovered project
  const getHoveredMarkerRef = () => {
    if (!hoveredProject) return { current: null };
    
    const originalIndex = projects.findIndex(
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

  // Get the gallery item ref for the hovered project
  const getHoveredGalleryItemRef = () => {
    if (!hoveredProject) return { current: null };
    
    const visibleIndex = visibleProjects.findIndex(
      (p) => p.Name === hoveredProject.Name && 
             parseFloat(p.Latitude) === parseFloat(hoveredProject.Latitude) && 
             parseFloat(p.Longitude) === parseFloat(hoveredProject.Longitude)
    );
    
    if (visibleIndex === -1) return { current: null };
    
    const itemKey = `${hoveredProject.Name}-${visibleIndex}`;
    return { current: galleryItemRefs.current[itemKey] || null };
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700"
          style={{ zIndex: 9998, height: '105px' }}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ 
            type: "spring", 
            damping: 25, 
            stiffness: 200,
            duration: 0.3
          }}
        >
          <div className="h-full px-4 py-2">
            <div className="h-full flex gap-3 items-center">
              {/* Fixed header slot - always visible */}
              <div className="flex-shrink-0 flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 w-20 h-16 relative">
                <h3 className="text-xs font-semibold text-gray-900 dark:text-white text-center leading-tight">
                  Projects
                </h3>
                {visibleProjects.length > 0 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {visibleProjects.length}
                  </span>
                )}
                
                {/* Dark mode toggle button */}
                <button
                  onClick={toggleDarkMode}
                  className="absolute top-1 left-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  title="Toggle dark mode"
                >
                  {isDarkMode ? (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  )}
                </button>
                
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-1 right-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  title="Close gallery"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Scrollable projects area */}
              <div className="flex-1 overflow-x-auto gallery-scroll">
                <div className="flex gap-3 h-full items-center" style={{ minWidth: 'max-content' }}>
                  {visibleProjects.length === 0 ? (
                    <div className="flex items-center justify-center text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span className="text-sm">No projects in view</span>
                      </div>
                    </div>
                  ) : (
                    visibleProjects.map((project, index) => (
                      <motion.div
                        key={`${project.Name}-${index}`}
                        ref={(el) => {
                          galleryItemRefs.current[`${project.Name}-${index}`] = el;
                        }}
                        className="flex-shrink-0 cursor-pointer group"
                        onClick={() => handleProjectClick(project)}
                        onMouseEnter={() => handleProjectHover(project, index)}
                        onMouseLeave={() => handleProjectLeave(project)}
                        whileHover={{ 
                          scale: 1.03,
                          y: -2
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        layout
                      >
                        <div className="relative bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-200 w-20 h-16">
                          {/* Image Container */}
                          <div className="relative w-full h-full overflow-hidden">
                            <img
                              src={project.ImageUrl || "https://via.placeholder.com/80x64/4F46E5/FFFFFF?text=Project"}
                              alt={project.Name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                            
                            {/* Overlay on hover */}
                            <motion.div 
                              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              animate={{
                                opacity: hoveredProject?.Name === project.Name ? 0.6 : 0
                              }}
                            />
                            
                            {/* Project name overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-1 bg-gradient-to-t from-black/80 to-transparent">
                              <h4 className="text-white text-xs font-medium leading-tight">
                                {project.Name}
                              </h4>
                            </div>
                          </div>
                          
                          {/* Hover indicator */}
                          {hoveredProject?.Name === project.Name && (
                            <motion.div
                              className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full shadow-lg"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500 }}
                            />
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Connection Line */}
          <ProjectConnectionLine
            isVisible={!!hoveredProject}
            galleryItemRef={getHoveredGalleryItemRef()}
            markerRef={getHoveredMarkerRef()}
            mapRef={mapRef}
            projectName={hoveredProject?.Name}
            hoveredProject={hoveredProject}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectGallery;