import { useState, useEffect } from "react";

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch projects from backend API (to avoid CORS issues)
        const projectsResponse = await fetch("https://raw.githubusercontent.com/AdamFehse/map-app/gh-pages/storymapdata_db_ready.json");
        if (!projectsResponse.ok) {
          throw new Error(`HTTP error! status: ${projectsResponse.status}`);
        }
        const projectsData = await projectsResponse.json();
        setProjects(projectsData);
        setFilteredProjects(projectsData);

        // Set categories based on the data
        const uniqueCategories = [...new Set(projectsData.map(project => project.ProjectCategory))].filter(Boolean);
        const categoryObjects = uniqueCategories.map(category => ({
          Value: category,
          Label: category.replace(/([A-Z])/g, ' $1').trim() // Convert camelCase to readable format
        }));
        setCategories(categoryObjects);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  const filterProjects = (category) => {
    if (!category) {
      setFilteredProjects(projects);
      return;
    }

    const filtered = projects.filter((project) => {
      return project.projectCategory === category;
    });

    setFilteredProjects(filtered);
  };

  const getProjectsWithArtworks = () => {
    return projects.filter((project) => project.artworks && project.artworks.length > 0);
  };

  const getProjectsWithPoems = () => {
    return projects.filter((project) => project.poems && project.poems.length > 0);
  };

  const getUniqueActivities = () => {
    const activities = new Set();
    projects.forEach((project) => {
      if (project.activities) {
        project.activities.forEach((activity) => {
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