import React, { useState, useRef, useEffect } from 'react';
import { useDarkMode } from "../contexts/DarkModeContext";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box, // Use Box for flexible spacing and layout
  Paper,
  Divider,
  IconButton,
} from '@mui/material';
import Grid2 from '@mui/material/Grid2'; // Modern Grid2 instead of deprecated Grid
import { Close, NavigateBefore, NavigateNext, ZoomIn } from '@mui/icons-material';
import '../styles/ProjectModal.css';

const ProjectModal = ({ open, onClose, project }) => {
  const { isDarkMode } = useDarkMode();
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [allImages, setAllImages] = useState([]);
  const contentRef = useRef(null);

  // Collect all images for lightbox
  useEffect(() => {
    if (!project) return;
    
    const images = [];
    
    // Add main project image if it exists
    if (project.ImageUrl) {
      images.push({
        src: project.ImageUrl,
        title: project.Name,
        type: 'project'
      });
    }
    
    // Add artwork images
    if (project.Artworks && project.Artworks.length > 0) {
      project.Artworks.forEach((artwork, index) => {
        if (artwork.ImageUrl) {
          images.push({
            src: artwork.ImageUrl,
            title: artwork.Title,
            type: 'artwork',
            description: artwork.Description
          });
        }
      });
    }
    
    setAllImages(images);
  }, [project]);

  // Handle scroll to collapse header
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const scrollTop = contentRef.current.scrollTop;
        setIsHeaderCollapsed(scrollTop > 50);
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      return () => contentElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Handle keyboard events for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxOpen) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);
  
  if (!project) return null;

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        className={`project-modal ${isDarkMode ? 'dark-mode' : ''}`}
      >
        {/* Custom Header Section for Image and Title */}
        <Box className={`modal-header-visual ${isHeaderCollapsed ? 'collapsed' : ''}`}>
          {project.ImageUrl && (
            <img
              src={project.ImageUrl}
              alt={project.Name}
              className="project-image-header"
            />
          )}
          <Box className="modal-title-overlay">
            <Typography variant="h4" component="h2" className="modal-title-h2">
              {project.Name}
            </Typography>
            {project.FacultyFellow && (
              <Typography variant="subtitle1" className="faculty-fellow">
                By {project.FacultyFellow}
              </Typography>
            )}
          </Box>
        </Box>
        
        <DialogContent className="modal-content" ref={contentRef}>
          <Grid2 container spacing={4}>
            
            {project.Location && (
              <Grid2 xs={12}>
                <Box className="info-section">
                  <Typography variant="h6" className="section-title">
                    📍 Location
                  </Typography>
                  <Typography variant="body1" className="section-content">
                    {project.Location}
                  </Typography>
                </Box>
              </Grid2>
            )}

            {project.DescriptionLong || project.DescriptionShort ? (
              <Grid2 xs={12}>
                <Box className="info-section">
                  <Typography variant="h6" className="section-title">
                    📝 Description
                  </Typography>
                  <Typography variant="body1" className="section-content">
                    {project.DescriptionLong || project.DescriptionShort}
                  </Typography>
                </Box>
              </Grid2>
            ) : null}

            {project.Background && (
              <Grid2 xs={12}>
                <Box className="info-section">
                  <Typography variant="h6" className="section-title">
                    🎯 Background
                  </Typography>
                  <Typography variant="body1" className="section-content">
                    {project.Background}
                  </Typography>
                </Box>
              </Grid2>
            )}

            {project.Education && project.Education.length > 0 && (
              <Grid2 xs={12}>
                <Box className="info-section">
                  <Typography variant="h6" className="section-title">
                    🎓 Education
                  </Typography>
                  {project.Education.map((edu, index) => (
                    <Typography key={index} variant="body1" className="education-item">
                      {edu}
                    </Typography>
                  ))}
                </Box>
              </Grid2>
            )}

            {/* Grouping Affiliation, College, Department, Year into a single Grid container */}
            {(project.Affiliation || project.College || project.Department || project.Year) && (
              <Grid2 xs={12}>
                <Grid2 container spacing={3}>
                  {project.Affiliation && (
                    <Grid2 xs={12} sm={6}>
                      <Box className="info-section">
                        <Typography variant="h6" className="section-title">
                          🏢 Affiliation
                        </Typography>
                        <Typography variant="body1" className="section-content">
                          {project.Affiliation}
                        </Typography>
                      </Box>
                    </Grid2>
                  )}

                  {project.College && (
                    <Grid2 xs={12} sm={6}>
                      <Box className="info-section">
                        <Typography variant="h6" className="section-title">
                          🏛️ College
                        </Typography>
                        <Typography variant="body1" className="section-content">
                          {project.College}
                        </Typography>
                      </Box>
                    </Grid2>
                  )}

                  {project.Department && (
                    <Grid2 xs={12} sm={6}>
                      <Box className="info-section">
                        <Typography variant="h6" className="section-title">
                          📚 Department
                        </Typography>
                        <Typography variant="body1" className="section-content">
                          {project.Department}
                        </Typography>
                      </Box>
                    </Grid2>
                  )}

                  {project.Year && (
                    <Grid2 xs={12} sm={6}>
                      <Box className="info-section">
                        <Typography variant="h6" className="section-title">
                          📅 Year
                        </Typography>
                        <Typography variant="body1" className="section-content">
                          {project.Year}
                        </Typography>
                      </Box>
                    </Grid2>
                  )}
                </Grid2>
              </Grid2>
            )}

            {project.Outcome && project.Outcome.Type && (
              <Grid2 xs={12}>
                <Divider className="section-divider" />
                <Box className="info-section">
                  <Typography variant="h6" className="section-title">
                    🎯 Outcome
                  </Typography>
                  <Paper className="outcome-card">
                    <Typography variant="h6" className="outcome-title">
                      {project.Outcome.Title}
                    </Typography>
                    <Typography variant="body1" className="outcome-summary">
                      {project.Outcome.Summary}
                    </Typography>
                    {project.Outcome.Link && (
                      <Button
                        variant="contained"
                        color="primary"
                        href={project.Outcome.Link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="outcome-button"
                      >
                        View Outcome
                      </Button>
                    )}
                  </Paper>
                </Box>
              </Grid2>
            )}

            {project.HasArtwork && project.Artworks && project.Artworks.length > 0 && (
              <Grid2 xs={12}>
                <Divider className="section-divider" />
                <Box className="info-section">
                  <Typography variant="h6" className="section-title">
                    🎨 Artworks ({project.Artworks.length})
                  </Typography>
                  <div className="artwork-gallery">
                    {project.Artworks.map((artwork, index) => (
                      <Paper key={index} className="artwork-card" onClick={() => {
                        const imageIndex = allImages.findIndex(img => img.src === artwork.ImageUrl);
                        if (imageIndex !== -1) openLightbox(imageIndex);
                      }}>
                        {artwork.ImageUrl && (
                          <div className="artwork-image-container">
                            <img
                              src={artwork.ImageUrl}
                              alt={artwork.Title}
                              className="artwork-image"
                            />
                            <div className="artwork-image-overlay">
                              <ZoomIn />
                            </div>
                          </div>
                        )}
                        <div className="artwork-content">
                          <Typography variant="h6" className="artwork-title">
                            {artwork.Title}
                          </Typography>
                          <Typography variant="body2" className="artwork-description">
                            {artwork.Description}
                          </Typography>
                        </div>
                      </Paper>
                    ))}
                  </div>
                </Box>
              </Grid2>
            )}

            {project.HasPoems && project.Poems && project.Poems.length > 0 && (
              <Grid2 xs={12}>
                <Divider className="section-divider" />
                <Box className="info-section">
                  <Typography variant="h6" className="section-title">
                    📜 Poems ({project.Poems.length})
                  </Typography>
                  <Grid2 container spacing={3}>
                    {project.Poems.map((poem, index) => (
                      <Grid2 xs={12} key={index}>
                        <Paper className="poem-card">
                          <Typography variant="h6" className="poem-title">
                            {poem.Title}
                          </Typography>
                          <Typography variant="body1" className="poem-content">
                            {poem.Content}
                          </Typography>
                          {poem.Author && (
                            <Typography variant="subtitle2" className="poem-author">
                              - {poem.Author}
                            </Typography>
                          )}
                        </Paper>
                      </Grid2>
                    ))}
                  </Grid2>
                </Box>
              </Grid2>
            )}

            {project.Activities && project.Activities.length > 0 && (
              <Grid2 xs={12}>
                <Divider className="section-divider" />
                <Box className="info-section">
                  <Typography variant="h6" className="section-title">
                    🎪 Activities ({project.Activities.length})
                  </Typography>
                  <Grid2 container spacing={3}>
                    {project.Activities.map((activity, index) => (
                      <Grid2 xs={12} key={index}>
                        <Paper className="activity-card">
                          <Typography variant="h6" className="activity-title">
                            {activity.Title}
                          </Typography>
                          <Typography variant="body1" className="activity-description">
                            {activity.Description}
                          </Typography>
                          {activity.Date && (
                            <Typography variant="caption" className="activity-date">
                              📅 {activity.Date}
                            </Typography>
                          )}
                          {activity.Link && (
                            <Button
                              variant="text"
                              color="primary"
                              href={activity.Link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="activity-link"
                            >
                              Learn More
                            </Button>
                          )}
                        </Paper>
                      </Grid2>
                    ))}
                  </Grid2>
                </Box>
              </Grid2>
            )}

            {project.relatedUrls && project.relatedUrls.length > 0 && (
              <Grid2 xs={12}>
                <Divider className="section-divider" />
                <Box className="info-section">
                  <Typography variant="h6" className="section-title">
                    🔗 Related Links ({project.relatedUrls.length})
                  </Typography>
                  <Grid2 container spacing={2}>
                    {project.relatedUrls.map((url, index) => (
                      <Grid2 xs={12} key={index}>
                        <Button
                          href={url.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="outlined"
                          fullWidth
                          className="related-link-button"
                        >
                          {url.title}
                        </Button>
                      </Grid2>
                    ))}
                  </Grid2>
                </Box>
              </Grid2>
            )}
          </Grid2>
        </DialogContent>
        
        <DialogActions className="modal-actions">
          <Button onClick={onClose} variant="contained" className="close-button">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Lightbox */}
      <div className={`image-lightbox ${lightboxOpen ? 'open' : ''}`} onClick={closeLightbox}>
        <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
          {allImages.length > 0 && (
            <>
              <img
                src={allImages[currentImageIndex].src}
                alt={allImages[currentImageIndex].title}
                className="lightbox-image"
              />
              <Typography className="lightbox-title">
                {allImages[currentImageIndex].title}
              </Typography>
              {allImages[currentImageIndex].description && (
                <Typography variant="body2" style={{ color: 'white', textAlign: 'center', marginTop: '0.5rem', opacity: 0.8 }}>
                  {allImages[currentImageIndex].description}
                </Typography>
              )}
            </>
          )}
          
          <button className="lightbox-close" onClick={closeLightbox}>
            <Close />
          </button>
          
          {allImages.length > 1 && (
            <>
              <button className="lightbox-nav prev" onClick={prevImage}>
                <NavigateBefore />
              </button>
              <button className="lightbox-nav next" onClick={nextImage}>
                <NavigateNext />
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ProjectModal;