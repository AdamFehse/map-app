import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useDarkMode } from "../contexts/DarkModeContext";

const SEARCH_BAR_WIDTH = 360;
const SEARCH_BAR_LEFT = 50;
const SEARCH_BAR_TOP = 20;
const SEARCH_BAR_HEIGHT = 52;

export default function SearchBar({
  onMenuClick,
  areaInfo,
  searchHistory,
  onSearch,
  searchTerm,
  setSearchTerm,
  filteredProjects = [],
  onProjectSelect,
  areaProject,
  areaProjects = [],
  mapZoom = 11,
}) {
  const [focused, setFocused] = useState(true);
  const [projectContainerHovered, setProjectContainerHovered] = useState(false);
  const [projectContainerExpanded, setProjectContainerExpanded] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  
  const inputRef = useRef();
  const dropdownRef = useRef();
  const scrollContainerRef = useRef();
  const projectContainerTimeoutRef = useRef();

  // Smooth scroll with easing
  const smoothScrollTo = (element, to, duration = 300) => {
    const start = element.scrollLeft;
    const change = to - start;
    const startTime = performance.now();

    const animateScroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out-cubic)
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      
      element.scrollLeft = start + (change * easeOutCubic);
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };
    
    requestAnimationFrame(animateScroll);
  };

  // Check scroll state
  const checkScrollState = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Scroll handlers
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      const newScrollLeft = Math.max(0, scrollContainerRef.current.scrollLeft - scrollAmount);
      smoothScrollTo(scrollContainerRef.current, newScrollLeft);
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      const maxScroll = scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth;
      const newScrollLeft = Math.min(maxScroll, scrollContainerRef.current.scrollLeft + scrollAmount);
      smoothScrollTo(scrollContainerRef.current, newScrollLeft);
    }
  };

  // Handle clicking outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      // Don't close if clicking on the dark mode button
      if (event.target.closest('.dark-mode-btn')) {
        return;
      }
      
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setFocused(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Check scroll state when projects change or container expands
  useEffect(() => {
    if (scrollContainerRef.current) {
      const timeoutId = setTimeout(checkScrollState, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [areaProjects, projectContainerExpanded]);

  // Handle project container hover with delay
  const handleProjectContainerEnter = () => {
    if (projectContainerTimeoutRef.current) {
      clearTimeout(projectContainerTimeoutRef.current);
    }
    setProjectContainerHovered(true);
    setProjectContainerExpanded(true);
  };

  const handleProjectContainerLeave = () => {
    setProjectContainerHovered(false);
    projectContainerTimeoutRef.current = setTimeout(() => {
      setProjectContainerExpanded(false);
    }, 300);
  };

  return (
    <>
      <div
        className="search-container"
        style={{
          position: "absolute",
          top: SEARCH_BAR_TOP,
          left: SEARCH_BAR_LEFT,
          zIndex: 1000,
          width: SEARCH_BAR_WIDTH,
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          fontFamily: "Inter, Arial, sans-serif",
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            className="searchbox"
            style={{
              width: "100%",
              background: isDarkMode ? "#181c24" : "#ffffff",
              borderRadius: 14,
              boxShadow: isDarkMode 
                ? "0 2px 12px rgba(0,0,0,0.13)" 
                : "0 2px 12px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              padding: "0 10px",
              minHeight: 48,
              border: isDarkMode ? "1.5px solid #23293a" : "1.5px solid #e0e0e0",
              boxSizing: "border-box",
            }}
          >
            <form
              className="search-form"
              onSubmit={(e) => {
                e.preventDefault();
                onSearch(searchTerm);
              }}
              style={{ display: "flex", alignItems: "center", width: "100%" }}
            >
              <label htmlFor="search-input" style={{ display: "none" }}>
                Search Google Maps
              </label>
              <input
                id="search-input"
                ref={inputRef}
                type="text"
                placeholder="Search..."
                autoComplete="off"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 200)}
                style={{
                  border: "none",
                  outline: "none",
                  fontSize: 17,
                  width: "100%",
                  background: "transparent",
                  color: isDarkMode ? "#fff" : "#000",
                  padding: "12px 0",
                  fontWeight: 500,
                  letterSpacing: 0.2,
                }}
              />
            </form>
            <button
              className="dark-mode-btn"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              onClick={toggleDarkMode}
              style={{
                background: "none",
                border: "none",
                color: "#00ff88",
                fontSize: 20,
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
                marginLeft: 8,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#23293a";
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "none";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {isDarkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </div>

      {/* Modern animated project container */}
      <AnimatePresence>
        {mapZoom >= 11 && areaProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            role="region"
            aria-label={`${areaProjects.length} projects in this area`}
            onMouseEnter={handleProjectContainerEnter}
            onMouseLeave={handleProjectContainerLeave}
            style={{
              position: "fixed",
              top: SEARCH_BAR_TOP,
              left: SEARCH_BAR_LEFT + SEARCH_BAR_WIDTH + 16,
              zIndex: 1000,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              overflowX: "auto",
              overflowY: "hidden",
              maxWidth: projectContainerExpanded ? 650 : 400,
              height: projectContainerExpanded ? 120 : 52,
              gap: projectContainerExpanded ? 16 : 8,
              padding: projectContainerExpanded ? "16px 20px" : "8px 12px",
              background: isDarkMode
                ? "linear-gradient(135deg, rgba(24, 28, 36, 0.95) 0%, rgba(35, 41, 58, 0.95) 100%)"
                : "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 245, 245, 0.95) 100%)",
              borderRadius: projectContainerExpanded ? 20 : 14,
              border: isDarkMode 
                ? "1px solid rgba(255, 255, 255, 0.15)" 
                : "1px solid rgba(0, 0, 0, 0.1)",
              boxShadow: projectContainerExpanded 
                ? (isDarkMode 
                    ? "0 8px 32px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.2)"
                    : "0 8px 32px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.05)")
                : (isDarkMode 
                    ? "0 4px 16px rgba(0, 0, 0, 0.3)"
                    : "0 4px 16px rgba(0, 0, 0, 0.1)"),
              backdropFilter: "blur(10px)",
              scrollbarWidth: "thin",
              scrollbarColor: isDarkMode 
                ? "rgba(255, 255, 255, 0.3) transparent"
                : "rgba(0, 0, 0, 0.3) transparent",
              opacity: projectContainerHovered ? 1 : 0.85,
              transition: "all 0.3s ease",
              pointerEvents: "auto",
            }}
          >
            {/* Left scroll button */}
            <AnimatePresence>
              {canScrollLeft && projectContainerExpanded && (
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onClick={scrollLeft}
                  aria-label="Scroll left"
                  style={{
                    position: "absolute",
                    left: 8,
                    top: "40%",
                    transform: "translateY(-50%)",
                    zIndex: 1002,
                    width: 32,
                    height: 32,
                    background: "rgba(0, 255, 136, 0.9)",
                    border: "none",
                    borderRadius: "50%",
                    color: "#000",
                    fontSize: 14,
                    fontWeight: "bold",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                    transition: "all 0.2s ease",
                  }}
                  whileHover={{ scale: 1.1, background: "rgba(0, 255, 136, 1)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  ‹
                </motion.button>
              )}
            </AnimatePresence>

            {/* Scrollable projects container */}
            <div
              ref={scrollContainerRef}
              onScroll={checkScrollState}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                overflowX: "auto",
                overflowY: "hidden",
                scrollBehavior: "smooth",
                gap: projectContainerExpanded ? 16 : 8,
                padding: projectContainerExpanded ? "16px 20px" : "8px 12px",
                paddingLeft: canScrollLeft && projectContainerExpanded ? 48 : (projectContainerExpanded ? 20 : 12),
                paddingRight: canScrollRight && projectContainerExpanded ? 48 : (projectContainerExpanded ? 20 : 12),
                width: "100%",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
              // Hide scrollbar
              className="hide-scrollbar"
            >
              {areaProjects.map((project, i) => (
                <motion.button
                  key={project.Name + i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -2,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onProjectSelect && onProjectSelect(project)}
                  aria-label={`Select project: ${project.Name}`}
                  style={{
                    display: "flex",
                    flexDirection: projectContainerExpanded ? "column" : "row",
                    alignItems: "center",
                    justifyContent: "center",
                    background: isDarkMode ? "#23293a" : "#f5f5f5",
                    border: isDarkMode 
                      ? "1px solid rgba(255, 255, 255, 0.1)" 
                      : "1px solid rgba(0, 0, 0, 0.1)",
                    borderRadius: projectContainerExpanded ? 12 : 8,
                    padding: projectContainerExpanded ? "12px 16px" : "6px 8px",
                    minWidth: projectContainerExpanded ? 140 : 80,
                    maxWidth: projectContainerExpanded ? 180 : 120,
                    height: projectContainerExpanded ? 88 : 36,
                    cursor: "pointer",
                    color: isDarkMode ? "#ffffff" : "#000000",
                    fontSize: projectContainerExpanded ? 14 : 11,
                    fontWeight: 600,
                    lineHeight: 1.2,
                    outline: "none",
                    flexShrink: 0,
                    transition: "all 0.2s ease",
                    gap: projectContainerExpanded ? 8 : 6,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#00ff88";
                    e.currentTarget.style.color = "#000000";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 20px rgba(0, 255, 136, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isDarkMode ? "#23293a" : "#f5f5f5";
                    e.currentTarget.style.color = isDarkMode ? "#ffffff" : "#000000";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <img
                    src={
                      project.ImageUrl ||
                      project.imageUrl ||
                      "https://placehold.co/32x32/23293a/ffffff?text=P"
                    }
                    alt=""
                    role="presentation"
                    style={{
                      width: projectContainerExpanded ? 40 : 24,
                      height: projectContainerExpanded ? 40 : 24,
                      borderRadius: projectContainerExpanded ? 8 : 4,
                      objectFit: "cover",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      flexShrink: 0,
                    }}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placehold.co/32x32/23293a/ffffff?text=P";
                    }}
                  />
                  <span
                    style={{
                      fontSize: projectContainerExpanded ? 13 : 11,
                      fontWeight: 600,
                      lineHeight: 1.2,
                      color: "inherit",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: projectContainerExpanded ? "100%" : "60px",
                      textAlign: projectContainerExpanded ? "center" : "left",
                    }}
                  >
                    {project.Name}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Right scroll button */}
            <AnimatePresence>
              {canScrollRight && projectContainerExpanded && (
                <motion.button
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  onClick={scrollRight}
                  aria-label="Scroll right"
                  style={{
                    position: "absolute",
                    right: 8,
                    top: "40%",
                    transform: "translateY(-50%)",
                    zIndex: 1002,
                    width: 32,
                    height: 32,
                    background: "rgba(0, 255, 136, 0.9)",
                    border: "none",
                    borderRadius: "50%",
                    color: "#000",
                    fontSize: 14,
                    fontWeight: "bold",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                    transition: "all 0.2s ease",
                  }}
                  whileHover={{ scale: 1.1, background: "rgba(0, 255, 136, 1)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  ›
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {focused && (
        <div
          className="search-dropdown"
          ref={dropdownRef}
          style={{
            position: "absolute",
            top: SEARCH_BAR_TOP + SEARCH_BAR_HEIGHT + 8,
            left: SEARCH_BAR_LEFT,
            width: SEARCH_BAR_WIDTH,
            boxSizing: "border-box",
            background: isDarkMode ? "#181c24" : "#ffffff",
            borderRadius: 16,
            boxShadow: isDarkMode 
              ? "0 8px 32px rgba(0,0,0,0.22)" 
              : "0 8px 32px rgba(0,0,0,0.1)",
            padding: 12,
            zIndex: 1001,
            border: isDarkMode ? "1.5px solid #23293a" : "1.5px solid #e0e0e0",
            fontFamily: "Inter, Arial, sans-serif",
            transition: "opacity 0.18s, transform 0.18s",
            opacity: focused ? 1 : 0,
            transform: focused ? "translateY(0)" : "translateY(10px)",
            pointerEvents: focused ? "auto" : "none",
          }}
        >
          {searchTerm ? (
            <>
              <strong
                style={{
                  color: "#00ff88",
                  fontWeight: 600,
                  fontSize: 13,
                  letterSpacing: 1,
                }}
              >
                Results
              </strong>
              <ul
                style={{
                  maxHeight: 240,
                  overflowY: "auto",
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                }}
              >
                {filteredProjects.length === 0 && (
                  <li style={{ padding: 8, color: isDarkMode ? "#888" : "#666", fontSize: 13 }}>
                    No results
                  </li>
                )}
                {filteredProjects.map((project, i) => (
                  <li
                    key={i}
                    style={{
                      cursor: "pointer",
                      padding: "7px 8px",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      transition: "background 0.18s",
                      marginBottom: 2,
                    }}
                    onMouseDown={() => {
                      onProjectSelect && onProjectSelect(project);
                      setTimeout(() => setFocused(false), 100);
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = isDarkMode ? "#23293a" : "#f5f5f5")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <img
                      src={
                        project.ImageUrl ||
                        project.imageUrl ||
                        "https://placehold.co/32x32"
                      }
                      alt={project.Name}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 7,
                        objectFit: "cover",
                        flexShrink: 0,
                        border: "1px solid #23293a",
                        background: "#23293a",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        minWidth: 0,
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 500,
                          color: isDarkMode ? "#fff" : "#000",
                          fontSize: 15,
                          lineHeight: 1.2,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {project.Name}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          color: isDarkMode ? "#b0b0b0" : "#666",
                          lineHeight: 1.2,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          marginTop: 1,
                        }}
                      >
                        {project.DescriptionShort}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <div>
                <strong
                  style={{
                    color: "#00ff88",
                    fontWeight: 600,
                    fontSize: 13,
                    letterSpacing: 1,
                  }}
                >
                  Recent Searches
                </strong>
                <ul style={{ fontSize: 13 }}>
                  {searchHistory.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div
                style={{
                  marginTop: 12,
                  borderTop: isDarkMode ? "1px solid #23293a" : "1px solid #e0e0e0",
                  paddingTop: 8,
                }}
              >
                <strong
                  style={{
                    color: "#00ff88",
                    fontWeight: 600,
                    fontSize: 13,
                    letterSpacing: 1,
                  }}
                >
                  This Area
                </strong>
                {areaProject ? (
                  <div
                    style={{
                      marginTop: 6,
                      background: isDarkMode ? "#23293a" : "#f5f5f5",
                      borderRadius: 10,
                      padding: "10px 12px",
                      color: isDarkMode ? "#fff" : "#000",
                      cursor: "pointer",
                      fontSize: 15,
                      fontWeight: 500,
                      boxShadow: isDarkMode 
                        ? "0 2px 8px rgba(0,0,0,0.10)" 
                        : "0 2px 8px rgba(0,0,0,0.05)",
                      transition: "background 0.18s",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                    onMouseDown={() =>
                      onProjectSelect && onProjectSelect(areaProject)
                    }
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#00ff88")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = isDarkMode ? "#23293a" : "#f5f5f5")
                    }
                  >
                    <img
                      src={
                        areaProject.ImageUrl ||
                        areaProject.imageUrl ||
                        "https://placehold.co/32x32"
                      }
                      alt={areaProject.Name}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 7,
                        objectFit: "cover",
                        flexShrink: 0,
                        border: "1px solid #23293a",
                        background: "#23293a",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        minWidth: 0,
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 500,
                          color: isDarkMode ? "#fff" : "#000",
                          fontSize: 15,
                          lineHeight: 1.2,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {areaProject.Name}
                      </span>
                      {areaProject.DescriptionShort && (
                        <div
                          style={{
                            fontSize: 13,
                            color: isDarkMode ? "#b0b0b0" : "#666",
                            fontWeight: 400,
                            marginTop: 2,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {areaProject.DescriptionShort}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ color: isDarkMode ? "#b0b0b0" : "#666", fontSize: 13, marginTop: 6 }}>
                    {areaInfo}
                  </div>
                )}
              </div>
            </>
          )}
          <div
            style={{
              marginTop: 12,
              borderTop: isDarkMode ? "1px solid #23293a" : "1px solid #e0e0e0",
              paddingTop: 8,
            }}
          >
            <button
              onClick={onMenuClick}
              style={{
                marginTop: 8,
                width: "100%",
                background: isDarkMode ? "#23293a" : "#f5f5f5",
                color: "#00ff88",
                border: "none",
                borderRadius: 7,
                padding: "10px 0",
                fontWeight: 600,
                fontSize: 15,
                letterSpacing: 1,
                cursor: "pointer",
                transition: "background 0.18s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#00ff88")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = isDarkMode ? "#23293a" : "#f5f5f5")
              }
            >
              ▼ Open Sidebar
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}