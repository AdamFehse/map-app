using System.ComponentModel.DataAnnotations;

namespace StoryMapApi.Models
{
    public enum ProjectCategory
    {
        [Display(Name = "Research")]
        Research,

        [Display(Name = "Community Engagement")]
        CommunityEngagement,

        [Display(Name = "Art Exhibition")]
        ArtExhibition,

        [Display(Name = "Performance")]
        Performance,

        [Display(Name = "Workshop")]
        Workshop,

        [Display(Name = "Conference")]
        Conference,

        [Display(Name = "Publication")]
        Publication,

        [Display(Name = "Faculty Fellow")]
        FacultyFellow,

        [Display(Name = "Other")]
        Other
    }
} 