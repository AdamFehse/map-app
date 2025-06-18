using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.IO;

namespace StoryMapApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestProjectsController : ControllerBase
    {
        private readonly ILogger<TestProjectsController> _logger;
        private readonly string _testDataPath;

        public TestProjectsController(ILogger<TestProjectsController> logger)
        {
            _logger = logger;
            // Adjust this path to point to your test JSON file
            _testDataPath = Path.Combine(Directory.GetCurrentDirectory(), "..", "project_scrapper", "enriched_projects_test.json");
        }

        [HttpGet]
        public async Task<IActionResult> GetProjects()
        {
            try
            {
                if (!System.IO.File.Exists(_testDataPath))
                {
                    return NotFound("Test data file not found");
                }

                var jsonString = await System.IO.File.ReadAllTextAsync(_testDataPath);
                var projects = JsonSerializer.Deserialize<List<object>>(jsonString);
                
                return Ok(projects);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error reading test projects");
                return StatusCode(500, "Error reading test projects");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProject(string id)
        {
            try
            {
                if (!System.IO.File.Exists(_testDataPath))
                {
                    return NotFound("Test data file not found");
                }

                var jsonString = await System.IO.File.ReadAllTextAsync(_testDataPath);
                var projects = JsonSerializer.Deserialize<List<object>>(jsonString);
                
                var project = projects?.FirstOrDefault(p => 
                    JsonSerializer.Serialize(p).Contains($"\"Name\":\"{id}\""));
                
                if (project == null)
                {
                    return NotFound($"Project with name {id} not found");
                }

                return Ok(project);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error reading test project");
                return StatusCode(500, "Error reading test project");
            }
        }
    }
} 