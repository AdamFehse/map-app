import React, { useState } from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Box
} from '@mui/material';

export default function ProjectDropdown({ categories = [], onSelectCategory, selectedCategory }) {
  const [open, setOpen] = useState(false);

  // Debug logging
  console.log("ProjectDropdown received categories:", categories);
  console.log("ProjectDropdown selectedCategory:", selectedCategory);

  const handleClose = (category) => {
    console.log("ProjectDropdown handleClose called with category:", category);
    setOpen(false);
    onSelectCategory(category);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="category-select-label">Category</InputLabel>
        <Select
          labelId="category-select-label"
          id="category-select"
          open={open}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          value={selectedCategory || ""}
          label="Category"
        >
          <MenuItem key="all" onClick={() => handleClose("")}>All Projects</MenuItem>
          {categories.map((category, index) => (
            <MenuItem 
              key={category.Value || category.value || `category-${index}`}
              onClick={() => handleClose(category.Value || category.value)}
            >
              {category.Label || category.label || category.Value || category.value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
