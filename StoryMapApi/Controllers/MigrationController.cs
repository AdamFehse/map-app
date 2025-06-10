using Microsoft.AspNetCore.Mvc;
using StoryMapApi.Data;

namespace StoryMapApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MigrationController : ControllerBase
    {
        private readonly DataMigrationService _migrationService;
        private readonly ILogger<MigrationController> _logger;

        public MigrationController(DataMigrationService migrationService, ILogger<MigrationController> logger)
        {
            _migrationService = migrationService;
            _logger = logger;
        }

        [HttpPost("migrate")]
        public async Task<IActionResult> MigrateData()
        {
            try
            {
                string jsonFilePath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "storymapdata_converted.json");
                
                // Check if file exists
                if (!System.IO.File.Exists(jsonFilePath))
                {
                    _logger.LogError($"JSON file not found at path: {jsonFilePath}");
                    return NotFound($"JSON file not found at path: {jsonFilePath}");
                }

                await _migrationService.MigrateDataFromJson(jsonFilePath);
                return Ok("Data migration completed successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during data migration: {Message}", ex.Message);
                return StatusCode(500, new { 
                    error = "An error occurred during data migration",
                    details = ex.Message,
                    stackTrace = ex.StackTrace
                });
            }
        }
    }
} 