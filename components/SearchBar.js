import React, { useState, useRef } from 'react';

const SEARCH_BAR_WIDTH = 360;
const SEARCH_BAR_LEFT = 50;
const SEARCH_BAR_TOP = 20;
const SEARCH_BAR_HEIGHT = 52;

export default function SearchBar({ onMenuClick, areaInfo, searchHistory, onSearch, searchTerm, setSearchTerm, filteredProjects = [], onProjectSelect, areaProject, areaProjects = [], mapZoom = 11 }) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef();

  return (
    <>
      <div
        className="search-container"
        style={{
          position: 'absolute',
          top: SEARCH_BAR_TOP,
          left: SEARCH_BAR_LEFT,
          zIndex: 1000,
          width: `calc(100vw - ${SEARCH_BAR_LEFT * 2}px)`,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          fontFamily: 'Inter, Arial, sans-serif',
          gap: 16,
        }}
      >
        {/* Search bar with fixed width */}
        <div style={{ width: SEARCH_BAR_WIDTH, minWidth: SEARCH_BAR_WIDTH, flexShrink: 0 }}>
          <div
            className="searchbox"
            style={{
              width: '100%',
              background: '#181c24',
              borderRadius: 14,
              boxShadow: '0 2px 12px rgba(0,0,0,0.13)',
              display: 'flex',
              alignItems: 'center',
              padding: '0 10px',
              minHeight: 48,
              border: '1.5px solid #23293a',
              boxSizing: 'border-box',
            }}
          >
            <form className="search-form" onSubmit={e => { e.preventDefault(); onSearch(searchTerm); }} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <label htmlFor="search-input" style={{ display: 'none' }}>Search Google Maps</label>
              <input
                id="search-input"
                ref={inputRef}
                type="text"
                placeholder="Search..."
                autoComplete="off"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 200)}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: 17,
                  width: '100%',
                  background: 'transparent',
                  color: '#fff',
                  padding: '12px 0',
                  fontWeight: 500,
                  letterSpacing: 0.2,
                }}
              />
            </form>
            <button
              className="search-btn"
              aria-label="Search"
              onClick={() => onSearch(searchTerm)}
              style={{
                background: 'none',
                border: 'none',
                color: '#00ff88',
                fontSize: 24,
                width: 44,
                height: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
                marginLeft: 4,
                marginRight: 2,
                cursor: 'pointer',
                transition: 'background 0.18s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#23293a'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              🔍
            </button>
            <button
              className="directions-btn"
              aria-label="Directions"
              style={{
                background: 'none',
                border: 'none',
                color: '#00ff88',
                fontSize: 24,
                width: 44,
                height: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
                marginLeft: 2,
                cursor: 'pointer',
                transition: 'background 0.18s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#23293a'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              ➡️
            </button>
          </div>
        </div>

        {/* Project row - integrated in the flex layout */}
        {mapZoom >= 12 && areaProjects.length > 0 && (
          <div
            style={{
              flex: 1,
              minWidth: 0, // Important for flex child to shrink
              height: SEARCH_BAR_HEIGHT,
              display: 'flex',
              alignItems: 'center',
              background: '#181c24',
              borderRadius: 14,
              border: '1.5px solid #23293a',
              boxShadow: '0 2px 12px rgba(0,0,0,0.13)',
              padding: '0 12px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                overflowX: 'auto',
                overflowY: 'hidden',
                width: '100%',
                height: '100%',
                paddingTop: 4,
                paddingBottom: 4,
                // Custom scrollbar styling
                scrollbarWidth: 'thin',
                scrollbarColor: '#23293a #181c24',
              }}
              // Add webkit scrollbar styles for better cross-browser support
              onLoad={e => {
                const style = document.createElement('style');
                style.textContent = `
                  .project-scroll::-webkit-scrollbar {
                    height: 6px;
                  }
                  .project-scroll::-webkit-scrollbar-track {
                    background: #181c24;
                    border-radius: 3px;
                  }
                  .project-scroll::-webkit-scrollbar-thumb {
                    background: #23293a;
                    border-radius: 3px;
                  }
                  .project-scroll::-webkit-scrollbar-thumb:hover {
                    background: #2a3040;
                  }
                `;
                document.head.appendChild(style);
                e.currentTarget.classList.add('project-scroll');
              }}
            >
              {areaProjects.map((project, i) => (
                <button
                  key={project.Name + i}
                  onClick={() => onProjectSelect && onProjectSelect(project)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: '#23293a',
                    border: '1px solid #2a3040',
                    borderRadius: 8,
                    padding: '8px 10px',
                    minWidth: 80,
                    maxWidth: 100,
                    cursor: 'pointer',
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 500,
                    transition: 'all 0.18s ease',
                    outline: 'none',
                    flexShrink: 0, // Prevent shrinking
                    height: 'fit-content',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#00ff88';
                    e.currentTarget.style.color = '#000';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#23293a';
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <img
                    src={project.ImageUrl || project.imageUrl || 'https://placehold.co/32x32'}
                    alt={project.Name}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 6,
                      objectFit: 'cover',
                      marginBottom: 4,
                      border: '1px solid #181c24',
                      flexShrink: 0,
                    }}
                  />
                  <span style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '100%',
                    lineHeight: 1.2,
                  }}>
                    {project.Name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {focused && (
        <div
          className="search-dropdown"
          style={{
            position: 'absolute',
            top: SEARCH_BAR_TOP + SEARCH_BAR_HEIGHT + 8,
            left: SEARCH_BAR_LEFT,
            width: SEARCH_BAR_WIDTH,
            boxSizing: 'border-box',
            background: '#181c24',
            borderRadius: 16,
            boxShadow: '0 8px 32px rgba(0,0,0,0.22)',
            padding: 12,
            zIndex: 1001,
            border: '1.5px solid #23293a',
            fontFamily: 'Inter, Arial, sans-serif',
            transition: 'opacity 0.18s, transform 0.18s',
            opacity: focused ? 1 : 0,
            transform: focused ? 'translateY(0)' : 'translateY(10px)',
            pointerEvents: focused ? 'auto' : 'none',
          }}
        >
          {searchTerm ? (
            <>
              <strong style={{ color: '#00ff88', fontWeight: 600, fontSize: 13, letterSpacing: 1 }}>Results</strong>
              <ul style={{ maxHeight: 240, overflowY: 'auto', margin: 0, padding: 0, listStyle: 'none' }}>
                {filteredProjects.length === 0 && <li style={{ padding: 8, color: '#888', fontSize: 13 }}>No results</li>}
                {filteredProjects.map((project, i) => (
                  <li
                    key={i}
                    style={{
                      cursor: 'pointer',
                      padding: '7px 8px',
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      transition: 'background 0.18s',
                      marginBottom: 2,
                    }}
                    onMouseDown={() => {
                      onProjectSelect && onProjectSelect(project);
                      setTimeout(() => setFocused(false), 100);
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#23293a'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <img
                      src={project.ImageUrl || project.imageUrl || 'https://placehold.co/32x32'}
                      alt={project.Name}
                      style={{ width: 32, height: 32, borderRadius: 7, objectFit: 'cover', flexShrink: 0, border: '1px solid #23293a', background: '#23293a' }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                      <span style={{ fontWeight: 500, color: '#fff', fontSize: 15, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{project.Name}</span>
                      <span style={{ fontSize: 12, color: '#b0b0b0', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 1 }}>{project.DescriptionShort}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <div>
                <strong style={{ color: '#00ff88', fontWeight: 600, fontSize: 13, letterSpacing: 1 }}>Recent Searches</strong>
                <ul style={{ fontSize: 13 }}>
                  {searchHistory.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
              <div style={{ marginTop: 12, borderTop: '1px solid #23293a', paddingTop: 8 }}>
                <strong style={{ color: '#00ff88', fontWeight: 600, fontSize: 13, letterSpacing: 1 }}>This Area</strong>
                {areaProject ? (
                  <div
                    style={{
                      marginTop: 6,
                      background: '#23293a',
                      borderRadius: 10,
                      padding: '10px 12px',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: 15,
                      fontWeight: 500,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                      transition: 'background 0.18s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}
                    onMouseDown={() => onProjectSelect && onProjectSelect(areaProject)}
                    onMouseEnter={e => e.currentTarget.style.background = '#00ff88'}
                    onMouseLeave={e => e.currentTarget.style.background = '#23293a'}
                  >
                    <img
                      src={areaProject.ImageUrl || areaProject.imageUrl || 'https://placehold.co/32x32'}
                      alt={areaProject.Name}
                      style={{ width: 32, height: 32, borderRadius: 7, objectFit: 'cover', flexShrink: 0, border: '1px solid #23293a', background: '#23293a' }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                      <span style={{ fontWeight: 500, color: '#fff', fontSize: 15, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{areaProject.Name}</span>
                      {areaProject.DescriptionShort && (
                        <div style={{ fontSize: 13, color: '#b0b0b0', fontWeight: 400, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{areaProject.DescriptionShort}</div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ color: '#b0b0b0', fontSize: 13, marginTop: 6 }}>{areaInfo}</div>
                )}
              </div>
            </>
          )}
          <div style={{ marginTop: 12, borderTop: '1px solid #23293a', paddingTop: 8 }}>
            <button onClick={onMenuClick} style={{ marginTop: 8, width: '100%', background: '#23293a', color: '#00ff88', border: 'none', borderRadius: 7, padding: '10px 0', fontWeight: 600, fontSize: 15, letterSpacing: 1, cursor: 'pointer', transition: 'background 0.18s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#00ff88'}
              onMouseLeave={e => e.currentTarget.style.background = '#23293a'}
            >▼ Open Sidebar</button>
          </div>
        </div>
      )}
    </>
  );
}