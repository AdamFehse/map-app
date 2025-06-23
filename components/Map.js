// components/Map.js
"use client";

import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon, divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useProjects } from "./useProjects";
import MiniSidebar from "./MiniSidebar";
import ProjectModal from "./ProjectModal";
import * as R from "leaflet-responsive-popup";
import { useDarkMode } from "../contexts/DarkModeContext";
import ProjectPathsD3Layer from "./ProjectPathsD3Layer";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

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

export default function Map() {
  const { projects, filteredProjects, filterProjects, categories } = useProjects();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const markerRefs = useRef({});
  const currentPopup = useRef(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const { isDarkMode } = useDarkMode();
  
  // Add URL state management
  const searchParams = useSearchParams();
  const router = useRouter();

  // Handle opening modal with URL update
  const handleMoreDetails = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    
    // Add project to URL and create browser history entry
    const newParams = new URLSearchParams(searchParams);
    newParams.set('project', project.Name);
    newParams.set('lat', project.Latitude);
    newParams.set('lng', project.Longitude);
    
    // Push new state to history
    router.push(`${window.location.pathname}?${newParams.toString()}`);
  };

  // Handle closing modal with URL update
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
    
    // Remove project from URL (this allows back navigation)
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('project');
    newParams.delete('lat');
    newParams.delete('lng');
    
    if (newParams.toString()) {
      router.push(`${window.location.pathname}?${newParams.toString()}`);
    } else {
      router.push(window.location.pathname);
    }
  };

  // Handle category selection with URL
  const handleCategorySelect = (category) => {
    console.log("Map component received category selection:", category);
    setSelectedCategory(category);
    filterProjects(category);
    
    // Update URL with category
    const newParams = new URLSearchParams(searchParams);
    if (category) {
      newParams.set('category', category);
    } else {
      newParams.delete('category');
    }
    
    // Replace current state (don't create history entry for category changes)
    router.replace(`${window.location.pathname}?${newParams.toString()}`);
  };

  // Handle marker click with URL update
  const handleMarkerClick = (marker, project, index) => {
    // Reset all markers to default icon
    Object.values(markerRefs.current).forEach((m) => {
      if (m) {
        m.setIcon(defaultIcon);
      }
    });

    // Set new selected marker
    marker.setIcon(selectedIcon);
    setSelectedMarker(marker);
    
    // Update URL with selected marker info
    const newParams = new URLSearchParams(searchParams);
    newParams.set('selected', project.Name);
    
    // Replace current state (don't create history for marker selection)
    router.replace(`${window.location.pathname}?${newParams.toString()}`);
  };

  // Initialize state from URL on component mount
  useEffect(() => {
    const projectParam = searchParams.get('project');
    const categoryParam = searchParams.get('category');
    const selectedParam = searchParams.get('selected');
    
    // Restore category filter
    if (categoryParam) {
      setSelectedCategory(categoryParam);
      filterProjects(categoryParam);
    }
    
    // Restore selected project modal
    if (projectParam && filteredProjects) {
      const project = filteredProjects.find(p => p.Name === projectParam);
      if (project) {
        setSelectedProject(project);
        setIsModalOpen(true);
      }
    }
    
    // Restore selected marker
    if (selectedParam && filteredProjects) {
      const project = filteredProjects.find(p => p.Name === selectedParam);
      if (project) {
        const index = filteredProjects.indexOf(project);
        const key = `${project.Name}-${index}`;
        const marker = markerRefs.current[key];
        if (marker) {
          marker.setIcon(selectedIcon);
          setSelectedMarker(marker);
        }
      }
    }
  }, [searchParams, filteredProjects]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      // Let the URL params effect handle the state restoration
      // This will automatically close modals, restore selections, etc.
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
          handleMarkerClick(marker, project, index);
        });

        // Listen for popup open/close events
        marker.on("popupopen", () => {
          handleMarkerClick(marker, project, index);
        });

        marker.on("popupclose", () => {
          // Reset the marker when popup closes
          marker.setIcon(defaultIcon);
          setSelectedMarker(null);
          
          // Remove selection from URL
          const newParams = new URLSearchParams(searchParams);
          newParams.delete('selected');
          router.replace(`${window.location.pathname}?${newParams.toString()}`);
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
  }, [filteredProjects, isDarkMode, searchParams]);

  return (
    <div className="map-container" style={{ position: "relative", height: "100vh", width: "100%" }}>
      <MapContainer
        center={tucsonCenter}
        zoom={11}
        style={{ height: "100vh", width: "100%" }}
      >
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
        <MiniSidebar
          filteredProjects={filteredProjects}
          onSelectCategory={handleCategorySelect}
          selectedCategory={selectedCategory}
          markerRefs={markerRefs}
          categories={categories}
        />

        {/* voronoi layer */}
        <ProjectPathsD3Layer />

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
        <ProjectModal
          project={selectedProject}
          open={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
