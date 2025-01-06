import React, { useState } from "react";
import ProjectDetailsModal from "./ProjectDetailsModal"; // Import the modal component

export default function PopupContent({ project }) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  return (
    <>
      <div className="popup-content">
        <img
          src={project.ImageUrl || "https://via.placeholder.com/150"}
          alt={project["Project Name"]}
          className="popup-image"
        />
        <strong>{project["Project Name"]}</strong>
        <p className="popup-description">{project["DescriptionShort"]}</p>
        <button
          onClick={handleOpenModal}
          style={{
            marginTop: "10px",
            padding: "5px 10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          More Details
        </button>
      </div>

      {/* Modal Component */}
      <ProjectDetailsModal
        open={modalOpen}
        onClose={handleCloseModal}
        project={project}
      />
    </>
  );
}
