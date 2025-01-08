import React, { useState, useEffect } from "react";
import { Modal, Button, Typography } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/ProjectDetailsOverlay.css";
import DynamicAccordions from "./DynamicAccordions";
import ResetLikeButton from "./ResetLikesButton";
import LikeButton from "./LikeButton";

export default function ProjectDetailsOverlay({
  open,
  onClose,
  project,
  isDarkMode,
  
}) {
  const [selectedContent, setSelectedContent] = useState(null); // Artwork, Poem, or Outcome
  const [expandedAccordion, setExpandedAccordion] = useState(null); // Track open accordion

  useEffect(() => {
    if (!open || !project) {
      setSelectedContent(null); // Reset content on modal close or new project
      setExpandedAccordion(null); // Reset accordion state
    }
  }, [open, project]);

  if (!project) return null;

  return (
    <>
    <ResetLikeButton />
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="project-modal-title"
      aria-describedby="project-modal-description"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflowY: "auto",
      }}
    >
      
      <div
        className={`container-fluid project-details-overlay ${
          isDarkMode ? "bg-dark text-white" : "bg-light text-dark"
        }`}
      >
        {/* Header Section */}
        <div className="header">
          <h4>{project["Project Name"]}</h4>
          <Button variant="contained" color="primary" onClick={onClose}>
            Close
          </Button>
        </div>

        {/* Content Section */}
        {/* Content Section */}
<div className="row">
  {/* Left Panel */}
  <div className="col-md-4 col-12 left-panel">
    {/* Dynamic Accordions */}
    <DynamicAccordions
      project={project}
      setSelectedContent={setSelectedContent}
      expandedAccordion={expandedAccordion}
      setExpandedAccordion={setExpandedAccordion}
      isDarkMode={isDarkMode}
    />
  </div>

  {/* Right Panel */}
  <div className="col-md-8 col-12 right-panel">
    {selectedContent ? (
      selectedContent.type === "artwork" ? (
        <>
          <Typography variant="h5" gutterBottom>
            {selectedContent.content.title}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Activity:</strong>{" "}
            {selectedContent.content.activity || "N/A"}
          </Typography>
          <Typography variant="body2" style={{ marginBottom: "16px" }}>
            {selectedContent.content.description ||
              "No description available."}
          </Typography>

          {/* Unique Like Button for Each Artwork */}
          <LikeButton
            projectId={`${project["Project"]}-${selectedContent.content.title}-${project["Latitude"]}-${project["Longitude"]}`}
          />
          <div className="image-container">
            <img
              src={selectedContent.content.imageUrl}
              alt={selectedContent.content.title}
            />
          </div>
        </>
      ) : selectedContent.type === "poem" ? (
        <>
          <Typography variant="h5" gutterBottom>
            {selectedContent.content.poemaTitle ||
              selectedContent.content.poemTitle ||
              "Untitled"}
          </Typography>
          <Typography
            variant="body2"
            style={{ marginBottom: "16px" }}
          >
            {selectedContent.content.description || "No description available."}
          </Typography>
          <Typography
            variant="body1"
            style={{ marginBottom: "16px" }}
          >
            {selectedContent.content.text || "No text available."}
          </Typography>

          {/* Unique Like Button for Each Poem */}
          <LikeButton
            projectId={`${project["Project"]}-poem-${selectedContent.content.poemaTitle || selectedContent.content.poemTitle}`}
          />
        </>
      ) : (
        <>
          <Typography variant="h5" gutterBottom>
            {selectedContent.content.title}
          </Typography>
          <Typography
            variant="body2"
            style={{ marginBottom: "16px" }}
          >
            {selectedContent.content.summary || "No summary available."}
          </Typography>
          {selectedContent.content.link && (
            <a
              href={selectedContent.content.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Outcome
            </a>
          )}

          {/* Unique Like Button for Each Outcome */}
          <LikeButton
            projectId={`${project["Project"]}-outcome-${selectedContent.content.title}`}
          />
        </>
      )
    ) : (
      <Typography>
        Select an artwork, poem, or outcome to view details.
      </Typography>
    )}
  </div>
</div>

      </div>
    </Modal>
    </>
  );
}
