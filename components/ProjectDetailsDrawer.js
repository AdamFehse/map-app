import React from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Grid2,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "../styles/ProjectDetailsDrawer.css";

export default function ProjectDetailsDrawer({
  open,
  onClose,
  project,
  isDarkMode,
}) {
  if (!project) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        className: isDarkMode ? "drawer drawer-dark-mode" : "drawer",
        style: { width: "75%" },
      }}
    >
      <Box>
        {/* Header Section */}
        <Box className="drawer-header">
          <Typography variant="h6">{project["Project Name"]}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider className="drawer-divider" />

        {/* Grid2 Layout */}
        <Grid2 container spacing={2} className="drawer-grid-container">
          {/* Left Panel */}
          <Grid2 xs={12} md={4} className="drawer-grid-left">
            <Typography variant="subtitle1">Details</Typography>
            <ul>
              <li>
                <strong>Category:</strong> {project["Project Category"]}
              </li>
              <li>
                <strong>Artist:</strong> {project.Artist || "Unknown"}
              </li>
              <li>
                <strong>Year:</strong> {project.Year || "N/A"}
              </li>
              <li>
                <strong>Location:</strong> {project.Location || "Unknown"}
              </li>
              <li>
                <strong>Medium:</strong> {project.Medium || "Various"}
              </li>
            </ul>
          </Grid2>

          {/* Right Panel */}
          <Grid2 xs={12} md={8} className="drawer-grid-right">
            {project.ImageUrl && (
              <img
                src={project.ImageUrl}
                alt={project["Project Name"]}
                className="drawer-image"
              />
            )}
            <Typography variant="subtitle1" gutterBottom>
              Description:
            </Typography>
            <Typography variant="body2" className="drawer-description">
              {project.DescriptionLong || "No detailed description available."}
            </Typography>
          </Grid2>
        </Grid2>
      </Box>
    </Drawer>
  );
}
