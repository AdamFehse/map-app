import React, { useState } from "react";
import { Menu, MenuItem, Button } from "@mui/material";

export default function ProjectDropdown({ onSelectCategory }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (category) => {
    setAnchorEl(null);
    if (category !== null) {
      onSelectCategory(category);
    }
  };

  return (
    <div>
      <Button
        variant="outlined"
        onClick={handleOpen}
        aria-controls={open ? "category-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        Select Category
      </Button>
      <Menu
        id="category-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose(null)}
      >
        <MenuItem onClick={() => handleClose("")}>All Projects</MenuItem>
        <MenuItem onClick={() => handleClose("Art-Based Projects")}>
          Art-Based Projects
        </MenuItem>
        <MenuItem onClick={() => handleClose("Research Projects")}>
          Research Projects
        </MenuItem>
        <MenuItem
          onClick={() => handleClose("Education and Community Outreach")}
        >
          Education and Community Outreach
        </MenuItem>
      </Menu>
    </div>
  );
}
