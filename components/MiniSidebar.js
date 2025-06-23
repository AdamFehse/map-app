import React, { useState, useEffect } from "react";
import { useMap } from "react-leaflet";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
  Tooltip,
  Avatar,
  Divider,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Menu as MenuIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  ChevronRight as ChevronRightIcon,
  Favorite as FavoriteIcon,
  Star as StarIcon,
  Brightness4 as Brightness4Icon,
  ZoomOut as ZoomOutIcon,
  SwapHoriz as SwapHorizIcon,
  WbSunny as WbSunnyIcon,
  ChevronLeft as ChevronLeftIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import ProjectDropdown from "./ProjectDropdown";
import { useDarkMode } from "../contexts/DarkModeContext";

// Add global styles for keyframes
const globalStyles = `
  @keyframes intense-pulse-glow {
    0% {
      filter: drop-shadow(0 0 8px rgb(255, 0, 0)) drop-shadow(0 0 20px rgba(255, 0, 0, 0.8)) drop-shadow(0 0 35px rgba(255, 0, 0, 0.4));
      transform: scale(1);
    }
    25% {
      filter: drop-shadow(0 0 12px rgb(0, 255, 17)) drop-shadow(0 0 30px rgba(255, 255, 0, 0.9)) drop-shadow(0 0 50px rgba(255, 255, 0, 0.5));
      transform: scale(1.05);
    }
    50% {
      filter: drop-shadow(0 0 15px rgb(0, 255, 255)) drop-shadow(0 0 40px rgba(0, 255, 255, 1)) drop-shadow(0 0 65px rgba(0, 255, 255, 0.6));
      transform: scale(1.08);
    }
    75% {
      filter: drop-shadow(0 0 12px rgb(255, 0, 255)) drop-shadow(0 0 30px rgba(255, 0, 255, 0.9)) drop-shadow(0 0 50px rgba(255, 0, 255, 0.5));
      transform: scale(1.05);
    }
    100% {
      filter: drop-shadow(0 0 8px rgb(0, 55, 255)) drop-shadow(0 0 20px rgba(255, 0, 0, 0.8)) drop-shadow(0 0 35px rgba(255, 0, 0, 0.4));
      transform: scale(1);
    }
  }
  
  @keyframes outer-pulse {
    0% {
      transform: scale(1);
      opacity: 0.7;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.3;
    }
    100% {
      transform: scale(1);
      opacity: 0.7;
    }
  }
  
  @keyframes hover-pulse {
    0% {
      transform: scale(1);
      opacity: 0.6;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.8;
    }
    100% {
      transform: scale(1);
      opacity: 0.6;
    }
  }
`;

