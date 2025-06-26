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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
  Button,
  Chip,
  Menu,
  MenuItem,
  Collapse,
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
  Settings as SettingsIcon,
  ExpandMore as ExpandMoreIcon,
  ZoomIn as ZoomInIcon,
  MyLocation as MyLocationIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Clear as ClearIcon,
  Speed as SpeedIcon,
  Close as CloseIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
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
  const [showControls, setShowControls] = useState(false);
  const [settingsAnchor, setSettingsAnchor] = useState(null);
  const toggleSidebarPosition = () => setIsLeftAligned(!isLeftAligned);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  
  // Control panel states
  const [showProjectContainer, setShowProjectContainer] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState('normal');
  const [mapLayers, setMapLayers] = useState({
    roads: true,
    labels: true,
    terrain: false
  });

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
  }, [isDarkMode]);

  // Debug logs
  console.log("Filtered Projects:", filteredProjects);
  console.log("Selected Category:", selectedCategory);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSettingsClick = (event) => {
    setSettingsAnchor(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setSettingsAnchor(null);
  };

  // Control panel functions
  const handleResetView = () => {
    console.log("Reset view clicked");
  };

  const handleClearHistory = () => {
    console.log("Clear history clicked");
  };

  const handleExportData = () => {
    const data = {
      projects: filteredProjects,
      searchHistory: [],
      settings: {
        darkMode: isDarkMode,
        sidebarPosition: isLeftAligned,
        showProjectContainer,
        animationSpeed,
        mapLayers
      }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'map-data-export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ position: "relative", height: "100%" }}>
      {/* --- Temporary Drawer (Full Sidebar) --- */}
      <Drawer
        anchor={isLeftAligned ? "left" : "right"}
        open={open}
        onClose={onClose}
        variant="temporary"
        PaperProps={{
          sx: {
            width: 420,
            background: isDarkMode 
              ? 'rgba(26, 26, 26, 0.95)'
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            color: isDarkMode ? '#00ff88' : '#333333',
            border: 'none',
            boxShadow: isDarkMode 
              ? '0 8px 32px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(0, 255, 136, 0.1)'
              : '0 8px 32px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            overflow: 'hidden',
          },
        }}
      >
        {/* Compact Header Section */}
        <Box sx={{ 
          p: 2,
          background: 'transparent',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Header Content */}
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between",
            mb: 2
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: isDarkMode ? '#00ff88' : '#333333',
                fontWeight: 600,
                letterSpacing: '-0.3px',
                fontSize: '18px',
              }}
            >
              StoryMap
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Chip 
                label={searchFilteredProjects?.length || 0} 
                size="small"
                sx={{
                  backgroundColor: isDarkMode ? 'rgba(0, 255, 136, 0.2)' : 'rgba(0, 255, 136, 0.1)',
                  color: '#00ff88',
                  fontSize: '11px',
                  height: '22px',
                  fontWeight: 600,
                }}
              />
              
              <IconButton 
                size="small"
                onClick={handleSettingsClick}
                sx={{ 
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                  '&:hover': {
                    backgroundColor: isDarkMode ? 'rgba(0, 255, 136, 0.1)' : 'rgba(0, 255, 136, 0.05)',
                  }
                }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
              
              <IconButton 
                size="small"
                onClick={onClose}
                sx={{ 
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                  '&:hover': {
                    backgroundColor: isDarkMode ? 'rgba(255, 0, 0, 0.1)' : 'rgba(255, 0, 0, 0.05)',
                  }
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          
          {/* Compact Search and Filter Row */}
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            alignItems: 'center',
            mb: 1
          }}>
            {/* Search Field */}
            <TextField
              size="small"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ 
                      color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                      fontSize: 18
                    }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  '& fieldset': {
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  },
                  '&:hover fieldset': {
                    borderColor: isDarkMode ? 'rgba(0, 255, 136, 0.3)' : 'rgba(0, 255, 136, 0.3)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00ff88',
                  },
                },
                '& .MuiInputBase-input': {
                  color: isDarkMode ? '#ffffff' : '#333333',
                  '&::placeholder': {
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                  },
                },
              }}
            />
            
            {/* Filter Button */}
            <IconButton
              size="small"
              onClick={() => setShowControls(!showControls)}
              sx={{
                color: isDarkMode ? (showControls ? '#00ff88' : 'rgba(255, 255, 255, 0.7)') : (showControls ? '#00ff88' : 'rgba(0, 0, 0, 0.6)'),
                backgroundColor: showControls ? (isDarkMode ? 'rgba(0, 255, 136, 0.1)' : 'rgba(0, 255, 136, 0.05)') : 'transparent',
                '&:hover': {
                  backgroundColor: isDarkMode ? 'rgba(0, 255, 136, 0.1)' : 'rgba(0, 255, 136, 0.05)',
                }
              }}
            >
              <FilterListIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Collapsible Filter Section */}
          <Collapse in={showControls}>
            <Box sx={{ 
              pt: 1,
              borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            }}>
              {/* Category Filter */}
              <Box sx={{ mb: 2 }}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                    mb: 1,
                    display: 'block',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Category
                </Typography>
                <ProjectDropdown
                  onSelectCategory={onSelectCategory}
                  selectedCategory={selectedCategory}
                  categories={categories}
                />
              </Box>

              {/* Quick Toggle */}
              <FormControlLabel
                control={
                  <Switch
                    checked={showProjectContainer}
                    onChange={(e) => setShowProjectContainer(e.target.checked)}
                    size="small"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#00ff88',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 255, 136, 0.08)',
                        },
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#00ff88',
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ 
                    color: 'inherit', 
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}>
                    {showProjectContainer ? <VisibilityIcon sx={{ fontSize: 14 }} /> : <VisibilityOffIcon sx={{ fontSize: 14 }} />}
                    Show Project Container
                  </Typography>
                }
                sx={{ 
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                  ml: 0,
                }}
              />
            </Box>
          </Collapse>
        </Box>

        {/* Results Section - Takes up most of the space */}
        <Box sx={{ 
          flex: 1, 
          overflow: 'hidden', 
          display: 'flex', 
          flexDirection: 'column',
          minHeight: 0,
        }}>
          <List sx={{ 
            flex: 1,
            overflow: 'auto',
            backgroundColor: 'transparent',
            minHeight: 0,
            pt: 0,
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: isDarkMode ? 'rgba(0, 255, 136, 0.2)' : 'rgba(0, 0, 0, 0.1)',
              borderRadius: '2px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: isDarkMode ? 'rgba(0, 255, 136, 0.4)' : 'rgba(0, 0, 0, 0.2)',
            },
          }}>
            {searchFilteredProjects?.map((project) => {
              const originalIndex = filteredProjects.findIndex(
                (p) =>
                  p.Name === project.Name &&
                  p.Latitude === project.Latitude &&
                  p.Longitude === project.Longitude
              );
              const uniqueKey = `${project.Name}-${originalIndex}-${project.Latitude}-${project.Longitude}`;
              return (
                <ListItem key={uniqueKey} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton 
                    onClick={() => onProjectClick(project, originalIndex)}
                    sx={{
                      color: isDarkMode ? '#ffffff' : '#333333',
                      borderRadius: '8px',
                      mx: 1,
                      py: 1.5,
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        backgroundColor: isDarkMode ? 'rgba(0, 255, 136, 0.08)' : 'rgba(0, 255, 136, 0.04)',
                        transform: 'translateX(2px)',
                      },
                      '& .MuiListItemText-primary': {
                        color: 'inherit',
                        fontWeight: 500,
                        fontSize: '14px',
                      },
                      '& .MuiListItemText-secondary': {
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)',
                        fontSize: '12px',
                        mt: 0.5,
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 44 }}>
                      <Avatar 
                        src={project.ImageUrl || project.imageUrl}
                        sx={{ 
                          width: 36, 
                          height: 36,
                          backgroundColor: isDarkMode ? 'rgba(0, 255, 136, 0.1)' : 'rgba(0, 255, 136, 0.05)',
                          color: '#00ff88',
                          fontSize: '14px',
                          fontWeight: 600,
                        }}
                      >
                        {project.Name?.charAt(0)?.toUpperCase()}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={project.Name}
                      secondary={project.DescriptionShort}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
            {(!searchFilteredProjects || searchFilteredProjects.length === 0) && (
              <Box sx={{ 
                p: 4, 
                textAlign: 'center',
                color: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'
              }}>
                <SearchIcon sx={{ fontSize: 48, mb: 2, opacity: 0.3 }} />
                <Typography variant="body2" sx={{ fontSize: '14px' }}>
                  {searchTerm ? 'No projects found' : 'Search for projects to get started'}
                </Typography>
              </Box>
            )}
          </List>
        </Box>

        {/* Settings Menu */}
        <Menu
          anchorEl={settingsAnchor}
          open={Boolean(settingsAnchor)}
          onClose={handleSettingsClose}
          PaperProps={{
            sx: {
              backgroundColor: isDarkMode ? 'rgba(26, 26, 26, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
              boxShadow: isDarkMode 
                ? '0 8px 32px rgba(0, 0, 0, 0.8)'
                : '0 8px 32px rgba(0, 0, 0, 0.12)',
            }
          }}
        >
          <MenuItem onClick={() => { toggleDarkMode(); handleSettingsClose(); }}>
            <ListItemIcon sx={{ color: isDarkMode ? '#ffffff' : '#333333' }}>
              {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </ListItemIcon>
            <ListItemText primary={isDarkMode ? 'Light Mode' : 'Dark Mode'} />
          </MenuItem>
          <MenuItem onClick={() => { toggleSidebarPosition(); handleSettingsClose(); }}>
            <ListItemIcon sx={{ color: isDarkMode ? '#ffffff' : '#333333' }}>
              <SwapHorizIcon />
            </ListItemIcon>
            <ListItemText primary={`Move to ${isLeftAligned ? 'Right' : 'Left'}`} />
          </MenuItem>
          <MenuItem onClick={() => { handleExportData(); handleSettingsClose(); }}>
            <ListItemIcon sx={{ color: isDarkMode ? '#ffffff' : '#333333' }}>
              <DownloadIcon />
            </ListItemIcon>
            <ListItemText primary="Export Data" />
          </MenuItem>
        </Menu>
      </Drawer>
    </div>
  );
}
