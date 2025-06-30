import React from 'react';
import { CATEGORY_CONFIG } from './CategoryConfig';

const MAIN_CATEGORIES = [
  'Research Projects',
  'Art-Based Projects',
  'Education and Community Outreach',
  'Research',
];

const MapLegend = () => {
  return (
    <div style={{
      position: 'absolute',
      top: '150px', // Positioned below the MapTitle
      right: '30px',
      maxWidth: '200px',
      background: 'rgba(255,255,255,0.18)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      padding: '10px 16px',
      borderRadius: '14px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
      zIndex: 1000,
      fontFamily: 'sans-serif',
      color: '#222',
      border: '1.5px solid rgba(255,255,255,0.35)',
      textAlign: 'center',
      fontSize: '13px',
      letterSpacing: '0.01em',
    }}>
      <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: 8, letterSpacing: '0.04em' }}>
        Legend
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
        <div>
          <span style={{ fontSize: '18px', marginRight: 8 }}>📖</span>
          <span>Large Cluster</span>
        </div>
        <div>
          <span style={{ fontSize: '18px', marginRight: 8 }}>🌵</span>
          <span>Medium Cluster</span>
        </div>
        <div>
          <span style={{ fontSize: '18px', marginRight: 8 }}>🚶‍♂️🚶‍♀️</span>
          <span>Small Cluster</span>
        </div>
        <div style={{ height: 1, background: 'rgba(0,0,0,0.07)', margin: '7px 0' }} />
        {MAIN_CATEGORIES.map(cat => {
          const config = CATEGORY_CONFIG[cat];
          return (
            <div key={cat} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <span style={{ fontSize: '18px', marginRight: 8 }}>{config.icon}</span>
              <span style={{ color: config.color }}>{config.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MapLegend; 