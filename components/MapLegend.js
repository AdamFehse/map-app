import React, { useState } from 'react';
import { CATEGORY_CONFIG } from './CategoryConfig';

const MAIN_CATEGORIES = [
  'Research Projects',
  'Art-Based Projects',
  'Education and Community Outreach',
  'Research',
];

const LEGEND_WIDTH = 220;
const TAB_WIDTH = 36;

const MapLegend = () => {
  const [open, setOpen] = useState(false);
  
  return (
    <div style={{
      position: 'fixed', // Changed from absolute to fixed
      top: 150,
      right: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'flex-start',
      height: 'auto',
      pointerEvents: 'none',
      transform: open ? 'translateX(0)' : `translateX(${LEGEND_WIDTH}px)`, // Simplified transform
      transition: 'transform 0.5s cubic-bezier(.77,0,.18,1)',
    }}>
      {/* Tab Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          pointerEvents: 'auto',
          width: TAB_WIDTH,
          height: 80,
          borderRadius: '14px 0 0 14px',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.44)',
          borderRight: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
          color: '#fff',
          fontFamily: 'Cinzel, serif',
          fontWeight: 700,
          fontSize: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          marginRight: 1,
          zIndex: 1001,
          transition: 'background 0.2s, color 0.2s',
          position: 'relative',
          top: 14,
          letterSpacing: '0.05em',
          padding: 0,
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          textShadow: '0px 0px 3px rgba(0,0,0,0.9), 0px 0px 8px rgba(0,0,0,0.7)',
        }}
        title={open ? 'Hide legend' : 'Show legend'}
      >
        <span style={{fontWeight: 700, fontFamily: 'Cinzel, serif', fontSize: 16, letterSpacing: '0.05em', userSelect: 'none', color: '#fff', textShadow: '0px 0px 3px rgba(0,0,0,0.9), 0px 0px 8px rgba(0,0,0,0.7)'}}>{open ? 'Close' : 'Legend'}</span>
      </button>
      {/* Legend Panel */}
      <div
        style={{
          width: LEGEND_WIDTH,
          maxWidth: LEGEND_WIDTH,
          minWidth: LEGEND_WIDTH,
          background: 'rgba(255,255,255,0.18)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          padding: '12px 16px',
          borderRadius: '14px 0 0 14px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
          fontFamily: 'sans-serif',
          color: '#222',
          border: '1.5px solid rgba(255,255,255,0.35)',
          borderRight: 'none',
          textAlign: 'left',
          fontSize: '13px',
          letterSpacing: '0.01em',
          marginLeft: -2,
          pointerEvents: open ? 'auto' : 'none',
          opacity: open ? 1 : 0.7,
          position: 'relative',
          transition: 'opacity 0.2s',
        }}
      >
        <div style={{
          fontFamily: "'Cinzel', serif",
          fontWeight: 700,
          fontSize: '28px',
          color: '#fff',
          textShadow: '0px 0px 3px rgba(0,0,0,0.9), 0px 0px 8px rgba(0,0,0,0.7)',
          letterSpacing: '0.05em',
          textAlign: 'center',
          margin: '0 0 6px 0',
          padding: 0,
        }}>
          Legend
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', textAlign: 'left', padding: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: '18px', marginRight: 6 }}>📖</span>
            <span>Large Cluster</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: '18px', marginRight: 6 }}>🌵</span>
            <span>Medium Cluster</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: '18px', marginRight: 6 }}>🚶‍♂️🚶‍♀️</span>
            <span>Small Cluster</span>
          </div>
          <div style={{ height: 1, background: 'rgba(0,0,0,0.07)', margin: '5px 0' }} />
          {MAIN_CATEGORIES.map(cat => {
            const config = CATEGORY_CONFIG[cat];
            return (
              <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '18px', marginRight: 6 }}>{config.icon}</span>
                <span style={{ color: config.color }}>{config.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MapLegend;
