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

  const handleClose = (category) => {
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
          <MenuItem onClick={() => handleClose("")}>All Projects</MenuItem>
          {categories.map((category) => (
            <MenuItem 
              key={category.value} 
              onClick={() => handleClose(category.value)}
            >
              {category.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
