// components/UnifiedPopupSystem.js
import React, { useState, useEffect, useRef } from 'react';
import { createPopupContent } from './PopupUtils';

const UnifiedPopupSystem = ({ 
  project, 
  isVisible, 
  position, 
  onClose, 
  type = 'hover', // 'hover' or 'click'
  anchorElement = null 
}) => {
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const popupRef = useRef(null);
  const timeoutRef = useRef(null);

  // Calculate popup position
  useEffect(() => {
    if (isVisible && (position || anchorElement)) {
      const calculatePosition = () => {
        let x, y;
        
        if (anchorElement) {
          // Position relative to DOM element (for gallery items)
          const rect = anchorElement.getBoundingClientRect();
          x = rect.left + rect.width / 2;
          y = rect.top;
        } else if (position) {
          // Position from map coordinates
          x = position.x;
          y = position.y;
        }

        // Ensure popup stays within viewport
        const popup = popupRef.current;
        if (popup) {
          const popupRect = popup.getBoundingClientRect();
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;
          
          // Adjust horizontal position
          if (x + popupRect.width / 2 > viewportWidth - 20) {
            x = viewportWidth - popupRect.width / 2 - 20;
          }
          if (x - popupRect.width / 2 < 20) {
            x = popupRect.width / 2 + 20;
          }
          
          // Adjust vertical position
          if (y - popupRect.height < 20) {
            y = y + 60; // Show below marker instead of above
          } else {
            y = y - 20; // Show above marker
          }
        }

        setPopupPosition({ x, y });
      };

      // Small delay to ensure DOM is ready
      setTimeout(calculatePosition, 10);
    }
  }, [isVisible, position, anchorElement]);

  // Handle animation timing
  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    } else {
      // Delay hiding to allow exit animation
      timeoutRef.current = setTimeout(() => {
        setIsAnimating(false);
      }, 200);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isVisible]);

  // Don't render if no project or not animating/visible
  if (!project || (!isVisible && !isAnimating)) return null;

  const popupStyle = {
    position: 'fixed',
    left: `${popupPosition.x}px`,
    top: `${popupPosition.y}px`,
    transform: 'translate(-50%, -100%)',
    zIndex: 10000,
    pointerEvents: type === 'click' ? 'auto' : 'none',
    opacity: isVisible ? 1 : 0,
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: `translate(-50%, -100%) scale(${isVisible ? 1 : 0.95})`,
  };

  return (
    <div
      ref={popupRef}
      style={popupStyle}
      className="unified-popup"
      onMouseEnter={() => {
        // Keep popup open when hovering over it (for click popups)
        if (type === 'click' && timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      }}
      onMouseLeave={() => {
        // Close popup when mouse leaves (for click popups with auto-close)
        if (type === 'click' && onClose) {
          timeoutRef.current = setTimeout(onClose, 500);
        }
      }}
    >
      {/* Popup Arrow */}
      <div className="popup-arrow" />
      
      {/* Popup Content */}
      <div className="popup-content">
        {/* Close button for click popups */}
        {type === 'click' && onClose && (
          <button
            onClick={onClose}
            className="popup-close-btn"
            aria-label="Close popup"
          >
            ×
          </button>
        )}
        
        {/* Project Content */}
        <div dangerouslySetInnerHTML={{ __html: createPopupContent(project) }} />
        
        {/* Additional actions for click popups */}
        {type === 'click' && (
          <div className="popup-actions">
            <button 
              className="popup-action-btn"
              onClick={() => {
                // Handle "View Details" action
                console.log('View details for:', project.Name);
                // You can emit an event or call a callback here
              }}
            >
              View Details
            </button>
            {project.ProjectWebsite && (
              <a
                href={project.ProjectWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="popup-action-btn popup-link-btn"
                onClick={(e) => e.stopPropagation()}
              >
                Visit Website →
              </a>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .unified-popup {
          max-width: 320px;
          min-width: 280px;
          filter: drop-shadow(0 10px 25px rgba(0, 0, 0, 0.15));
        }

        .popup-arrow {
          width: 0;
          height: 0;
          border-left: 12px solid transparent;
          border-right: 12px solid transparent;
          border-top: 12px solid white;
          position: absolute;
          bottom: -12px;
          left: 50%;
          transform: translateX(-50%);
        }

        .popup-content {
          background: white;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(0, 0, 0, 0.08);
          position: relative;
          backdrop-filter: blur(10px);
        }

        .popup-close-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          background: none;
          border: none;
          font-size: 24px;
          color: #666;
          cursor: pointer;
          padding: 4px;
          line-height: 1;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .popup-close-btn:hover {
          background: rgba(0, 0, 0, 0.1);
          color: #333;
        }

        .popup-actions {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .popup-action-btn {
          background: #3B82F6;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .popup-action-btn:hover {
          background: #2563EB;
          transform: translateY(-1px);
        }

        .popup-link-btn {
          background: #10B981;
        }

        .popup-link-btn:hover {
          background: #059669;
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .popup-content {
            background: #1F2937;
            border-color: #374151;
            color: white;
          }

          .popup-arrow {
            border-top-color: #1F2937;
          }

          .popup-close-btn {
            color: #D1D5DB;
          }

          .popup-close-btn:hover {
            background: rgba(255, 255, 255, 0.1);
            color: white;
          }

          .popup-actions {
            border-top-color: #374151;
          }
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .unified-popup {
            max-width: 280px;
            min-width: 260px;
          }

          .popup-content {
            padding: 12px;
          }

          .popup-actions {
            flex-direction: column;
          }

          .popup-action-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default UnifiedPopupSystem;