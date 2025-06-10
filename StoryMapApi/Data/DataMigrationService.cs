using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using StoryMapApi.Models;

namespace StoryMapApi.Data
{
    public class DataMigrationService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<DataMigrationService> _logger;

        public DataMigrationService(ApplicationDbContext context, ILogger<DataMigrationService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task MigrateDataFromJson(string jsonFilePath)
        {
            try
            {
                _logger.LogInformation("Starting data migration from {FilePath}", jsonFilePath);

                // Read the JSON file
                string jsonContent = await File.ReadAllTextAsync(jsonFilePath);
                _logger.LogInformation("Successfully read JSON file, size: {Size} bytes", jsonContent.Length);

                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };

                var projects = JsonSerializer.Deserialize<List<Project>>(jsonContent, options);

                if (projects == null)
                {
                    _logger.LogError("No projects found in JSON file");
                    throw new Exception("No projects found in JSON file");
                }

                _logger.LogInformation("Found {Count} projects in JSON file", projects.Count);

                // Clear existing data
                _logger.LogInformation("Clearing existing data from database");
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM Activities");
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM Poems");
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM Artworks");
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM Outcomes");
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM Projects");

                // Add new data
                foreach (var project in projects)
                {
                    try
                    {
                        // Ensure navigation properties are initialized
                        project.Artworks ??= new List<Artwork>();
                        project.Poems ??= new List<Poem>();
                        project.Activities ??= new List<Activity>();

                        // Set up relationships
                        if (project.Outcome != null)
                        {
                            project.Outcome.Project = project;
                        }

                        foreach (var artwork in project.Artworks)
                        {
                            artwork.Project = project;
                        }

                        foreach (var poem in project.Poems)
                        {
                            poem.Project = project;
                        }

                        foreach (var activity in project.Activities)
                        {
                            activity.Project = project;
                        }

                        _context.Projects.Add(project);
                        _logger.LogDebug("Added project: {ProjectName}", project.Name);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error processing project {ProjectName}: {Message}", project.Name, ex.Message);
                        throw;
                    }
                }

                // Save changes
                _logger.LogInformation("Saving changes to database");
                await _context.SaveChangesAsync();
                _logger.LogInformation("Successfully migrated {Count} projects to the database", projects.Count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during data migration: {Message}", ex.Message);
                throw;
            }
        }
    }
} 