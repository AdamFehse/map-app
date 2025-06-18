import React, { useState, useEffect } from "react";
import { Modal, Button, Typography, Chip } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/ProjectDetailsOverlay.css";
import DynamicAccordions from "./DynamicAccordions";
import ResetLikeButton from "./ResetLikesButton";
import LikeButton from "./LikeButton";
import { getCategoryInfo } from "../constants/projectCategories";

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

  // Early return if project is not available
  if (!project) return null;

  // Generate unique project ID for like buttons - using consistent property names
  const generateProjectId = (type, content) => {
    // Use both old and new property names for backward compatibility
    const projectName = project.Name || project["Project"] || "unknown";
    const latitude = project.Latitude || project["Latitude"] || 0;
    const longitude = project.Longitude || project["Longitude"] || 0;
    
    const baseId = `${projectName}-${latitude}-${longitude}`;
    
    switch (type) {
      case "artwork":
        return `${baseId}-artwork-${content.title || 'untitled'}`;
      case "poem":
        return `${baseId}-poem-${content.poemaTitle || content.poemTitle || 'untitled'}`;
      case "outcome":
        return `${baseId}-outcome-${content.title || 'untitled'}`;
      default:
        return baseId;
    }
  };

  const renderSelectedContent = () => {
    if (!selectedContent) {
      // Show project overview when no specific content is selected
      return (
        <div className="project-overview">
          <Typography variant="h5" component="h2" gutterBottom>
            Project Overview
          </Typography>
          
          {project.ImageUrl && (
            <div className="image-container" style={{ marginBottom: "16px" }}>
              <img
                src={project.ImageUrl}
                alt={project.Name || "Project"}
                style={{ 
                  maxWidth: "100%", 
                  height: "auto",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  console.warn('Failed to load project image:', project.ImageUrl);
                }}
              />
            </div>
          )}
          
          <Typography variant="body1" paragraph>
            <strong>Description:</strong> {project.Description || project.DescriptionShort || "No description available."}
          </Typography>
          
          {project.Location && (
            <Typography variant="body2" paragraph>
              <strong>Location:</strong> {project.Location}
            </Typography>
          )}
          
          {project.ProjectCategory && (
            <div style={{ marginBottom: "16px" }}>
              <Chip
                label={getCategoryInfo(project.ProjectCategory).label}
                icon={<span>{getCategoryInfo(project.ProjectCategory).icon}</span>}
                color="primary"
                variant="outlined"
                style={{ marginRight: "8px" }}
              />
              <Typography variant="caption" color="textSecondary">
                {getCategoryInfo(project.ProjectCategory).description}
              </Typography>
            </div>
          )}
          
          <Typography variant="body2" color="textSecondary" style={{ marginTop: "16px" }}>
            Select an item from the left panel to view detailed artwork, poems, or outcomes.
          </Typography>

          <LikeButton projectId={generateProjectId("project", {})} />
        </div>
      );
    }

    const { type, content } = selectedContent;

    switch (type) {
      case "artwork":
        return (
          <div className="artwork-content">
            <Typography variant="h5" component="h2" gutterBottom>
              {content.title || "Untitled Artwork"}
            </Typography>
            
            <Typography variant="subtitle1" gutterBottom>
              <strong>Activity:</strong> {content.activity || "N/A"}
            </Typography>
            
            <Typography variant="body2" paragraph>
              {content.description || "No description available."}
            </Typography>

            <LikeButton projectId={generateProjectId("artwork", content)} />
            
            {content.imageUrl && (
              <div className="image-container" style={{ marginTop: "16px" }}>
                <img
                  src={content.imageUrl}
                  alt={content.title || "Artwork"}
                  style={{ 
                    maxWidth: "100%", 
                    height: "auto",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    console.warn('Failed to load image:', content.imageUrl);
                  }}
                />
              </div>
            )}
          </div>
        );

      case "poem":
        return (
          <div className="poem-content">
            <Typography variant="h5" component="h2" gutterBottom>
              {content.poemaTitle || content.poemTitle || "Untitled Poem"}
            </Typography>
            
            <Typography variant="body2" paragraph>
              {content.description || "No description available."}
            </Typography>
            
            <Typography 
              variant="body1" 
              component="div"
              style={{ 
                whiteSpace: "pre-wrap",
                fontStyle: "italic",
                marginBottom: "16px",
                padding: "16px",
                backgroundColor: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                borderRadius: "8px"
              }}
            >
              {content.text || "No text available."}
            </Typography>

            <LikeButton projectId={generateProjectId("poem", content)} />
          </div>
        );

      case "outcome":
        return (
          <div className="outcome-content">
            <Typography variant="h5" component="h2" gutterBottom>
              {content.title || "Untitled Outcome"}
            </Typography>
            
            <Typography variant="body2" paragraph>
              {content.summary || "No summary available."}
            </Typography>
            
            {content.link && (
              <Button
                variant="outlined"
                color="primary"
                href={content.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginBottom: "16px" }}
              >
                View Outcome
              </Button>
            )}

            <LikeButton projectId={generateProjectId("outcome", content)} />
          </div>
        );

      default:
        return (
          <Typography variant="body1" color="error">
            Unknown content type: {type}
          </Typography>
        );
    }
  };

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
          style={{
            maxHeight: "90vh",
            overflowY: "auto",
            borderRadius: "8px",
            outline: "none"
          }}
        >
          {/* Header Section */}
          <div className="header d-flex justify-content-between align-items-center p-3 border-bottom">
            <Typography variant="h4" component="h1">
              {project.Name || project["Project"] || "Untitled Project"}
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={onClose}
              size="small"
            >
              Close
            </Button>
          </div>

          {/* Content Section */}
          <div className="row g-0">
            {/* Left Panel */}
            <div className="col-md-4 col-12 left-panel border-end">
              <DynamicAccordions
                project={project}
                setSelectedContent={setSelectedContent}
                expandedAccordion={expandedAccordion}
                setExpandedAccordion={setExpandedAccordion}
                isDarkMode={isDarkMode}
              />
            </div>

            {/* Right Panel */}
            <div className="col-md-8 col-12 right-panel p-3">
              {renderSelectedContent()}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}