export default function MiniSidebar({
  filteredProjects,
  onSelectCategory,
  selectedCategory,
  markerRefs,
  categories = [],
}) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const toggleDrawer = () => setOpen(!open);
  const [isLeftAligned, setIsLeftAligned] = useState(true);
  const toggleSidebarPosition = () => setIsLeftAligned(!isLeftAligned);
  const map = useMap();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
  }, [isDarkMode]);

  // Debug logs
  console.log("Filtered Projects:", filteredProjects);
  console.log("Selected Category:", selectedCategory);

  // Filter projects based on search term
  const searchFilteredProjects = filteredProjects?.filter((project) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      project.Name?.toLowerCase().includes(searchLower) ||
      project.DescriptionShort?.toLowerCase().includes(searchLower) ||
      project.Description?.toLowerCase().includes(searchLower)
    );
  });

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleZoomOut = () => {
    map.setView([32.2217, -110.9265], 9);
  };

  const handleProjectClick = (project) => {
    const latitude = parseFloat(project.Latitude);
    const longitude = parseFloat(project.Longitude);
    console.log("Navigating to:", latitude, longitude);

    // Find the index in the original filteredProjects array
    const originalIndex = filteredProjects.findIndex(
      (p) =>
        p.Name === project.Name &&
        p.Latitude === project.Latitude &&
        p.Longitude === project.Longitude
    );

    // Use the simple key format for marker refs
    const key = `${project.Name}-${originalIndex}`;

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
    <>
      {/* Add global styles */}
      <style>{globalStyles}</style>
      
      {/* Permanent Drawer */}
      <Drawer
        variant="permanent"
        anchor={isLeftAligned ? "left" : "right"}
        sx={{
          width: 60,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 60,
            boxSizing: 'border-box',
            backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
            transition: 'background-color 0.3s, color 0.3s',
          },
        }}
      >
        <List>
          <ListItem disablePadding>
            <Tooltip title="Menu" placement="right">
              <ListItemButton
                sx={{ 
                  justifyContent: "center",
                  position: "relative",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: "-10px",
                    left: "-10px",
                    right: "-10px",
                    bottom: "-10px",
                    background: open ? "none" : "radial-gradient(circle, rgba(255,0,0,0.3) 0%, rgba(255,255,0,0.2) 30%, rgba(0,255,255,0.1) 60%, transparent 100%)",
                    borderRadius: "50%",
                    animation: open ? "none" : "outer-pulse 4s ease-in-out infinite",
                    zIndex: -1
                  },
                  "&:hover": {
                    "& .MuiSvgIcon-root": {
                      filter: "drop-shadow(0 0 20px rgba(0, 255, 26, 1)) drop-shadow(0 0 35px rgba(0, 255, 26, 0.9)) drop-shadow(0 0 50px rgba(0, 255, 26, 0.6))",
                      transition: "all 0.3s ease",
                      transform: "scale(1.2)"
                    },
                    "&::before": {
                      background: "radial-gradient(circle, rgba(0,255,26,0.4) 0%, rgba(0,255,26,0.3) 30%, rgba(0,255,26,0.1) 60%, transparent 100%)",
                      animation: "hover-pulse 4s ease-in-out infinite"
                    }
                  },
                  "& .MuiSvgIcon-root": {
                    filter: open ? 
                      "drop-shadow(0 0 5px rgba(255,255,255,0.8))" : 
                      "drop-shadow(0 0 8px rgb(255, 0, 0)) drop-shadow(0 0 20px rgba(255, 0, 0, 0.8)) drop-shadow(0 0 35px rgba(255, 0, 0, 0.4))",
                    transition: "all 4.3s ease",
                    animation: open ? "none" : "intense-pulse-glow 4.5s ease-in-out infinite",
                    transformOrigin: "center"
                  }
                }}
                onClick={toggleDrawer}
              >
                <ListItemIcon sx={{ minWidth: "auto" }}>
                  <MenuIcon />
                </ListItemIcon>
              </ListItemButton>
            </Tooltip>
          </ListItem>
          <ListItem disablePadding>
            <Tooltip title="Toggle Dark Mode" placement="right">
              <ListItemButton
                sx={{ justifyContent: "center" }}
                onClick={toggleDarkMode}
              >
                <ListItemIcon sx={{ minWidth: "auto" }}>
                  <Brightness4Icon />
                </ListItemIcon>
              </ListItemButton>
            </Tooltip>
          </ListItem>
          <ListItem disablePadding>
            <Tooltip title="Toggle Sidebar Position" placement="right">
              <ListItemButton
                sx={{ justifyContent: "center" }}
                onClick={toggleSidebarPosition}
              >
                <ListItemIcon sx={{ minWidth: "auto" }}>
                  <SwapHorizIcon />
                </ListItemIcon>
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </List>
      </Drawer>

      {/* Temporary Drawer */}
      <Drawer
        anchor={isLeftAligned ? "left" : "right"}
        open={open}
        onClose={toggleDrawer}
        variant="temporary"
        PaperProps={{
          sx: {
            width: 300,
            backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff",
            color: isDarkMode ? "#ffffff" : "#000000",
            transition: 'background-color 0.3s, color 0.3s',
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", p: 1 }}>
          <Typography variant="h6">Projects</Typography>
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Box>
        <Divider />
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box sx={{ p: 2 }}>
          <ProjectDropdown
            onSelectCategory={onSelectCategory}
            selectedCategory={selectedCategory}
            categories={categories}
          />
        </Box>
        <List>
          {searchFilteredProjects?.map((project) => {
            // Find the index in the original filteredProjects array
            const originalIndex = filteredProjects.findIndex(
              (p) =>
                p.Name === project.Name &&
                p.Latitude === project.Latitude &&
                p.Longitude === project.Longitude
            );
            // Create a unique key for the list item
            const uniqueKey = `${project.Name}-${originalIndex}-${project.Latitude}-${project.Longitude}`;
            return (
              <ListItem key={uniqueKey} disablePadding>
                <ListItemButton onClick={() => handleProjectClick(project)}>
                  <ListItemText
                    primary={project.Name}
                    secondary={project.DescriptionShort}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>
    </>
  );
}
