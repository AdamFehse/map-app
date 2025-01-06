import { Modal, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "../styles/ProjectDetailsModal.css";

export default function ProjectDetailsModal({ open, onClose, project, isDarkMode }) {
  if (!project) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="project-modal-title"
      aria-describedby="project-modal-description"
    >
      <Box
        className={`modal-box ${isDarkMode ? "dark-mode" : ""}`} // Add conditional class
      >
        <Box className="modal-header">
          <Typography id="project-modal-title">{project["Project Name"]}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography id="project-modal-description" className="modal-description">
          {project.DescriptionLong || "No detailed description available."}
        </Typography>
        {project.ImageUrl && (
          <img
            src={project.ImageUrl}
            alt={project["Project Name"]}
            className="modal-image"
          />
        )}
        <Box className="modal-info">
          <p>
            <strong>Category:</strong> {project["Project Category"]}
          </p>
          <p>
            <strong>Artist:</strong> {project.Artist || "Unknown"}
          </p>
        </Box>
      </Box>
    </Modal>
  );
}
