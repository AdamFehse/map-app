import React from 'react';

const MapTitle = () => {
  return (
    <div style={{
      position: 'absolute',
      top: '25px',
      right: '25px',
      zIndex: 1000,
      textAlign: 'right',
      pointerEvents: 'none',
    }}>
      <h1 style={{
        fontFamily: "'Cinzel', serif",
        margin: '0',
        fontSize: '38px',
        fontWeight: '700',
        color: '#ffffff',
        textShadow: '0px 0px 3px rgba(0, 0, 0, 0.9), 0px 0px 8px rgba(0, 0, 0, 0.7)',
        letterSpacing: '0.05em',
      }}>
        El ChisMapa
      </h1>
      <p style={{
        fontFamily: "'Roboto', sans-serif",
        margin: '0',
        fontSize: '15px',
        fontStyle: 'italic',
        color: '#ffffff',
        textShadow: '0px 0px 3px rgba(0, 0, 0, 0.9), 0px 0px 6px rgba(0, 0, 0, 0.7)',
        lineHeight: '1.3',
        maxWidth: '280px',
        float: 'right',
      }}>
        A living map of borderlands stories, projects, and connections.
      </p>
    </div>
  );
};

export default MapTitle; 