import * as R from "leaflet-responsive-popup";
import { getCategoryConfig } from "./CategoryConfig";

// Create responsive popup content
export const createPopupContent = (project) => {
  const hasImage = project.ImageUrl || project.imageUrl;
  const projectCategory = project.ProjectCategory || 'Other';
  const categoryConfig = getCategoryConfig(projectCategory);
  
  return `
    <div style="min-width: 180px; max-width: 240px; padding: 8px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
        ${hasImage ? `
          <img src="${hasImage}" alt="${project.Name}" style="
            width: 32px; 
            height: 32px; 
            object-fit: cover; 
            border-radius: 6px; 
            border: 1px solid ${categoryConfig.color};
          " />
        ` : `
          <div style="
            width: 32px; 
            height: 32px; 
            background: ${categoryConfig.color};
            border-radius: 6px; 
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: bold;
            color: white;
          ">
            ${categoryConfig.symbol}
          </div>
        `}
        <div style="flex: 1;">
          <h3 style="margin: 0 0 3px 0; color: #333; font-size: 13px; font-weight: 600; line-height: 1.2;">
            ${project.Name}
          </h3>
          <div style="
            display: inline-block;
            background: ${categoryConfig.color};
            color: white;
            padding: 1px 4px;
            border-radius: 8px;
            font-size: 9px;
            font-weight: 500;
          ">
            ${categoryConfig.label}
          </div>
        </div>
      </div>
      
      ${project.DescriptionShort ? `
        <p style="margin: 0; color: #666; line-height: 1.3; font-size: 11px;">
          ${project.DescriptionShort.length > 60 ? project.DescriptionShort.substring(0, 60) + '...' : project.DescriptionShort}
        </p>
      ` : ''}
    </div>
  `;
};

// Create simple popup
export const createResponsivePopup = (project) => {
  return R.responsivePopup({
    html: createPopupContent(project),
    maxWidth: 300,
    closeButton: true,
    autoClose: false,
    closeOnClick: false,
    closeOnEscapeKey: true,
  });
};

// Get category color for styling
export const getCategoryColor = (category) => {
  const categoryConfig = {
    "Research Projects": '#3B82F6',
    "Art-Based Projects": '#8B5CF6',
    "Education and Community Outreach": '#10B981',
    "Research": '#06B6D4',
    // Keep old categories as fallbacks
    Research: '#3B82F6',
    ArtExhibition: '#8B5CF6',
    CommunityEngagement: '#10B981',
    Performance: '#F59E0B',
    Workshop: '#EAB308',
    Conference: '#EF4444',
    Publication: '#06B6D4',
    Other: '#6B7280'
  };
  return categoryConfig[category] || categoryConfig.Other;
};

// Get category label
export const getCategoryLabel = (category) => {
  const categoryConfig = {
    "Research Projects": 'Research Projects',
    "Art-Based Projects": 'Art-Based Projects',
    "Education and Community Outreach": 'Education and Community Outreach',
    "Research": 'Research',
    // Keep old categories as fallbacks
    Research: 'Research',
    ArtExhibition: 'Art Exhibition',
    CommunityEngagement: 'Community Engagement',
    Performance: 'Performance',
    Workshop: 'Workshop',
    Conference: 'Conference',
    Publication: 'Publication',
    Other: 'Other'
  };
  return categoryConfig[category] || categoryConfig.Other;
};

// Create simple popup content (for base map)
export const createSimplePopupContent = (project) => {
  return `
    <div class="simple-popup-content">
      <h3 style="margin: 0 0 8px 0; color: #333; font-size: 16px; font-weight: 600;">
        ${project.Name}
      </h3>
      ${project.DescriptionShort ? `
        <p style="margin: 0; color: #666; line-height: 1.4; font-size: 13px;">
          ${project.DescriptionShort}
        </p>
      ` : ''}
    </div>
  `;
};

// Create simple responsive popup
export const createSimpleResponsivePopup = (project) => {
  return R.responsivePopup({
    html: createSimplePopupContent(project),
    maxWidth: 300,
    closeButton: true,
    autoClose: false,
    closeOnClick: false,
    closeOnEscapeKey: true,
  });
}; 