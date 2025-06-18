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
                await _migrationService.MigrateDataAsync();
                return Ok("Data migration completed successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during data migration");
                return StatusCode(500, "An error occurred during data migration");
            }
        }
    }
} 