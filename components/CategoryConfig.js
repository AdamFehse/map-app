// components/CategoryConfig.js
// Centralized category configuration - single source of truth

export const CATEGORY_CONFIG = {
  "Research Projects": {
    value: "Research Projects",
    label: "Research Projects",
    color: '#3B82F6', // Blue
    icon: '🔬',
    symbol: 'R',
    glowColor: 'rgba(59, 130, 246, 0.8)',
    description: "Academic research and scholarly projects"
  },
  "Art-Based Projects": {
    value: "Art-Based Projects", 
    label: "Art-Based Projects",
    color: '#8B5CF6', // Purple
    icon: '🎨',
    symbol: 'A',
    glowColor: 'rgba(139, 92, 246, 0.8)',
    description: "Creative and artistic projects"
  },
  "Education and Community Outreach": {
    value: "Education and Community Outreach",
    label: "Education and Community Outreach", 
    color: '#10B981', // Green
    icon: '🤝',
    symbol: 'C',
    glowColor: 'rgba(16, 185, 129, 0.8)',
    description: "Educational and community engagement initiatives"
  },
  "Research": {
    value: "Research",
    label: "Research",
    color: '#06B6D4', // Teal
    icon: '📊',
    symbol: 'S',
    glowColor: 'rgba(6, 182, 212, 0.8)',
    description: "General research activities"
  },
  // Fallback
  "Other": {
    value: "Other",
    label: "Other",
    color: 'blue',
    icon: '⭐',
    symbol: 'O',
    glowColor: 'rgb(255, 13, 0)',
    description: "Project types"
  }
};

// Helper functions
export const getCategoryConfig = (category) => {
  return CATEGORY_CONFIG[category] || CATEGORY_CONFIG["Other"];
};

export const getCategoryColor = (category) => {
  return getCategoryConfig(category).color;
};

export const getCategoryLabel = (category) => {
  return getCategoryConfig(category).label;
};

export const getCategorySymbol = (category) => {
  return getCategoryConfig(category).symbol;
};

export const getCategoryIcon = (category) => {
  return getCategoryConfig(category).icon;
};

// Get all category values for dropdowns
export const getCategoryOptions = () => {
  return Object.values(CATEGORY_CONFIG).map(config => ({
    value: config.value,
    label: config.label
  }));
};

// Get unique categories from project data
export const extractCategoriesFromData = (projects) => {
  const uniqueCategories = [...new Set(projects.map(project => project.ProjectCategory).filter(Boolean))];
  return uniqueCategories.map(category => getCategoryConfig(category));
}; 