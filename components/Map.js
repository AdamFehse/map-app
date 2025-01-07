// components/Map.js
"use client";

import { useRef, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import OffCanvasSidebar from "./OffCanvasSidebar";
import SidebarToggleButton from "./SidebarToggleButton";
import { useProjects } from "../components/useProjects";
import R from "leaflet-responsive-popup";
import "leaflet-responsive-popup/leaflet.responsive.popup.css";
import "../styles/map-darkmode.css";
import "../styles/popup-darkmode.css";
import ProjectDetailsOverlay from "./ProjectDetailsOverlay";

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function Map() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { projects, filteredProjects, filterProjects } = useProjects();
  const markerRefs = useRef({}); // Store references to markers
  const [isDarkMode, setIsDarkMode] = useState(false); // Dark mode state
  const [modalOpen, setModalOpen] = useState(false); // State for modal
  const [selectedProject, setSelectedProject] = useState(null); // State for selected project
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category); // Update the selected category
    filterProjects(category); // Filter projects based on the selected category
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      document.body.classList.toggle("dark-mode", newMode); // Add or remove the class
      return newMode;
    });
  };

  const handleOpenModal = (project) => {
    setSelectedProject(project);
    setSelectedArtwork(null); // Reset artwork when opening a new modal
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProject(null);
    setSelectedArtwork(null); // Clear selected artwork when closing modal
  };

  // Attach popups to markers
  useEffect(() => {
    filteredProjects.forEach((project, index) => {
      const key = `${project["Project"]}-${index}`;
      const marker = markerRefs.current[key];

      if (marker) {
        const popupContent = document.createElement("div");

        popupContent.innerHTML = `
              <div class="popup-content">
                <img 
                  src="${
                    project.ImageUrl || "https://via.placeholder.com/150"
                  }" 
                  alt="${project["Project"]}" 
                  class="popup-image" 
                />
                <strong>${project["Project"]}</strong>
                <p class="popup-description">${project["DescriptionShort"]}</p>
                <button id="more-details-${index}" class="popup-button">
                  More Details
                </button>
              </div>
            `;

        const popup = R.responsivePopup({
          hasTip: true,
          autoPan: true,
        }).setContent(popupContent);
        marker.bindPopup(popup);

        // Add event listener for the button
        popupContent
          .querySelector(`#more-details-${index}`)
          .addEventListener("click", () => {
            handleMoreDetails(project);
          });
      }
    });
  }, [filteredProjects]); // Re-run when filteredProjects changes

  // Handler for "More Details" button
  const handleMoreDetails = (project) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  return (
    <MapContainer
      center={[31.916004, -110.990274]}
      zoom={9}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {/* Render markers for filtered projects */}
      {filteredProjects.map((project, index) => {
        const position = [
          parseFloat(project.Latitude),
          parseFloat(project.Longitude),
        ];
        const key = `${project["Project"]}-${index}`;

        if (!position[0] || !position[1]) return null; // Skip invalid coordinates

        return (
          <Marker
            key={key}
            position={position}
            ref={(ref) => {
              if (ref) {
                markerRefs.current[key] = ref;
              }
            }}
          />
        );
      })}
      {/* Sidebar Toggle Button */}
      <SidebarToggleButton onClick={() => setSidebarOpen(true)} />
      {/* Sidebar */}
      <OffCanvasSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        projects={projects}
        filteredProjects={filteredProjects}
        onSelectCategory={handleCategoryChange} // Unified handler
        selectedCategory={selectedCategory} // Pass the selected category here
        markerRefs={markerRefs} // Pass markerRefs as a prop
        isDarkMode={isDarkMode} // Pass dark mode state
        toggleDarkMode={toggleDarkMode} // Pass toggle handler
      />

      {/* Modal for Project Details JSX*/}
      <ProjectDetailsOverlay
        open={handleOpenModal}
        onClose={handleCloseModal}
        project={selectedProject}
        isDarkMode={isDarkMode}
        selectedArtwork={selectedArtwork}
        setSelectedArtwork={setSelectedArtwork}
      />
    </MapContainer>
  );
}
