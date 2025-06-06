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
import D3Layer from "./D3Layer";
import VoronoiD3Layer from "./VoronoiD3Layer";

import MiniSidebar from "./MiniSidebar";

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
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProject(null);
  };

  // Attach popups to markers
  useEffect(() => {
    filteredProjects.forEach((project, index) => {
      // Updated to use new property names
      const key = `${project.Name}-${index}`;
      const marker = markerRefs.current[key];

      if (marker) {
        const popupContent = document.createElement("div");

        popupContent.innerHTML = `
              <div class="popup-content">
                <img 
                  src="${
                    project.ImageUrl || "https://via.placeholder.com/150"
                  }" 
                  alt="${project.Name}" 
                  class="popup-image" 
                />
                <strong>${project.Name}</strong>
                <p class="popup-description">${project.DescriptionShort || project.Description || ''}</p>
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
        const button = popupContent.querySelector(`#more-details-${index}`);
        if (button) {
          button.addEventListener("click", () => {
            handleMoreDetails(project);
          });
        }
      }
    });
  }, [filteredProjects]); // Re-run when filteredProjects changes

  // Handler for "More Details" button - Fixed to use handleOpenModal
  const handleMoreDetails = (project) => {
    handleOpenModal(project);
  };

  return (
    <MapContainer
      center={[31.916004, -110.990274]}
      zoom={10}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        attribution="&copy; OpenStreetMap contributors"
      />
      
      {/* Render markers for filtered projects */}
      {filteredProjects.map((project, index) => {
        // Updated to use new coordinate property names
        const position = [
          parseFloat(project.Latitude),
          parseFloat(project.Longitude),
        ];
        const key = `${project.Name}-${index}`;

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

      {/* Add D3 Layer 
      <D3Layer data={filteredProjects} />*/}
      {/*<VoronoiD3Layer/> */}

      
      <MiniSidebar
        filteredProjects={filteredProjects || []}
        onSelectCategory={handleCategoryChange}
        selectedCategory={selectedCategory}
        markerRefs={markerRefs}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />

      {/* Sidebar Toggle Button       <SidebarToggleButton onClick={() => setSidebarOpen(true)} />
       */}
      {/* Sidebar       <OffCanvasSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        projects={projects}
        filteredProjects={filteredProjects}
        onSelectCategory={handleCategoryChange} // Unified handler
        selectedCategory={selectedCategory} // Pass the selected category here
        markerRefs={markerRefs} // Pass markerRefs as a prop
        isDarkMode={isDarkMode} // Pass dark mode state
        toggleDarkMode={toggleDarkMode} // Pass toggle handler
      />*/}

      {/* Modal for Project Details JSX*/}
      <ProjectDetailsOverlay
        open={modalOpen}
        onClose={handleCloseModal}
        project={selectedProject}
        isDarkMode={isDarkMode}
      />
    </MapContainer>
  );
}