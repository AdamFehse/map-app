"use client";

import React, { useState } from "react";
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

export default function MiniSidebar({
  filteredProjects,
  onSelectCategory,
  selectedCategory,
  markerRefs,
  isDarkMode,
  toggleDarkMode,
  categories = [],
}) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const toggleDrawer = () => setOpen(!open);
  const [isLeftAligned, setIsLeftAligned] = useState(true);
  const toggleSidebarPosition = () => setIsLeftAligned(!isLeftAligned);
  const map = useMap();

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
      {/* Permanent Drawer */}
      <Drawer
        variant="permanent"
        anchor={isLeftAligned ? "left" : "right"}
        PaperProps={{
          sx: {
            width: 60,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: 60,
              boxSizing: "border-box",
              backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff",
              color: isDarkMode ? "#ffffff" : "#000000",
            },
          },
        }}
      >
        <List>
          <ListItem disablePadding>
            <Tooltip title="Menu" placement="right">
              <ListItemButton
                sx={{ justifyContent: "center" }}
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
                  {isDarkMode ? <Brightness4Icon /> : <Brightness4Icon />}
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
