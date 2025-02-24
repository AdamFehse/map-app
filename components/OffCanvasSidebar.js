import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Switch,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
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
          <a
            href="https://confluencenter.arizona.edu/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center" }}
          >
            <img
              src="https://confluencenter.arizona.edu/sites/default/files/2025-01/cnflnctrLogo.png"
              alt="Confluencenter Logo"
              style={{
                maxWidth: "100%",
                maxHeight: "50px",
              }}
            />
          </a>
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
            <Button variant="outlined" onClick={handleZoomOut}>
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
          <List>
            {filteredProjects.map((project, index) => {
              const lat = parseFloat(project.Latitude);
              const lng = parseFloat(project.Longitude);
              const key = `${project["Project"]}-${index}`;

              return (
                <ListItem
                  key={key}
                  disablePadding
                  style={{
                    marginBottom: "0.5rem",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    backgroundColor: isDarkMode ? "#333" : "#fff",
                    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <ListItemButton
                    onClick={() => handleProjectClick(lat, lng, key)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "10px",
                      gap: "10px",
                    }}
                  >
                    {/* Profile Image */}
                    <ListItemAvatar>
                      <Avatar
                        src={
                          project["Profile Image Url"] ||
                          "https://placehold.co/40X40"
                        }
                        alt={project["Project"] || "Placeholder"}
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    </ListItemAvatar>

                    {/* Project Name */}
                    <Typography
                      variant="body2"
                      style={{
                        fontWeight: "bold",
                        color: isDarkMode ? "#fff" : "#000",
                      }}
                    >
                      {project["Project"]}
                    </Typography>
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Box>
    </Drawer>
  );
}
