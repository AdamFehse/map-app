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

        public async Task MigrateDataAsync()
        {
            try
            {
                // Check if we already have data
                if (await _context.Projects.AnyAsync())
                {
                    _logger.LogInformation("Database already contains data. Skipping migration.");
                    return;
                }

                // Read the converted data file
                var jsonPath = Path.Combine(AppContext.BaseDirectory, "Data", "storymapdata_converted.json");
                var jsonContent = await File.ReadAllTextAsync(jsonPath);
                var projects = JsonSerializer.Deserialize<List<Project>>(jsonContent);

                if (projects == null || !projects.Any())
                {
                    _logger.LogError("No projects found in the data file.");
                    return;
                }

                _logger.LogInformation($"Found {projects.Count} projects to migrate.");

                // Add projects to the database
                await _context.Projects.AddRangeAsync(projects);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Data migration completed successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during data migration");
                throw;
            }
        }
    }
} 