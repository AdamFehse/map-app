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
            Filtered Projects:
          </Typography>
          {filteredProjects.map((project, index) => {
            const lat = parseFloat(project.Latitude);
            const lng = parseFloat(project.Longitude);
            const key = `${project["Project Name"]}-${index}`;

            return (
              <Typography
                key={key}
                variant="body2"
                style={{ cursor: "pointer", marginBottom: "0.5rem" }}
                onClick={() => handleProjectClick(lat, lng, key)}
              >
                {project["Project Name"]}
              </Typography>
            );
          })}
        </Box>
      </Box>
    </Drawer>
  );
}
