using System.Text.Json;
using StoryMapApi.Models;
using Microsoft.EntityFrameworkCore;

namespace StoryMapApi.Data
{
    public class DatabaseSeeder
    {
        private readonly ApplicationDbContext _context;

        public DatabaseSeeder(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task SeedEnrichedData()
        {
            try
            {
                // Read the enriched data
                var jsonData = await File.ReadAllTextAsync("Data/storymapdata_db_ready.json");
                var projects = JsonSerializer.Deserialize<List<Project>>(jsonData);

                if (projects == null)
                {
                    throw new Exception("Failed to deserialize projects data");
                }

                // Add each project to the database
                foreach (var project in projects)
                {
                    // Check if project already exists
                    var existingProject = await _context.Projects
                        .FirstOrDefaultAsync(p => p.Name == project.Name);

                    if (existingProject == null)
                    {
                        // Add new project
                        _context.Projects.Add(project);
                    }
                    else
                    {
                        // Update existing project
                        existingProject.Title = project.Title;
                        existingProject.Affiliation = project.Affiliation;
                        existingProject.College = project.College;
                        existingProject.ProjectName = project.ProjectName;
                        existingProject.ImageUrl = project.ImageUrl;
                        existingProject.DescriptionShort = project.DescriptionShort;
                        existingProject.DescriptionLong = project.DescriptionLong;
                        existingProject.ProjectCategory = project.ProjectCategory;
                        existingProject.HasArtwork = project.HasArtwork;
                        existingProject.HasPoems = project.HasPoems;
                        existingProject.HasOutcomes = project.HasOutcomes;
                        existingProject.Background = project.Background;
                        existingProject.Department = project.Department;
                        existingProject.Year = project.Year;
                    }
                }

                // Save changes
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error seeding database: {ex.Message}", ex);
            }
        }
    }
} 