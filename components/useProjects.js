import { useState, useEffect } from "react";

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Update the URL to point to your converted data file
        const response = await fetch("https://adamfehse.github.io/map-app/storymapdata_converted.json");
        const data = await response.json();
        
        console.log(`Loaded ${data.length} projects`);
        console.log('Sample project structure:', data[0]); // Debug log
        
        setProjects(data);
        setFilteredProjects(data);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    fetchData();
  }, []);

  const filterProjects = (category) => {
    if (!projects.length) return;
    
    const filtered =
      category === "All" || category === ""
        ? projects
        : projects.filter((project) => project.ProjectCategory === category); // Note: no spaces in property name now
    
    setFilteredProjects(filtered);
  };

  // Helper function to get projects with artworks
  const getProjectsWithArtworks = () => {
    return filteredProjects.filter(project => project.Artworks && project.Artworks.length > 0);
  };

  // Helper function to get projects with poems
  const getProjectsWithPoems = () => {
    return filteredProjects.filter(project => project.Poems && project.Poems.length > 0);
  };

  // Helper function to get all artworks across projects
  const getAllArtworks = () => {
    return filteredProjects.reduce((allArtworks, project) => {
      if (project.Artworks) {
        const artworksWithProjectInfo = project.Artworks.map(artwork => ({
          ...artwork,
          ProjectName: project.Name,
          ProjectLocation: project.Location
        }));
        return [...allArtworks, ...artworksWithProjectInfo];
      }
      return allArtworks;
    }, []);
  };

  // Helper function to get all poems across projects
  const getAllPoems = () => {
    return filteredProjects.reduce((allPoems, project) => {
      if (project.Poems) {
        const poemsWithProjectInfo = project.Poems.map(poem => ({
          ...poem,
          ProjectName: project.Name,
          ProjectLocation: project.Location
        }));
        return [...allPoems, ...poemsWithProjectInfo];
      }
      return allPoems;
    }, []);
  };

  // Helper function to get all unique activities
  const getAllActivities = () => {
    const allActivities = filteredProjects.reduce((activities, project) => {
      if (project.Activities) {
        return [...activities, ...project.Activities];
      }
      return activities;
    }, []);
    
    // Remove duplicates based on title
    const uniqueActivities = allActivities.filter((activity, index, self) => 
      index === self.findIndex(a => a.Title === activity.Title)
    );
    
    return uniqueActivities;
  };

  return { 
    projects, 
    filteredProjects, 
    filterProjects,
    getProjectsWithArtworks,
    getProjectsWithPoems,
    getAllArtworks,
    getAllPoems,
    getAllActivities
  };
}