using Microsoft.AspNetCore.Mvc;
using StoryMapApi.Models;
using System.Text.Json;

namespace StoryMapApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Project>>> Get()
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "storymapdata_converted.json");

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound("Data file not found.");
            }

            try
            {
                var json = await System.IO.File.ReadAllTextAsync(filePath);
                var projects = JsonSerializer.Deserialize<List<Project>>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                return Ok(projects);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Failed to load data: {ex.Message}");
            }
        }

    }
}