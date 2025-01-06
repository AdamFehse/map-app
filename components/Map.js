// components/Map.js
"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import { useState } from "react";
import OffCanvasSidebar from "./OffCanvasSidebar";
import SidebarToggleButton from "./SidebarToggleButton";

export default function Map() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <MapContainer
      center={[31.916004, -110.990274]}
      zoom={9}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {/* Sidebar Toggle Button */}
      <SidebarToggleButton onClick={() => setSidebarOpen(true)} />

      {/* Sidebar */}
      <OffCanvasSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
    </MapContainer>
  );
}
