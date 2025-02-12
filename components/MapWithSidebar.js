import React, { useState, useCallback } from "react";
import MapOpenLayers from "./MapOpenLayers";
import MiniSidebar from "./MiniSidebar";

export default function MapWithSidebar({ projects }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [mapInstance, setMapInstance] = useState(null); // Store map instance
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleMarkerClick = (project) => {
    setSelectedProject(project);
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    if (mapInstance) {
      const [lon, lat] = [
        parseFloat(project.Longitude),
        parseFloat(project.Latitude),
      ];
      mapInstance.getView().animate({
        center: fromLonLat([lon, lat]),
        zoom: 13,
        duration: 1000,
      });
    }
  };

  const handleMapReady = useCallback((map) => {
    if (!mapInstance) {
      setMapInstance(map);
    }
  }, [mapInstance]); // Only set the map instance once

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    // Filter logic for projects based on the category
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%" }}>
      <MiniSidebar
        mapInstance={mapInstance} // Pass map instance to MiniSidebar
        filteredProjects={projects} // Filter logic can be added here
        onSelectCategory={handleCategoryChange}
        selectedCategory={selectedCategory}
        isDarkMode={false} // Replace with your dark mode state
        toggleDarkMode={() => {}} // Replace with your dark mode toggle
      />
      <MapOpenLayers
        projects={projects}
        onMarkerClick={handleMarkerClick}
        onMapReady={handleMapReady} // Pass map instance to parent
      />
    </div>
  );
}
