import React, { useState } from "react";
import { useMap } from "react-leaflet";

import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  Tooltip,
  Switch,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/Star";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import ProjectDropdown from "@/components/ProjectDropdown";
import "../styles/MiniSidebarStyles.css"; // Import the external CSS (unused atm)
import sideBarSideToggle from "../components/SidebarSideToggle";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import DarkModeIcon from '@mui/icons-material/DarkMode';

const drawerWidth = 400;
const miniDrawerWidth = 72;

export default function MiniSidebar({
  filteredProjects,
  onSelectCategory,
  selectedCategory,
  markerRefs,
  isDarkMode,
  toggleDarkMode,
}) {
  const map = useMap(); // Allows us to use the map since we are a child
  const [open, setOpen] = useState(false); // Drawer state
  const toggleDrawer = () => setOpen(!open); // Toggle drawer open/close
  const [isLeftAligned, setIsLeftAligned] = useState(true); // Sidebar alignment
  const toggleSidebarPosition = () => setIsLeftAligned(!isLeftAligned); // Toggle sidebar position

  const handleZoomOut = () => {
    map.setZoom(9);
  };

  const handleProjectClick = (project, index) => {
    const latitude = parseFloat(project.Latitude);
    const longitude = parseFloat(project.Longitude);
    console.log("Navigating to:", latitude, longitude);

    const key = `${project["Project"]}-${index}`; // Ensure index is passed and consistent
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
    <Box sx={{ display: "flex" }}>
      {/* Mini Sidebar */}
      <Drawer
        variant="permanent"
        anchor={isLeftAligned ? "left" : "right"} // Adjust anchor dynamically
        PaperProps={{
          sx: {
            width: {
              xs: 56, // Extra small screens
              sm: 62, // Small screens
              md: 72, // Medium screens and above
            },
            overflowX: "hidden",
            backgroundColor: isDarkMode ? "#333" : "#fff",
            color: isDarkMode ? "#fff" : "#000",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "64px",
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>
          <ListItem disablePadding>
            <Tooltip title="Favorites" placement="right">
            <ListItemButton sx={{ justifyContent: "center" }}>
            <ListItemIcon sx={{ minWidth: "auto" }}>
                  <FavoriteIcon />
                </ListItemIcon>
              </ListItemButton>
            </Tooltip>
          </ListItem>
          <ListItem disablePadding>
            <Tooltip title="Starred Projects" placement="right">
            <ListItemButton sx={{ justifyContent: "center" }}>
            <ListItemIcon sx={{ minWidth: "auto" }}>
                  <StarIcon />
                </ListItemIcon>
              </ListItemButton>
            </Tooltip>
          </ListItem>
          <ListItem disablePadding>
                <Tooltip title="Toggle Dark Mode" placement="right">
      <ListItemButton sx={{ justifyContent: "center" }} onClick={toggleDarkMode}>
        <ListItemIcon sx={{ minWidth: "auto" }}>
          {isDarkMode ? (
            <DarkModeIcon sx={{ color: "#FFD700" }} /> // Yellow moon icon
          ) : (
            <WbSunnyIcon sx={{ color: "#FFD700" }} /> // Yellow sun icon
          )}
        </ListItemIcon>
      </ListItemButton>
    </Tooltip>
          </ListItem>
          <ListItem disablePadding>
            <Tooltip title="Zoom Out" placement="right">
              <ListItemButton sx={{ justifyContent: "center" }} onClick={handleZoomOut}>
                <ListItemIcon sx={{ minWidth: "auto" }}>
                  <ZoomOutMapIcon />
                </ListItemIcon>
              </ListItemButton>
            </Tooltip>
          </ListItem>
          <ListItem disablePadding>
            <Tooltip title="Toggle Sidebar Position" placement="right">
              <ListItemButton sx={{ justifyContent: "center" }} onClick={toggleSidebarPosition}>
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
        anchor={isLeftAligned ? "left" : "right"} // Adjust anchor dynamically
        open={open}
        onClose={toggleDrawer}
        variant="temporary"
        PaperProps={{
          sx: {
            width: {
              xs: '95vw', // 80% of the viewport width for extra small screens
              md: '35vw',
            },
            overflowY: "auto",
            backgroundColor: isDarkMode ? "#444" : "#f9f9f9",
            color: isDarkMode ? "#fff" : "#000",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 2,
          }}
        >
          <Typography variant="h6">Projects</Typography>
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Box>
        <Divider />

        {/* Controls Section */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr", // Two equal-width columns
            alignItems: "center",
            gap: 2, // Space between grid items
            padding: 2,
          }}
        >
          {/* Dropdown Menu */}
          <Box sx={{ gridColumn: "1 / span 1" }}>
            <ProjectDropdown
              onSelectCategory={onSelectCategory}
              selectedCategory={selectedCategory}
            />
          </Box>

          {/* Icons Section */}
          <Box
            sx={{
              gridColumn: "2 / span 1",
              display: "flex",
              justifyContent: "flex-end", // Align icons to the right
              gap: 2, // Space between icons
            }}
          >
            {/* Dark Mode Toggle */}
            <Tooltip title="Toggle Dark Mode" placement="top">
              <IconButton onClick={toggleDarkMode}>
                <Brightness4Icon />
              </IconButton>
            </Tooltip>

            {/* Sidebar Toggle */}
            <Tooltip title="Toggle Sidebar Position" placement="top">
              <IconButton onClick={toggleSidebarPosition}>
                <SwapHorizIcon />
              </IconButton>
            </Tooltip>

            {/* Zoom Button */}
            <Tooltip title="Zoom Out" placement="top">
              <IconButton onClick={handleZoomOut}>
                <ZoomOutMapIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Divider />

        {/* List of Projects */}
        <List>
          {filteredProjects.map((project, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                onClick={() => handleProjectClick(project, index)}
              >
                <ListItemIcon>
                  <Avatar
                    src={project["Profile Image Url"] || ""}
                    alt={project["Project"] || "Placeholder"}
                  />
                </ListItemIcon>
                <ListItemText primary={project["Project"]} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}
