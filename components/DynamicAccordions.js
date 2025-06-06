import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function DynamicAccordions({
  project,
  setSelectedContent,
  isDarkMode,
  expandedAccordion,
  setExpandedAccordion,
}) {
  if (!project) return null;

  const sections = [];

  // Artwork Accordion
  if (project.HasArtwork && Array.isArray(project.Artworks)) {
    sections.push({
      type: "artwork",
      title: "Artwork Library",
      items: project.Artworks.map((art) => ({
        title: art.Title,
        description: art.Description,
        imageUrl: art.ImageUrl,
        activity: art.ActivityTitle,
      })),
    });
  }

  // Poem Accordion
  if (project.HasPoems && Array.isArray(project.Poems)) {
    sections.push({
      type: "poem",
      title: "Poems",
      items: project.Poems.map((poem) => ({
        poemaTitle: poem.ContentSpanish,
        poemTitle: poem.Content,
        activityTitle: poem.ActivityTitle,
        description: poem.Description,
        text: poem.Content || poem.ContentSpanish,
      })),
    });
  }

  // Outcomes Accordion
  if (project.HasOutcomes && project.Outcome) {
    sections.push({
      type: "outcome",
      title: "Outcomes",
      items: [
        {
          title: project.Title, // You can use a specific Outcome title if it exists
          summary: project.Outcome.Summary,
          link: project.Outcome.Link,
        },
      ],
    });
  }

  const handleAccordionChange = (accordion) => {
    setExpandedAccordion((prev) => (prev === accordion ? null : accordion));
  };

  return (
    <>
      {sections.map((section, index) => (
        <Accordion
          key={index}
          expanded={expandedAccordion === section.type}
          onChange={() => handleAccordionChange(section.type)}
          style={{
            backgroundColor: isDarkMode ? "#333" : "#fff",
            color: isDarkMode ? "#fff" : "#000",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon style={{ color: isDarkMode ? "#fff" : "#000" }} />}
          >
            <Typography variant="h6">{section.title}</Typography>
          </AccordionSummary>
          <AccordionDetails style={{ maxHeight: "60vh", overflowY: "auto" }}>
            {section.items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  cursor: "pointer",
                  marginBottom: "8px",
                  backgroundColor: isDarkMode ? "#444" : "#f9f9f9",
                  padding: "8px",
                  borderRadius: "4px",
                  border: isDarkMode ? "1px solid #555" : "1px solid #ddd",
                }}
                onClick={() =>
                  setSelectedContent({ type: section.type, content: item })
                }
              >
                <Typography
                  variant="subtitle1"
                  style={{ fontWeight: "bold", color: isDarkMode ? "#fff" : "#000" }}
                >
                  {item.poemaTitle || item.poemTitle || item.title || "Untitled"}
                </Typography>
                {section.type === "poem" && (
                  <Typography variant="body2" style={{ color: isDarkMode ? "#ccc" : "#666" }}>
                    {item.activityTitle}
                  </Typography>
                )}
                {section.type === "outcome" && (
                  <Typography variant="body2" style={{ color: isDarkMode ? "#ccc" : "#666" }}>
                    {item.summary}
                  </Typography>
                )}
              </div>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}
