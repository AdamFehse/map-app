import { useState, useEffect, useCallback, useMemo } from "react";
import { extractCategoriesFromData } from "./CategoryConfig";

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  // const projectsResponse = await fetch("https://raw.githubusercontent.com/AdamFehse/map-app/gh-pages/storymapdata_db_ready_v2.json");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch projects from GitHub Pages
        const projectsResponse = await fetch("storymapdata_db_ready_v2.json");
        if (!projectsResponse.ok) {
          throw new Error(`HTTP error! status: ${projectsResponse.status}`);
        }
        const projectsData = await projectsResponse.json();
        setProjects(projectsData);

        // Extract unique categories from the actual data using centralized config
        const uniqueCategories = [...new Set(projectsData.map(project => project.ProjectCategory).filter(Boolean))];
        console.log("Found categories in data:", uniqueCategories);
        
        // Use centralized category extraction
        const dynamicCategories = extractCategoriesFromData(projectsData);
        console.log("Processed categories:", dynamicCategories);
        setCategories(dynamicCategories);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  const filteredProjects = useMemo(() => {
    if (!currentCategory) {
      return projects;
    }
    return projects.filter(project => project.ProjectCategory === currentCategory);
  }, [projects, currentCategory]);

  const filterProjects = useCallback((category) => {
    setCurrentCategory(category);
  }, []);

  const getProjectsWithArtworks = useCallback(() => {
    return projects.filter((project) => project.Artworks && project.Artworks.length > 0);
  }, [projects]);

  const getProjectsWithPoems = useCallback(() => {
    return projects.filter((project) => project.Poems && project.Poems.length > 0);
  }, [projects]);

  const getUniqueActivities = useCallback(() => {
    const activities = new Set();
    projects.forEach((project) => {
      if (project.Activities) {
        project.Activities.forEach((activity) => {
          activities.add(activity);
        });
      }
    });
    return Array.from(activities);
  }, [projects]);

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