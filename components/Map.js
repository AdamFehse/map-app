// components/Map.js
"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import { Icon, divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useProjects } from "./useProjects";
import MiniSidebar from "./MiniSidebar";
import ProjectModal from "./ProjectModal";
import ProjectGalleryLayout from "./ProjectGalleryLayout";

import * as R from "leaflet-responsive-popup";
import { useDarkMode } from "../contexts/DarkModeContext";
import ProjectPathsD3Layer from "./ProjectPathsD3Layer";
import AzBorderD3Layer from "./AzBorderD3Layer";
import RiversD3Layer from "./RiversD3Layer";
import RoadsD3Layer from "./RoadsD3Layer";
import TownsD3Layer from "./TownsD3Layer";
import SearchBar from "./SearchBar";

// default center
const tucsonCenter = [32.2217, -110.9265];

const defaultIcon = divIcon({
  className: "custom-div-icon",
  html: `<div style="background-color: #e74c3c; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
  popupAnchor: [0, -5],
});

const selectedIcon = divIcon({
  className: "custom-div-icon",
  html: `<div style="background-color:rgb(0, 255, 247); width: 16px; height: 16px; border-radius: 50%; border: 3px solid blue; box-shadow: 0 0 10px rgba(231, 76, 60, 0.5);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  popupAnchor: [0, -5],
});

function MapSidebarBridge({
  open,
  onClose,
  searchTerm,
  setSearchTerm,
  filteredProjects, // original, category-filtered
  searchFilteredProjects, // search-filtered
  onSelectCategory,
  selectedCategory,
  markerRefs,
  categories,
}) {
  const map = useMap();

  // Handler for project click: fly to marker and open popup
  const handleProjectClick = (project, originalIndex) => {
    const key = `${project.Name}-${originalIndex}`;
    const latitude = parseFloat(project.Latitude);
    const longitude = parseFloat(project.Longitude);
    if (!isNaN(latitude) && !isNaN(longitude)) {
      if (markerRefs?.current[key]) {
        map.flyTo([latitude, longitude], 13, { animate: true });
        markerRefs.current[key].openPopup();
      } else {
        console.warn(`Marker for key "${key}" not found.`);
      }
    } else {
      console.error("Invalid coordinates:", latitude, longitude);
    }
  };

  return (
    <MiniSidebar
      open={open}
      onClose={onClose}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      filteredProjects={filteredProjects} // original
      searchFilteredProjects={searchFilteredProjects} // search-filtered
      onSelectCategory={onSelectCategory}
      selectedCategory={selectedCategory}
      markerRefs={markerRefs}
      categories={categories}
      onProjectClick={handleProjectClick}
    />
  );
}

function AreaInfoUpdater({ filteredProjects, setAreaInfo, setAreaProject, setAreaProjects, setMapZoom }) {
  const map = useMapEvents({
    moveend: updateAreaInfo,
    zoomend: updateAreaInfo,
  });

  function updateAreaInfo() {
    const zoom = map.getZoom();
    if (zoom < 12) {
      setAreaInfo('Zoom in to see projects in this area');
      setAreaProject(null);
      setAreaProjects([]);
      setMapZoom(zoom);
      return;
    }
    const bounds = map.getBounds();
    const projectsInView = filteredProjects.filter(p =>
      bounds.contains([p.Latitude, p.Longitude])
    );
    if (projectsInView.length === 0) {
      setAreaInfo('No projects in this area');
      setAreaProject(null);
      setAreaProjects([]);
      setMapZoom(11);
    } else {
      const project = projectsInView[0];
      setAreaInfo(
        `${project.Name}${project.DescriptionShort ? ': ' + project.DescriptionShort : ''}`
      );
      setAreaProject(project);
      setAreaProjects(projectsInView);
      setMapZoom(zoom);
    }
  }

  // Update on mount and when filteredProjects changes
  useEffect(() => {
    updateAreaInfo();
    // eslint-disable-next-line
  }, [filteredProjects]);

  return null;
}

