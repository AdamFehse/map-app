import React from "react";
import { Modal, Button } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/ProjectDetailsOverlay.css";

export default function ProjectDetailsOverlay({ open, onClose, project, isDarkMode }) {
  if (!project) return null;

  return (
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
          maxWidth: "90%",
          maxHeight: "90vh",
          borderRadius: "8px",
          padding: "16px",
          overflowY: "auto",
        }}
      >
        {/* Header Section */}
        <div className="row mb-3">
          <div className="col-12 d-flex justify-content-between align-items-center">
            <h4>{project["Project Name"]}</h4>
            <Button
              variant="contained"
              color="secondary"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>

        {/* Content Section */}
        <div className="row">
          {/* Left Column */}
          <div className="col-md-4 col-12 mb-3">
            <h5>Details</h5>
            <ul>
              <li><strong>Category:</strong> {project["Project Category"]}</li>
              <li><strong>Artist:</strong> {project.Artist || "Unknown"}</li>
              <li><strong>Year:</strong> {project.Year || "N/A"}</li>
              <li><strong>Location:</strong> {project.Location || "Unknown"}</li>
              <li><strong>Medium:</strong> {project.Medium || "Various"}</li>
            </ul>
          </div>

          {/* Right Column */}
          <div className="col-md-8 col-12">
            {project.ImageUrl && (
              <img
                src={project.ImageUrl}
                alt={project["Project Name"]}
                className="img-fluid rounded mb-3"
                style={{ border: isDarkMode ? "1px solid #555" : "1px solid #ddd" }}
              />
            )}
            <h5>Description</h5>
            <p style={{ lineHeight: "1.6" }}>
              {project.DescriptionLong || "No detailed description available."}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
