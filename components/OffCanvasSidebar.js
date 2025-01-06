// components/OffCanvasSidebar.js
'use client';

import { Drawer, Box, Typography, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useMap } from 'react-leaflet';

export default function OffCanvasSidebar({ open, onClose }) {
  const map = useMap(); // Access the Leaflet map instance

  const handleZoomOut = () => {
    map.setZoom(9); // Set the map zoom level
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          width: 250,
          padding: 2,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 2,
          }}
        >
          <Typography variant="h6">Sidebar</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="body1" gutterBottom>
          Use the button below to zoom out the map to level 15.
        </Typography>
        <Button
          variant="contained"
          onClick={handleZoomOut}
        >
          Zoom Out to 15
        </Button>
      </Box>
    </Drawer>
  );
}
