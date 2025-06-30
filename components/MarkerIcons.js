import { divIcon } from "leaflet";
import { CATEGORY_CONFIG, getCategoryConfig } from "./CategoryConfig";

// Simple marker icon for base map
export const createSimpleIcon = () => {
  return divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="
        background-color: #3B82F6; 
        width: 16px; 
        height: 16px; 
        border-radius: 50%; 
        border: 2px solid white; 
        box-shadow: 0 0 8px rgba(59, 130, 246, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 8px;
        color: white;
        font-weight: bold;
        transition: all 0.3s ease;
      ">
        P
      </div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -8],
  });
};

// Function to create category-based icons
export const createCategoryIcon = (category, isSelected = false, isGrouped = false, project = null) => {
  const config = getCategoryConfig(category);
  
  // Different sizes for different states - increased base size significantly
  const size = isSelected ? 60 : isGrouped ? 32 : 32; // Changed from 24 to 32
  const borderWidth = isSelected ? 4 : isGrouped ? 3 : 2;
  const glowIntensity = isSelected ? '0 0 30px' : isGrouped ? '0 0 15px' : '0 0 8px';
  
  // Check if we have an image for the selected state
  const hasImage = project?.ImageUrl || project?.imageUrl;
  
  if (isSelected && hasImage) {
    // Create image preview frame
    return divIcon({
      className: `custom-div-icon category-${category.toLowerCase().replace(/\s+/g, '-')} selected-with-image`,
      html: `
        <div style="
          background: linear-gradient(135deg, ${config.color}, ${config.color}dd);
          width: ${size}px; 
          height: ${size}px; 
          border-radius: 50%; 
          border: ${borderWidth}px solid white; 
          box-shadow: ${glowIntensity} ${config.glowColor}, 0 0 40px rgba(0, 255, 136, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        ">
          <img 
            src="${hasImage}" 
            alt="${project?.Name || 'Project'}"
            style="
              width: 100%;
              height: 100%;
              object-fit: cover;
              border-radius: 50%;
            "
            onError="this.style.display='none'"
          />
          <div style="
            position: absolute;
            top: -8px;
            right: -8px;
            background: #00ff88;
            color: black;
            border-radius: 50%;
            width: 16px;
            height: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: bold;
            border: 2px solid white;
            box-shadow: 0 0 10px rgba(0, 255, 136, 0.8);
            z-index: 10;
          ">✓</div>
          <div style="
            position: absolute;
            bottom: 2px;
            right: 2px;
            background: ${config.color};
            color: white;
            border-radius: 50%;
            width: 18px;
            height: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: bold;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          ">${config.icon}</div>
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -size / 2],
    });
  } else {
    // Regular icon with emoji - show the category emoji instead of letter
    return divIcon({
      className: `custom-div-icon category-${category.toLowerCase().replace(/\s+/g, '-')}`,
      html: `
        <div style="
          background-color: ${config.color}; 
          width: ${size}px; 
          height: ${size}px; 
          border-radius: 50%; 
          border: ${borderWidth}px solid white; 
          box-shadow: ${glowIntensity} ${config.glowColor};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: ${Math.max(16, size * 0.5)}px;
          color: white;
          font-weight: bold;
          font-family: Arial, sans-serif;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
          transition: all 0.3s ease;
          position: relative;
          line-height: 1;
        ">
          ${config.icon}
          ${isSelected ? `
            <div style="
              position: absolute;
              top: -8px;
              right: -8px;
              background: #00ff88;
              color: black;
              border-radius: 50%;
              width: 12px;
              height: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 8px;
              font-weight: bold;
              border: 2px solid white;
              box-shadow: 0 0 10px rgba(0, 255, 136, 0.8);
            ">✓</div>
          ` : ''}
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -size / 2],
    });
  }
};

// Export the category config for backward compatibility
export { CATEGORY_CONFIG as categoryConfig }; 