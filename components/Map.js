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

  // --- HASH ROUTING STATE MANAGEMENT ---
  // Update hash when state changes
  const handleMoreDetails = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    window.location.hash = `project=${encodeURIComponent(project.Name)}&lat=${project.Latitude}&lng=${project.Longitude}`;
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
    window.location.hash = '';
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    filterProjects(category);
    if (category) {
      window.location.hash = `category=${encodeURIComponent(category)}`;
    } else {
      window.location.hash = '';
    }
  };

  const handleMarkerClick = (marker, project, index) => {
    Object.values(markerRefs.current).forEach((m) => {
      if (m) {
        m.setIcon(defaultIcon);
      }
    });
    marker.setIcon(selectedIcon);
    setSelectedMarker(marker);
    window.location.hash = `selected=${encodeURIComponent(project.Name)}`;
  };

  // Restore state from hash on load and hash change
  useEffect(() => {
    const updateStateFromHash = () => {
      const params = new URLSearchParams(window.location.hash.slice(1));
      const projectParam = params.get('project');
      const categoryParam = params.get('category');
      const selectedParam = params.get('selected');

      if (categoryParam) {
        setSelectedCategory(categoryParam);
        filterProjects(categoryParam);
      }

      if (projectParam && filteredProjects) {
        const project = filteredProjects.find(p => p.Name === projectParam);
        if (project) {
          setSelectedProject(project);
          setIsModalOpen(true);
        }
      } else {
        setIsModalOpen(false);
        setSelectedProject(null);
      }

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
    };

    updateStateFromHash();
    window.addEventListener('hashchange', updateStateFromHash);
    return () => window.removeEventListener('hashchange', updateStateFromHash);
  }, [filteredProjects]);

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
          window.location.hash = '';
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
  }, [filteredProjects, isDarkMode]);

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
