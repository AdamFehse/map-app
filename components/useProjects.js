import { useState, useEffect } from "react";

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);

  useEffect(() => {
    // Fetch data only once when the component mounts
    const fetchData = async () => {
      try {
        const response = await fetch("https://adamfehse.github.io/map-app/storymapdata.json"); // Local file in the public directory
        const data = await response.json();
        setProjects(data); // Set all projects
        setFilteredProjects(data); // Initialize filtered projects to all projects
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs only once

  const filterProjects = (category) => {
    if (!projects.length) return; // Prevent filtering when projects are empty
    const filtered =
      category === "All" || category === ""
        ? projects
        : projects.filter((project) => project["Project Category"] === category);
    setFilteredProjects(filtered);
  };

  return { projects, filteredProjects, filterProjects };
}
