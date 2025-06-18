using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Net.Http;

namespace StoryMapApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        private readonly ILogger<ProjectsController> _logger;
        private readonly HttpClient _httpClient;

        public ProjectsController(ILogger<ProjectsController> logger, HttpClient httpClient)
        {
            _logger = logger;
            _httpClient = httpClient;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var jsonUrl = "https://raw.githubusercontent.com/AdamFehse/map-app/gh-pages/storymapdata_db_ready.json";
                var jsonContent = await _httpClient.GetStringAsync(jsonUrl);
                var projects = JsonSerializer.Deserialize<List<object>>(jsonContent);
                return Ok(projects);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error reading data from GitHub Pages");
                return StatusCode(500, $"Failed to load data: {ex.Message}");
            }
        }

        [HttpGet("categories")]
        public IActionResult GetCategories()
        {
            try
            {
                var categories = new[]
                {
                    new { Value = "ArtExhibition", Label = "Art Exhibition" },
                    new { Value = "Research", Label = "Research" },
                    new { Value = "CommunityEngagement", Label = "Community Engagement" },
                    new { Value = "Performance", Label = "Performance" },
                    new { Value = "Workshop", Label = "Workshop" },
                    new { Value = "Conference", Label = "Conference" },
                    new { Value = "Publication", Label = "Publication" },
                    new { Value = "Other", Label = "Other" }
                };

                return Ok(categories);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving categories");
                return StatusCode(500, $"Failed to load categories: {ex.Message}");
            }
        }
    }
}