export default function Map() {
  const { projects, filteredProjects, filterProjects, categories } =
    useProjects();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const markerRefs = useRef({});
  const currentPopup = useRef(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const { isDarkMode } = useDarkMode();

  // --- NEW STATE FOR SEARCH AND SIDEBAR ---
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [areaInfo, setAreaInfo] = useState('');
  const [areaProject, setAreaProject] = useState(null);
  const [areaProjects, setAreaProjects] = useState([]);
  const [mapZoom, setMapZoom] = useState(11);

  // --- FILTER PROJECTS BY SEARCH TERM (in addition to category) ---
  const filteredBySearch = filteredProjects.filter(project => {
    if (!searchTerm) return true;
    const lower = searchTerm.toLowerCase();
    return (
      project.Name?.toLowerCase().includes(lower) ||
      project.DescriptionShort?.toLowerCase().includes(lower) ||
      project.Description?.toLowerCase().includes(lower)
    );
  });

  // --- HANDLE SEARCH SUBMIT ---
  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term && !searchHistory.includes(term)) {
      setSearchHistory([term, ...searchHistory.slice(0, 9)]); // keep last 10
    }
  };

  // Ref to store the last category hash that was processed to prevent redundant updates
  const lastProcessedCategoryHashRef = useRef(window.location.hash);

  // --- HASH ROUTING STATE MANAGEMENT ---
  const handleMoreDetails = useCallback((project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    window.location.hash = `project=${encodeURIComponent(project.Name)}&lat=${project.Latitude}&lng=${project.Longitude}`;
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProject(null);
    // Only clear hash if it's currently a project hash
    const params = new URLSearchParams(window.location.hash.slice(1));
    if (params.has('project')) {
      params.delete('project');
      params.delete('lat');
      params.delete('lng');
      window.location.hash = params.toString();
    }
  }, []);

  const handleCategorySelect = useCallback((category) => {
    // This function will ONLY update the hash. The useEffect will then 'react' to this.
    const params = new URLSearchParams(window.location.hash.slice(1));
    if (category) {
      params.set('category', encodeURIComponent(category));
    } else {
      params.delete('category');
    }
    const newHash = params.toString();
    if (window.location.hash.slice(1) !== newHash) {
      window.location.hash = newHash;
    }
  }, []);

  const handleMarkerClick = useCallback((marker, project, index) => {
    Object.values(markerRefs.current).forEach((m) => {
      if (m) {
        m.setIcon(defaultIcon);
      }
    });
    marker.setIcon(selectedIcon);
    setSelectedMarker(marker);
    // Only update hash if it's not already the selected marker hash
    const currentSelected = new URLSearchParams(window.location.hash.slice(1)).get('selected');
    if (currentSelected !== project.Name) {
      window.location.hash = `selected=${encodeURIComponent(project.Name)}`;
    }
    // Pan/fly to marker when clicked
    const currentZoom = marker._map.getZoom();
    marker._map.flyTo([project.Latitude, project.Longitude], currentZoom, { animate: true });
  }, [markerRefs]);

  // 1. Sync category from hash to state (triggered by hashchange event)
  useEffect(() => {
    const syncCategoryFromHash = () => {
      setSelectedCategory(prevCategory => {
        const params = new URLSearchParams(window.location.hash.slice(1));
        const categoryParam = params.get('category');
        const newCategoryFromHash = categoryParam || "";

        // Only update if the category from hash is actually different from the previous state
        if (newCategoryFromHash !== prevCategory) {
          return newCategoryFromHash;
        }
        return prevCategory; // Return previous state if no change to avoid re-render
      });
    };

    // Initial sync on mount
    syncCategoryFromHash();

    // Listen for hash changes
    window.addEventListener('hashchange', syncCategoryFromHash);

    // Cleanup
    return () => {
      window.removeEventListener('hashchange', syncCategoryFromHash);
    };
  }, []); // Empty dependency array, as it listens to global event

  // 2. Filter projects when selectedCategory changes (isolated from hash sync)
  useEffect(() => {
    filterProjects(selectedCategory);
  }, [selectedCategory, filterProjects]);

  // 3. Restore selected project modal and marker from hash (triggered by hashchange event)
  useEffect(() => {
    if (!filteredProjects) return; // Wait for projects to load

    const restoreFromHash = () => {
      const params = new URLSearchParams(window.location.hash.slice(1));
      const projectParam = params.get('project');
      const selectedParam = params.get('selected');

      // Restore selected project modal
      if (projectParam) {
        const decodedProjectName = decodeURIComponent(projectParam);
        const project = filteredProjects.find(p => p.Name === decodedProjectName);
        if (project && (!selectedProject || selectedProject.Name !== project.Name)) { // Prevent redundant updates
          setSelectedProject(project);
          setIsModalOpen(true);
        }
      } else if (isModalOpen) { // Close modal if hash doesn't specify project and it's open
        setIsModalOpen(false);
        setSelectedProject(null);
      }

      // Restore selected marker
      if (selectedParam) {
        const decodedSelectedName = decodeURIComponent(selectedParam);
        const project = filteredProjects.find(p => p.Name === decodedSelectedName);
        if (project) {
          const index = filteredProjects.indexOf(project);
          const key = `${project.Name}-${index}`;
          const marker = markerRefs.current[key];
          if (marker && selectedMarker !== marker) { // Prevent redundant updates
            Object.values(markerRefs.current).forEach((m) => {
              if (m) { m.setIcon(defaultIcon); }
            });
            marker.setIcon(selectedIcon);
            setSelectedMarker(marker);
          }
        }
      } else if (selectedMarker) { // Reset marker if hash doesn't specify selected and one is selected
        selectedMarker.setIcon(defaultIcon);
        setSelectedMarker(null);
      }
    };

    // Initial restoration on mount or when filteredProjects change
    restoreFromHash();

    // Listen for hash changes specifically for modal/marker restoration
    window.addEventListener('hashchange', restoreFromHash);

    // Cleanup
    return () => {
      window.removeEventListener('hashchange', restoreFromHash);
    };

  }, [filteredProjects, isModalOpen, selectedProject, selectedMarker, markerRefs]); // Add all stable deps

  // Update popup classes when dark mode changes
  useEffect(() => {
    // Update all existing popups to match current dark mode
    const popups = document.querySelectorAll('.leaflet-popup');
    popups.forEach(popup => {
      if (isDarkMode) {
        popup.classList.remove('light-mode-popup');
        popup.classList.add('dark-mode-popup');
      } else {
        popup.classList.remove('dark-mode-popup');
        popup.classList.add('light-mode-popup');
      }
    });
  }, [isDarkMode]);

  // Attach popups to markers
  useEffect(() => {
    if (!filteredProjects) return;

    filteredProjects.forEach((project, index) => {
      const key = `${project.Name}-${index}`;
      const marker = markerRefs.current[key];

      if (marker) {
        const popupContent = document.createElement("div");
        popupContent.className = "responsive-popup-content";

        popupContent.innerHTML = `
            <img 
              src="${project.ImageUrl || "https://via.placeholder.com/150"}" 
              alt="${project.Name}" 
              class="popup-image" 
            />
            <strong class="popup-title">${project.Name}</strong>
            <p class="popup-description">${
              project.DescriptionShort || project.Description || ""
            }</p>
            <button id="more-details-${index}" class="popup-button">
              More Details
            </button>
        `;

        const popup = R.responsivePopup({
          hasTip: false,
          autoPan: true,
          className: isDarkMode ? "dark-mode-popup" : "light-mode-popup",
        }).setContent(popupContent);

        marker.bindPopup(popup);

        // Add event listeners for the marker and popup
        marker.on("click", () => {
          handleMarkerClick(marker, project, index); // Use the new handler
        });

        // Listen for popup open/close events
        marker.on("popupopen", () => {
          handleMarkerClick(marker, project, index); // Use the new handler
        });

        marker.on("popupclose", () => {
          // Only clear hash if it's currently a selected marker hash
          const params = new URLSearchParams(window.location.hash.slice(1));
          if (params.has('selected')) {
            params.delete('selected');
            window.location.hash = params.toString();
          }
          marker.setIcon(defaultIcon);
          setSelectedMarker(null);
        });

        // Add event listener for the button
        const button = popupContent.querySelector(`#more-details-${index}`);
        if (button) {
          button.addEventListener("click", () => {
            handleMoreDetails(project);
          });
        }
      }
    });
  }, [filteredProjects, isDarkMode, handleMoreDetails, handleMarkerClick]);

  return (
    <div style={{ position: "relative", height: "100vh", width: "100%" }}>
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onMenuClick={() => setSidebarOpen(true)}
        areaInfo={areaInfo}
        areaProject={areaProject}
        areaProjects={areaProjects}
        mapZoom={mapZoom}
        searchHistory={searchHistory}
        onSearch={handleSearch}
        filteredProjects={filteredBySearch}
        onProjectSelect={(project) => {
          const originalIndex = filteredProjects.findIndex(
            (p) =>
              p.Name === project.Name &&
              p.Latitude === project.Latitude &&
              p.Longitude === project.Longitude
          );
          const key = `${project.Name}-${originalIndex}`;
          if (!isNaN(project.Latitude) && !isNaN(project.Longitude)) {
            if (markerRefs?.current[key]) {
              markerRefs.current[key]._map.flyTo([project.Latitude, project.Longitude], 13, { animate: true });
              markerRefs.current[key].openPopup();
            }
          }
          setSidebarOpen(false); // Optionally close sidebar after selection
        }}
      />
      <MapContainer
        center={tucsonCenter}
        zoom={11}
        style={{ height: "100vh", width: "100%" }}
      >
        <AreaInfoUpdater
          filteredProjects={filteredProjects}
          setAreaInfo={setAreaInfo}
          setAreaProject={setAreaProject}
          setAreaProjects={setAreaProjects}
          setMapZoom={setMapZoom}
        />
        <TileLayer
          url={
            isDarkMode
              ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          }
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          minZoom={0}
          maxZoom={20}
        />
        {filteredProjects?.map((project, index) => {
          const key = `${project.Name}-${index}`;
          return (
            <Marker
              key={key}
              position={[project.Latitude, project.Longitude]}
              icon={defaultIcon}
              ref={(marker) => {
                if (marker) {
                  markerRefs.current[key] = marker;
                }
              }}
            />
          );
        })}

        {/* voronoi layer <ProjectPathsD3Layer />*/}
        
        {/* map Layers 
        <AzBorderD3Layer />
        <RiversD3Layer />
        <RoadsD3Layer />
        <TownsD3Layer />*/}

        {sidebarOpen && (
          <MapSidebarBridge
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredProjects={filteredProjects} // original
            searchFilteredProjects={filteredBySearch} // search-filtered
            onSelectCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
            markerRefs={markerRefs}
            categories={categories}
          />
        )}
      </MapContainer>
      <div
        className="map-color-overlay"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          height: "100%",
          width: "100%",
          background: "rgba(192, 128, 248, 0.1)",
          pointerEvents: "none",
          zIndex: 400,
        }}
      />
      {selectedProject && (
        <ProjectGalleryLayout
          project={selectedProject}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
