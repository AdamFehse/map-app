using Microsoft.EntityFrameworkCore;
using StoryMapApi.Models;

namespace StoryMapApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Project> Projects { get; set; }
        public DbSet<Outcome> Outcomes { get; set; }
        public DbSet<Artwork> Artworks { get; set; }
        public DbSet<Poem> Poems { get; set; }
        public DbSet<Activity> Activities { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure relationships
            modelBuilder.Entity<Project>()
                .HasOne(p => p.Outcome)
                .WithOne()
                .HasForeignKey<Outcome>("ProjectId");

            modelBuilder.Entity<Project>()
                .HasMany(p => p.Artworks)
                .WithOne()
                .HasForeignKey("ProjectId");

            modelBuilder.Entity<Project>()
                .HasMany(p => p.Poems)
                .WithOne()
                .HasForeignKey("ProjectId");

            modelBuilder.Entity<Project>()
                .HasMany(p => p.Activities)
                .WithOne()
                .HasForeignKey("ProjectId");
        }
    }
} 