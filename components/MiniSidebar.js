import React, { useState, useEffect } from "react";
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


export default function MiniSidebar({
  filteredProjects,
  searchFilteredProjects,
  onSelectCategory,
  selectedCategory,
  markerRefs,
  categories = [],
  open,
  onClose,
  searchTerm,
  setSearchTerm,
  onProjectClick,
}) {
  const [isLeftAligned, setIsLeftAligned] = useState(true);
  const toggleSidebarPosition = () => setIsLeftAligned(!isLeftAligned);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
  }, [isDarkMode]);

  // Debug logs
  console.log("Filtered Projects:", filteredProjects);
  console.log("Selected Category:", selectedCategory);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div style={{ position: "relative", height: "100%" }}>
      {/*
      // --- Permanent Drawer (Mini Sidebar) ---
      // Commented out for now, but kept for possible future use.
      <Drawer
        variant="permanent"
        anchor={isLeftAligned ? "left" : "right"}
        sx={{
          width: 60,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 60,
            boxSizing: 'border-box',
            background: 'linear-gradient(135deg, #23293a 0%, #1a1a1a 100%)',
            color: '#00ff88',
            borderRight: isLeftAligned ? '4px solid #00ff88' : 'none',
            borderLeft: !isLeftAligned ? '4px solid #00ff88' : 'none',
            boxShadow: '0 0 16px #00ff88, 0 2px 8px #000',
            filter: 'drop-shadow(0 0 8px #00ff88)',
            transition: 'background 0.3s, color 0.3s, box-shadow 0.3s',
          },
        }}
      >
        ...
      </Drawer>
      */}
      {/* --- Temporary Drawer (Full Sidebar) --- */}
      <Drawer
        anchor={isLeftAligned ? "left" : "right"}
        open={open}
        onClose={onClose}
        variant="temporary"
        PaperProps={{
          sx: {
            width: 404,
            background: 'linear-gradient(135deg, #1a1a1a 0%, #23293a 100%)',
            color: '#00ff88',
            borderRight: isLeftAligned ? '4px solid #00ff88' : 'none',
            borderLeft: !isLeftAligned ? '4px solid #00ff88' : 'none',
            boxShadow: '0 0 20px #00ff88, 0 4px 12px #000',
            filter: 'drop-shadow(0 0 10px #00ff88)',
            transition: 'background 0.3s, color 0.3s, box-shadow 0.3s, border 0.3s',
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", p: 1 }}>
          <Typography variant="h6">Projects</Typography>
          <IconButton onClick={onClose}>
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
            const originalIndex = filteredProjects.findIndex(
              (p) =>
                p.Name === project.Name &&
                p.Latitude === project.Latitude &&
                p.Longitude === project.Longitude
            );
            const uniqueKey = `${project.Name}-${originalIndex}-${project.Latitude}-${project.Longitude}`;
            return (
              <ListItem key={uniqueKey} disablePadding>
                <ListItemButton onClick={() => onProjectClick(project, originalIndex)}>
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
    </div>
  );
}
