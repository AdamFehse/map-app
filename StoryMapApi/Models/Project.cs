// Models/Project.cs
namespace StoryMapApi.Models
{
    public class Project
    {
        public string Name { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Affiliation { get; set; } = string.Empty;
        public string College { get; set; } = string.Empty;
        public string Project { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Latitude { get; set; } = string.Empty;
        public string Longitude { get; set; } = string.Empty;
        public string DescriptionShort { get; set; } = string.Empty;
        public string DescriptionLong { get; set; } = string.Empty;
        
        // Project info
        public string ProjectCategory { get; set; } = string.Empty;
        public string HasArtwork { get; set; } = string.Empty;
        public string HasPoems { get; set; } = string.Empty;
        public string HasOutcomes { get; set; } = string.Empty;
        
        // Outcome info
        public string ProjectOutcome { get; set; } = string.Empty;
        public string OutcomeTitle { get; set; } = string.Empty;
        public string OutcomeLink { get; set; } = string.Empty;
        public string OutcomeSummary { get; set; } = string.Empty;
        
        // Activities and Artwork (simplified --- I might want separate classes)
        public string ActivityTitle1 { get; set; } = string.Empty;
        public string ArtworkTitle1 { get; set; } = string.Empty;
        public string ArtworkDescription1 { get; set; } = string.Empty;
        public string ArtworkImageUrl1 { get; set; } = string.Empty;
        
        public string ActivityTitle2 { get; set; } = string.Empty;
        public string ArtworkTitle2 { get; set; } = string.Empty;
        public string ArtworkDescription2 { get; set; } = string.Empty;
        public string ArtworkImageUrl2 { get; set; } = string.Empty;
        
        public string ActivityTitle3 { get; set; } = string.Empty;
        public string ArtworkTitle3 { get; set; } = string.Empty;
        public string ArtworkDescription3 { get; set; } = string.Empty;
        public string ArtworkImageUrl3 { get; set; } = string.Empty;

        public string ActivityTitle4 { get; set; } = string.Empty;
        public string ArtworkTitle4 { get; set; } = string.Empty;
        public string ArtworkDescription4 { get; set; } = string.Empty;
        public string ArtworkImageUrl4 { get; set; } = string.Empty;

        public string ActivityTitle5 { get; set; } = string.Empty;
        public string ArtworkTitle5 { get; set; } = string.Empty;
        public string ArtworkDescription5 { get; set; } = string.Empty;
        public string ArtworkImageUrl5 { get; set; } = string.Empty;

        public string ActivityTitle6 { get; set; } = string.Empty;
        public string ArtworkTitle6 { get; set; } = string.Empty;
        public string ArtworkDescription6 { get; set; } = string.Empty;
        public string ArtworkImageUrl6 { get; set; } = string.Empty;

        public string ActivityTitle7 { get; set; } = string.Empty;
        public string ArtworkTitle7 { get; set; } = string.Empty;
        public string ArtworkDescription7 { get; set; } = string.Empty;
        public string ArtworkImageUrl7 { get; set; } = string.Empty;

        public string ActivityTitle8 { get; set; } = string.Empty;
        public string ArtworkTitle8 { get; set; } = string.Empty;
        public string ArtworkDescription8 { get; set; } = string.Empty;
        public string ArtworkImageUrl8 { get; set; } = string.Empty;
        
        // ... you can add more artwork fields as needed

        // Poems
        public string ActivityTitlePoem1 { get; set; } = string.Empty;
        public string PoemDescription1 { get; set; } = string.Empty;
        public string Poema1 { get; set; } = string.Empty;
        public string Poem1 { get; set; } = string.Empty;
        
        public string ProfileImageUrl { get; set; } = string.Empty;
    }
}