import React, { useState } from 'react';
import ProjectGallery from './ProjectGallery';
import MiniSidebar from './MiniSidebar';

export default function ProjectGalleryDropdown({
  isOpen,
  onClose,
  projects,
  markerRefs,
  mapBounds,
  mapRef,
  onMarkerHover,
  onMarkerLeave,
  onMarkerClick,
  style = {},
}) {
  const [miniSidebarOpen, setMiniSidebarOpen] = useState(false);

  return (
    <div
      style={{
        position: 'absolute',
        top: 80, // adjust as needed for your SearchBar position
        left: 50, // adjust as needed for your SearchBar position
        width: 400, // adjust as needed
        zIndex: 2000,
        borderRadius: 16,
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.18)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: '1.5px solid rgba(255,255,255,0.35)',
        ...style,
      }}
    >
      {/* MiniSidebar Toggle Button */}
      <button
        onClick={() => setMiniSidebarOpen(true)}
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 2100,
          background: 'rgba(255,255,255,0.22)',
          border: '1.5px solid rgba(255,255,255,0.44)',
          color: '#222',
          fontWeight: 700,
          fontFamily: 'inherit',
          fontSize: 15,
          borderRadius: 8,
          padding: '7px 16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
          cursor: 'pointer',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          transition: 'background 0.2s, color 0.2s',
        }}
        title="Open Sidebar"
      >
        Sidebar
      </button>
      <ProjectGallery
        isOpen={isOpen}
        onClose={onClose}
        projects={projects}
        markerRefs={markerRefs}
        mapBounds={mapBounds}
        mapRef={mapRef}
        onMarkerHover={onMarkerHover}
        onMarkerLeave={onMarkerLeave}
        onMarkerClick={onMarkerClick}
      />
      {/* MiniSidebar Modal */}
      {miniSidebarOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 3000,
            background: 'rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ position: 'relative', zIndex: 3100 }}>
            <MiniSidebar
              open={miniSidebarOpen}
              onClose={() => setMiniSidebarOpen(false)}
              filteredProjects={projects}
              searchFilteredProjects={projects}
              markerRefs={markerRefs}
              // Add other required props as needed
            />
            <button
              onClick={() => setMiniSidebarOpen(false)}
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 3200,
                background: 'rgba(255,255,255,0.22)',
                border: '1.5px solid rgba(255,255,255,0.44)',
                color: '#222',
                fontWeight: 700,
                fontFamily: 'inherit',
                fontSize: 15,
                borderRadius: 8,
                padding: '4px 10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                transition: 'background 0.2s, color 0.2s',
              }}
              title="Close Sidebar"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 