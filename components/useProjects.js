import { useState, useEffect } from "react";

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch projects from GitHub raw URL
        const projectsResponse = await fetch("https://raw.githubusercontent.com/AdamFehse/map-app/gh-pages/storymapdata_db_ready.json");
        if (!projectsResponse.ok) {
          throw new Error(`HTTP error! status: ${projectsResponse.status}`);
        }
        const projectsData = await projectsResponse.json();
        setProjects(projectsData);
        setFilteredProjects(projectsData);

        // Extract unique categories from the actual data
        const uniqueCategories = [...new Set(projectsData.map(project => project.ProjectCategory).filter(Boolean))];
        console.log("Found categories in data:", uniqueCategories);
        
        // Create category objects with proper labels
        const categoryMap = {
          "ArtExhibition": "Art Exhibition",
          "Research": "Research", 
          "CommunityEngagement": "Community Engagement",
          "Performance": "Performance",
          "Workshop": "Workshop",
          "Conference": "Conference",
          "Publication": "Publication",
          "Other": "Other"
        };

        const dynamicCategories = uniqueCategories.map(category => ({
          Value: category,
          Label: categoryMap[category] || category
        }));

        console.log("Processed categories:", dynamicCategories);
        setCategories(dynamicCategories);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  const filterProjects = (category) => {
    console.log("Filtering by category:", category);
    if (!category) {
      setFilteredProjects(projects);
      return;
    }

    const filtered = projects.filter((project) => {
      const matches = project.ProjectCategory === category;
      console.log(`Project ${project.Name}: ProjectCategory=${project.ProjectCategory}, matches=${matches}`);
      return matches;
    });

    console.log(`Filtered ${filtered.length} projects out of ${projects.length} total`);
    setFilteredProjects(filtered);
  };

  const getProjectsWithArtworks = () => {
    return projects.filter((project) => project.Artworks && project.Artworks.length > 0);
  };

  const getProjectsWithPoems = () => {
    return projects.filter((project) => project.Poems && project.Poems.length > 0);
  };

  const getUniqueActivities = () => {
    const activities = new Set();
    projects.forEach((project) => {
      if (project.Activities) {
        project.Activities.forEach((activity) => {
          activities.add(activity);
        });
      }
    });
    return Array.from(activities);
  };

  return {
    projects,
    filteredProjects,
    categories,
    error,
    filterProjects,
    getProjectsWithArtworks,
    getProjectsWithPoems,
    getUniqueActivities,
  };
}