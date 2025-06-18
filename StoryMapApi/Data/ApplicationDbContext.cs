using Microsoft.EntityFrameworkCore;
using StoryMapApi.Models;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace StoryMapApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Project> Projects { get; set; }
        public DbSet<Activity> Activities { get; set; }
        public DbSet<Artwork> Artworks { get; set; }
        public DbSet<Outcome> Outcomes { get; set; }
        public DbSet<Poem> Poems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Project entity
            modelBuilder.Entity<Project>()
                .HasMany(p => p.Activities)
                .WithOne(a => a.Project)
                .HasForeignKey(a => a.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Project>()
                .HasMany(p => p.Artworks)
                .WithOne(a => a.Project)
                .HasForeignKey(a => a.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Project>()
                .HasOne(p => p.Outcome)
                .WithOne(o => o.Project)
                .HasForeignKey<Outcome>(o => o.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Project>()
                .HasMany(p => p.Poems)
                .WithOne(p => p.Project)
                .HasForeignKey(p => p.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);
        }

        public override int SaveChanges()
        {
            UpdateCategories();
            return base.SaveChanges();
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            await UpdateCategoriesAsync();
            return await base.SaveChangesAsync(cancellationToken);
        }

        private void UpdateCategories()
        {
            var projects = ChangeTracker.Entries<Project>()
                .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified)
                .Select(e => e.Entity);

            foreach (var project in projects)
            {
                if (project.ProjectCategory == null)
                {
                    project.ProjectCategory = Models.ProjectCategory.Other;
                }
            }
        }

        private async Task UpdateCategoriesAsync()
        {
            var projects = ChangeTracker.Entries<Project>()
                .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified)
                .Select(e => e.Entity);

            foreach (var project in projects)
            {
                if (project.ProjectCategory == null)
                {
                    project.ProjectCategory = Models.ProjectCategory.Other;
                }
            }
        }

        private ProjectCategory MapCategory(string category)
        {
            if (string.IsNullOrEmpty(category))
                return ProjectCategory.Other;

            return category.ToLower() switch
            {
                "art-based projects" => ProjectCategory.ArtExhibition,
                "research projects" => ProjectCategory.Research,
                "education and community outreach" => ProjectCategory.CommunityEngagement,
                "performance" => ProjectCategory.Performance,
                "workshop" => ProjectCategory.Workshop,
                "conference" => ProjectCategory.Conference,
                "publication" => ProjectCategory.Publication,
                _ => ProjectCategory.Other
            };
        }

        public async Task SeedDataAsync()
        {
            try
            {
                if (!Projects.Any())
                {
                    var jsonPath = Path.Combine(AppContext.BaseDirectory, "Data", "storymapdata_converted_enriched.json");
                    var jsonContent = await File.ReadAllTextAsync(jsonPath);
                    
                    var options = new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    };
                    
                    // First deserialize as dynamic to handle the category string
                    var dynamicProjects = JsonSerializer.Deserialize<List<JsonElement>>(jsonContent, options);
                    
                    if (dynamicProjects != null)
                    {
                        var projects = new List<Project>();
                        foreach (var element in dynamicProjects)
                        {
                            var project = new Project
                            {
                                Name = element.GetProperty("Name").GetString(),
                                Title = element.GetProperty("Title").GetString(),
                                Affiliation = element.GetProperty("Affiliation").GetString(),
                                College = element.GetProperty("College").GetString(),
                                ProjectName = element.GetProperty("Project").GetString(),
                                ImageUrl = element.GetProperty("ImageUrl").GetString(),
                                Location = element.GetProperty("Location").GetString(),
                                Latitude = double.Parse(element.GetProperty("Latitude").GetString() ?? "0"),
                                Longitude = double.Parse(element.GetProperty("Longitude").GetString() ?? "0"),
                                DescriptionShort = element.GetProperty("DescriptionShort").GetString(),
                                DescriptionLong = element.GetProperty("DescriptionLong").GetString(),
                                HasArtwork = element.GetProperty("HasArtwork").GetBoolean(),
                                HasPoems = element.GetProperty("HasPoems").GetBoolean(),
                                HasOutcomes = element.GetProperty("HasOutcomes").GetBoolean()
                            };

                            // Map the category
                            var categoryStr = element.GetProperty("ProjectCategory").GetString();
                            project.ProjectCategory = MapCategory(categoryStr);

                            // Handle Outcome
                            if (element.TryGetProperty("Outcome", out var outcomeElement))
                            {
                                project.Outcome = new Outcome
                                {
                                    Type = outcomeElement.GetProperty("Type").GetString(),
                                    Title = outcomeElement.GetProperty("Title").GetString(),
                                    Link = outcomeElement.GetProperty("Link").GetString(),
                                    Summary = outcomeElement.GetProperty("Summary").GetString()
                                };
                            }

                            // Handle Artworks
                            if (element.TryGetProperty("Artworks", out var artworksElement))
                            {
                                project.Artworks = JsonSerializer.Deserialize<List<Artwork>>(artworksElement.GetRawText(), options);
                            }

                            // Handle Poems
                            if (element.TryGetProperty("Poems", out var poemsElement))
                            {
                                project.Poems = JsonSerializer.Deserialize<List<Poem>>(poemsElement.GetRawText(), options);
                            }

                            // Handle Activities
                            if (element.TryGetProperty("Activities", out var activitiesElement))
                            {
                                project.Activities = JsonSerializer.Deserialize<List<Activity>>(activitiesElement.GetRawText(), options);
                            }

                            projects.Add(project);
                        }

                        await Projects.AddRangeAsync(projects);
                        await SaveChangesAsync();
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the error
                Console.WriteLine($"Error seeding data: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
            }
        }
    }
} 