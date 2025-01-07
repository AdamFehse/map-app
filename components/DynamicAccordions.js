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

  // Add Artwork Accordion
  if (project.HasArtwork === "TRUE") {
    const artworkList = [];
    for (let i = 1; i <= 8; i++) {
      if (project[`Artwork Title ${i}`] && project[`Artwork ImageUrl ${i}`]) {
        artworkList.push({
          title: project[`Artwork Title ${i}`],
          description: project[`Artwork Description ${i}`],
          imageUrl: project[`Artwork ImageUrl ${i}`],
          activity: project[`Activity Title ${i}`],
        });
      }
    }

    sections.push({
      type: "artwork",
      title: "Artwork Library",
      items: artworkList,
    });
  }

  // Add Poem Accordion
  if (project.HasPoems === "TRUE") {
    const poemList = [];
    for (let i = 1; i <= 2; i++) {
      if (project[`Poema ${i}`] || project[`Poem ${i}`]) {
        poemList.push({
          poemaTitle: project[`Poema ${i}`],
          poemTitle: project[`Poem ${i}`],
          activityTitle: project[`Activity Title Poem ${i}`],
          description: project[`Poem Description ${i}`],
          text: project[`Poema ${i}`] || project[`Poem ${i}`], // Full text
        });
      }
    }

    sections.push({
      type: "poem",
      title: "Poems",
      items: poemList,
    });
  }

  // Add Outcomes Accordion
  if (project.HasOutcomes === "TRUE") {
    const outcomes = project["Project Outcome"]
      ? [
          {
            title: project["Outcome Title"],
            summary: project["Outcome Summary"],
            link: project["Outcome Link"],
          },
        ]
      : [];

    if (outcomes.length > 0) {
      sections.push({
        type: "outcome",
        title: "Outcomes",
        items: outcomes,
      });
    }
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
