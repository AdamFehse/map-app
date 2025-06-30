// components/Map.js
"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useProjects } from "./useProjects";
import { useDarkMode } from "../contexts/DarkModeContext";
import MarkerCluster from "./MarkerCluster";
import ProjectGallery from "./ProjectGallery";
import ProjectGalleryLayout from "./ProjectGalleryLayout";
import SearchBar from "./SearchBar";
import { createCategoryIcon } from './MarkerIcons';
import MapLegend from './MapLegend';
import MapTitle from './MapTitle';
import Export4BorderLayer from "./Export4BorderLayer";
import TownsLabelLayer from "./TownsLabelLayer";

// default center
const mapCenter = [31.333699, -110.950821 - .3];

// Define bounds for the Fronteridades border region (Arizona-Sonora border)
// This covers the main border region between Arizona and Sonora, Mexico
const fronteridadesBounds = [
  [23.5, -118.5], // Southwest corner (a bit tighter north/east)
  [38.5, -101.5], // Northeast corner (a bit tighter south/west)
];

export default function Map() {
  const { projects, loading, error } = useProjects();
  const { isDarkMode } = useDarkMode();

  // State for gallery
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [mapBounds, setMapBounds] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isProjectLayoutOpen, setIsProjectLayoutOpen] = useState(false);
  
  // State for search
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);
  
  // Refs for markers and map
  const markerRefs = useRef({});
  const mapRef = useRef(null);

  // State for dropdown
  const [showDropdown, setShowDropdown] = useState(true);
  const [wasDropdownOpen, setWasDropdownOpen] = useState(false);
  const [lastDropdownHoveredProject, setLastDropdownHoveredProject] = useState(null);

  // State for justRestoredAt (timestamp)
  const [justRestoredAt, setJustRestoredAt] = useState(0);

  // Update map bounds when map moves
  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current._leaflet_map || mapRef.current;
      if (map) {
        const updateBounds = () => {
          setMapBounds(map.getBounds());
        };
        
        map.on('moveend', updateBounds);
        map.on('zoomend', updateBounds);
        updateBounds(); // Initial bounds
        
        return () => {
          map.off('moveend', updateBounds);
          map.off('zoomend', updateBounds);
        };
      }
    }
  }, [mapRef.current]);

  // Filter projects based on search term
  useEffect(() => {
    if (!projects) {
      setFilteredProjects([]);
      return;
    }

    if (!searchTerm.trim()) {
      setFilteredProjects(projects);
      return;
    }

    const filtered = projects.filter(project => {
      const searchLower = searchTerm.toLowerCase();
      return (
        project.Name?.toLowerCase().includes(searchLower) ||
        project.DescriptionShort?.toLowerCase().includes(searchLower) ||
        project.ProjectCategory?.toLowerCase().includes(searchLower) ||
        project.Description?.toLowerCase().includes(searchLower)
      );
    });

    setFilteredProjects(filtered);
  }, [projects, searchTerm]);

  // Handle gallery toggle
  const handleGalleryToggle = () => {
    console.log('Gallery toggle clicked, current state:', isGalleryOpen);
    if (isProjectLayoutOpen) {
      // If layout is open, close it first
      setIsProjectLayoutOpen(false);
      setSelectedProject(null);
    }
    setIsGalleryOpen(!isGalleryOpen);
    console.log('New gallery state:', !isGalleryOpen);
  };

  // Handle gallery close
  const handleGalleryClose = () => {
    setIsGalleryOpen(false);
  };

  // Handle marker hover
  const handleMarkerHover = (project) => {
    console.log('Marker hovered:', project.Name);
    
    // Find the marker and open its popup
    const key = `${project.Name}-${projects.findIndex(p => 
      p.Name === project.Name && 
      parseFloat(p.Latitude) === parseFloat(project.Latitude) && 
      parseFloat(p.Longitude) === parseFloat(project.Longitude)
    )}`;
    
    const marker = markerRefs.current[key];
    if (marker && marker.openPopup) {
      console.log('Opening popup for:', project.Name);
      marker.openPopup();
    }
  };

  // Handle marker leave
  const handleMarkerLeave = (project) => {
    console.log('Marker left:', project.Name);
    
    // Find the marker and close its popup
    const key = `${project.Name}-${projects.findIndex(p => 
      p.Name === project.Name && 
      parseFloat(p.Latitude) === parseFloat(project.Latitude) && 
      parseFloat(p.Longitude) === parseFloat(project.Longitude)
    )}`;
    
    const marker = markerRefs.current[key];
    if (marker && marker.closePopup) {
      console.log('Closing popup for:', project.Name);
      marker.closePopup();
    }
  };

  // Handle marker click - opens ProjectGalleryLayout when marker is individually visible
  const handleMarkerClick = (project) => {
    console.log('handleMarkerClick called for:', project.Name);
    
    if (mapRef?.current) {
      const map = mapRef.current._leaflet_map || mapRef.current;
      if (map) {
        // Find the marker to check if it's individually visible
        const key = `${project.Name}-${projects.findIndex(p => 
          p.Name === project.Name && 
          parseFloat(p.Latitude) === parseFloat(project.Latitude) && 
          parseFloat(p.Longitude) === parseFloat(project.Longitude)
        )}`;
        
        const marker = markerRefs.current[key];
        const currentZoom = map.getZoom();
        console.log('Current zoom level:', currentZoom);
        console.log('Marker found:', !!marker);
        
        // Check if marker is individually visible (can show popup)
        const isMarkerVisible = marker && marker.getElement && marker.getElement();
        console.log('Marker is individually visible:', isMarkerVisible);
        
        if (isMarkerVisible) {
          // If marker is individually visible, open ProjectGalleryLayout
          console.log('Opening ProjectGalleryLayout for:', project.Name);
          setLastDropdownHoveredProject(project);
          setSelectedProject(project);
          setIsProjectLayoutOpen(true);
          // Do NOT close or change dropdown state
        }
        // NOTE: The flyTo logic for clustered markers has been moved to SearchBar.js
        // to avoid conflicting commands. This handler now only opens the layout
        // for already-visible markers.
      } else {
        console.log('Map not found');
      }
    } else {
      console.log('mapRef not available');
    }
  };

  // When a project is hovered in the dropdown, update lastDropdownHoveredProject
  const handleDropdownProjectHover = (project) => {
    console.log('[Map.js] handleDropdownProjectHover called with:', project?.Name);
    setLastDropdownHoveredProject(project);
    // Highlight marker and open popup if marker is visible
    if (!project) return;
    const key = `${project.Name}-${filteredProjects.findIndex(p =>
      p.Name === project.Name &&
      parseFloat(p.Latitude) === parseFloat(project.Latitude) &&
      parseFloat(p.Longitude) === parseFloat(project.Longitude)
    )}`;
          const marker = markerRefs.current[key];
    if (marker) {
      const projectCategory = project.ProjectCategory || 'Other';
      const selectedIcon = createCategoryIcon(projectCategory, true, false, project);
            marker.setIcon(selectedIcon);
      const isMarkerVisible = marker.getElement && marker.getElement();
      if (isMarkerVisible && marker.openPopup) {
        marker.openPopup();
      }
    }
  };

  // Handle ProjectGalleryLayout close
  const handleProjectLayoutClose = () => {
    console.log('[Map.js] handleProjectLayoutClose called');
    console.log('[Map.js] showDropdown:', showDropdown, 'lastDropdownHoveredProject:', lastDropdownHoveredProject?.Name);
    setIsProjectLayoutOpen(false);
    setSelectedProject(null);
    if (showDropdown && lastDropdownHoveredProject) {
      const now = Date.now();
      setJustRestoredAt(now);
      // Delay restoration to ensure DOM and map are ready and leave events have fired
      setTimeout(() => {
        console.log('[Map.js] Delayed restoration of marker highlight and popup for:', lastDropdownHoveredProject.Name);
        handleDropdownProjectHover(lastDropdownHoveredProject);
      }, 300);
    }
  };

  // Restore marker highlight and popup when dropdown is open and lastDropdownHoveredProject is set
  useEffect(() => {
    if (showDropdown && lastDropdownHoveredProject) {
      handleDropdownProjectHover(lastDropdownHoveredProject);
    }
    // Only run when showDropdown or lastDropdownHoveredProject changes
  }, [showDropdown, lastDropdownHoveredProject]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Memoize filtered projects to avoid re-calculating on every render
  const filteredProjectsMemo = useMemo(() => {
    if (!projects) return [];
    if (!searchTerm.trim()) {
      return projects;
    }

    return projects.filter(project => {
      const searchLower = searchTerm.toLowerCase();
      return (
        project.Name?.toLowerCase().includes(searchLower) ||
        project.DescriptionShort?.toLowerCase().includes(searchLower) ||
        project.ProjectCategory?.toLowerCase().includes(searchLower) ||
        project.Description?.toLowerCase().includes(searchLower)
      );
    });
  }, [projects, searchTerm]);

  if (loading) {
    return <div>Loading map...</div>;
  }

  if (error) {
    return <div>Error loading map: {error}</div>;
  }

  return (
    <div style={{ position: "relative", height: "100vh", width: "100%" }}>
      <MapContainer
        ref={mapRef}
        center={mapCenter}
        zoom={7}
        style={{ height: "100vh", width: "100%" }}
        maxBounds={fronteridadesBounds}
        bounds={fronteridadesBounds}
        minZoom={6}
        maxZoom={17}
      >
        <TileLayer
          url={
            isDarkMode
              ? "https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}"
              : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          }
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          minZoom={0}
          maxZoom={16}
        />

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 400, // below markers/clusters, above tiles
            background: "linear-gradient(180deg, rgba(0, 255, 234, 0.19) 0%, rgba(0, 8, 255, 0.13) 100%)"
          }}
        />

        <MarkerCluster 
          projects={filteredProjectsMemo} 
          markerRefs={markerRefs}
          onMarkerClick={handleMarkerClick}
          />

        <Export4BorderLayer />
        <TownsLabelLayer />
        
      </MapContainer>

      <MapTitle />
      <MapLegend />

      {/* Search Bar */}
      <div className="absolute top-0 left-0 w-full z-[1000] p-4 pointer-events-none">
        <div className="w-full max-w-lg mx-auto pointer-events-auto">
          <SearchBar
            onSearch={handleSearch}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredProjects={filteredProjectsMemo}
            markerRefs={markerRefs}
            mapRef={mapRef}
            mapBounds={mapBounds}
            onMarkerClick={handleMarkerClick}
            isLayoutOpen={isProjectLayoutOpen}
            showDropdown={showDropdown}
            setShowDropdown={setShowDropdown}
            onDropdownProjectHover={handleDropdownProjectHover}
            justRestoredAt={justRestoredAt}
          />
        </div>
      </div>

      {/* Gallery Toggle Button */}
      <button
        onClick={handleGalleryToggle}
        className="z-[9999] rounded-lg"
        style={{
          position: 'absolute',
          left: 16,
          bottom: isGalleryOpen && !isProjectLayoutOpen ? 105 : 16, // 105px = gallery bar height
          background: 'rgba(255,255,255,0.18)',
          border: '1.5px solid rgba(255,255,255,0.35)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          boxShadow: '0 2px 16px rgba(0,0,0,0.12)',
          color: isDarkMode ? '#fff' : '#222',
          fontFamily: 'sans-serif',
          padding: 14,
          transition: 'box-shadow 0.2s, bottom 0.3s',
        }}
        title="Toggle Project Gallery"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: isDarkMode ? '#fff' : '#222' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </button>
      
      {/* Project Gallery (only show if not in detailed view) */}
      {isGalleryOpen && !isProjectLayoutOpen && (
        <ProjectGallery
          isOpen={isGalleryOpen}
          onClose={handleGalleryClose}
          projects={filteredProjectsMemo}
          markerRefs={markerRefs}
          mapBounds={mapBounds}
          mapRef={mapRef}
          onMarkerHover={handleMarkerHover}
          onMarkerLeave={handleMarkerLeave}
          onMarkerClick={handleMarkerClick}
          justRestoredAt={justRestoredAt}
        />
      )}

      {/* Project Gallery Layout Overlay */}
      {selectedProject && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 99999,
          pointerEvents: 'auto',
        }}>
        <ProjectGalleryLayout
          project={selectedProject}
            onClose={handleProjectLayoutClose}
          />
        </div>
      )}
      
      {/* Debug info */}
      {console.log('Map render - selectedProject:', selectedProject?.Name, 'isProjectLayoutOpen:', isProjectLayoutOpen)}
    </div>
  );
}
