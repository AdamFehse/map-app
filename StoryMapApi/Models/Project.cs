using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;

namespace StoryMapApi.Models
{
    public class Project
    {
        [Key]
        public int Id { get; set; }
        public string? Name { get; set; } // '?' defines nullable
        public string? Title { get; set; }
        public string? Affiliation { get; set; }
        public string? College { get; set; }

        [JsonPropertyName("Project")]  // field can be called ProjectName instead of Project
        public string? ProjectName { get; set; }

        public string? ImageUrl { get; set; }
        public string? Location { get; set; }
        public string? Latitude { get; set; }
        public string? Longitude { get; set; }


        public string? DescriptionShort { get; set; }
        public string? DescriptionLong { get; set; }

        public string? ProjectCategory { get; set; }

        public bool HasArtwork { get; set; }
        public bool HasPoems { get; set; }
        public bool HasOutcomes { get; set; }

        public Outcome? Outcome { get; set; }
        public List<Artwork>? Artworks { get; set; }
        public List<Poem>? Poems { get; set; }
        public List<Activity>? Activities { get; set; }
    }

    public class Outcome
    {
        [Key]
        public int Id { get; set; }
        public string? Type { get; set; }
        public string? Title { get; set; }
        public string? Link { get; set; }
        public string? Summary { get; set; }
        public int ProjectId { get; set; }
        public Project? Project { get; set; }
    }

    public class Artwork
    {
        [Key]
        public int Id { get; set; }
        public string? ActivityTitle { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public int ProjectId { get; set; }
        public Project? Project { get; set; }
    }

    public class Poem
    {
        [Key]
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Author { get; set; }
        public string? Content { get; set; }
        public int ProjectId { get; set; }
        public Project? Project { get; set; }
    }

    public class Activity
    {
        [Key]
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Date { get; set; }
        public string? Description { get; set; }
        public int ProjectId { get; set; }
        public Project? Project { get; set; }
    }

}
