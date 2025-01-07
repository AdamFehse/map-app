import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Switch,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useMap } from "react-leaflet";
import ProjectDropdown from "@/components/ProjectDropdown";
import "../styles/sidebar-darkmode.css";
import "../styles/OffCanvasSidebar.css"; // Import the external CSS

export default function OffCanvasSidebar({
  open,
  onClose,
  filteredProjects,
  onSelectCategory,
  selectedCategory, // Destructure selectedCategory here
  markerRefs,
  isDarkMode,
  toggleDarkMode,
}) {
  const map = useMap();

  const handleZoomOut = () => {
    map.setZoom(9);
  };

  const handleProjectClick = (lat, lng, key) => {
    if (map && markerRefs.current[key]) {
      map.flyTo([lat, lng], 13, { animate: true });
      markerRefs.current[key].openPopup();
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box className="sidebar">
        {/* Header Section */}
        <Box className="sidebar-header">
          <Typography variant="h6">Sidebar</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Controls Section */}
        <Box className="sidebar-controls">
          {/* Categories Dropdown */}
          <div className="categories-dropdown">
            <ProjectDropdown onSelectCategory={onSelectCategory} />
          </div>

          {/* Zoom Out Button */}
          <div className="zoom-out-button">
            <Button variant="contained" onClick={handleZoomOut}>
              Zoom Out
            </Button>
          </div>

          {/* Dark Mode Toggle */}
          <div className="dark-mode-toggle">
            <Typography>Dark Mode</Typography>
            <Switch checked={isDarkMode} onChange={toggleDarkMode} />
          </div>
        </Box>

        {/* Projects Section */}
        <Box className="sidebar-projects">
          <Typography variant="body1" gutterBottom>
            {/* Display the selected category */}
            Filtered Projects: {selectedCategory || "All"}
          </Typography>

          {/* Render the filtered projects */}
          {filteredProjects.map((project, index) => {
            const lat = parseFloat(project.Latitude);
            const lng = parseFloat(project.Longitude);
            const key = `${project["Project"]}-${index}`;
            return (
              <Box
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  marginBottom: "0.5rem",
                }}
                onClick={() => handleProjectClick(lat, lng, key)}
              >
                {/* Profile Image */}
                {project["Project"] && (
                  <img
                    src={
                      project["Profile Image Url"] ||
                      "https://via.placeholder.com/40" // Placeholder image
                    }
                    alt={project["Project"] || "Placeholder"}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginRight: "10px",
                    }}
                  />
                )}

                {/* Project */}
                <Typography variant="body2">
                  {project["Project"]}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Drawer>
  );
}
