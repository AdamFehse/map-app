// components/Sidebar.js
import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
} from "@mui/material";

export default function Sidebar({ projects, onProjectClick, isOpen }) {
  return (
    <Drawer
      anchor="left"
      open={isOpen}
      variant="temporary"
      PaperProps={{
        sx: { width: 300 },
      }}
    >
      <List>
        {projects.map((project, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton onClick={() => onProjectClick(project)}>
              <ListItemIcon>
                <Avatar
                  src={project.imageUrl || ""}
                  alt={project.Project || "Placeholder"}
                />
              </ListItemIcon>
              <ListItemText primary={project.Project} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
