using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StoryMapApi.Data;
using StoryMapApi.Models;

namespace StoryMapApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ProjectsController> _logger;

        public ProjectsController(ApplicationDbContext context, ILogger<ProjectsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Project>>> Get()
        {
            try
            {
                var projects = await _context.Projects
                    .Include(p => p.Outcome)
                    .Include(p => p.Artworks)
                    .Include(p => p.Poems)
                    .Include(p => p.Activities)
                    .ToListAsync();

                return Ok(projects);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving projects from database");
                return StatusCode(500, $"Failed to load data: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Project>> GetById(int id)
        {
            try
            {
                var project = await _context.Projects
                    .Include(p => p.Outcome)
                    .Include(p => p.Artworks)
                    .Include(p => p.Poems)
                    .Include(p => p.Activities)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (project == null)
                {
                    return NotFound($"Project with ID {id} not found");
                }

                return Ok(project);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving project {Id} from database", id);
                return StatusCode(500, $"Failed to load project: {ex.Message}");
            }
        }
    }
}