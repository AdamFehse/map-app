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
        public async Task<ActionResult<IEnumerable<Project>>> Get(
            [FromQuery] string? category = null,
            [FromQuery] bool? hasArtwork = null,
            [FromQuery] bool? hasPoems = null,
            [FromQuery] bool? hasOutcomes = null)
        {
            try
            {
                var query = _context.Projects
                    .Include(p => p.Outcome)
                    .Include(p => p.Artworks)
                    .Include(p => p.Poems)
                    .Include(p => p.Activities)
                    .AsQueryable();

                // Apply filters
                if (!string.IsNullOrEmpty(category))
                {
                    query = query.Where(p => p.ProjectCategory == category);
                }

                if (hasArtwork.HasValue)
                {
                    query = query.Where(p => p.HasArtwork == hasArtwork.Value);
                }

                if (hasPoems.HasValue)
                {
                    query = query.Where(p => p.HasPoems == hasPoems.Value);
                }

                if (hasOutcomes.HasValue)
                {
                    query = query.Where(p => p.HasOutcomes == hasOutcomes.Value);
                }

                var projects = await query.ToListAsync();
                return Ok(projects);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving projects from database");
                return StatusCode(500, $"Failed to load data: {ex.Message}");
            }
        }

        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<string>>> GetCategories()
        {
            try
            {
                var categories = await _context.Projects
                    .Select(p => p.ProjectCategory)
                    .Distinct()
                    .Where(c => c != null)
                    .ToListAsync();

                return Ok(categories);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving categories from database");
                return StatusCode(500, $"Failed to load categories: {ex.Message}");
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