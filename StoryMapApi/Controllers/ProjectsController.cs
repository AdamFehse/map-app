using Microsoft.AspNetCore.Mvc;
using StoryMapApi.Models;

namespace StoryMapApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        [HttpGet]
        public ActionResult<IEnumerable<Project>> Get()
        {
            var projects = new List<Project>
            {
                new Project 
                { 
                    Id = 1, 
                    Title = "Sonoran Soundscapes", 
                    Description = "An audio exploration of desert ecosystems",
                    Category = "Art", 
                    Latitude = 32.2217, 
                    Longitude = -110.9265 
                },
                new Project 
                { 
                    Id = 2, 
                    Title = "Desert Data Vis", 
                    Description = "Visualizing climate data from the Sonoran Desert",
                    Category = "Science", 
                    Latitude = 32.2345, 
                    Longitude = -110.9444 
                }
            };
            return Ok(projects);
        }
    }
}