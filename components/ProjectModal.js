import React, { useState, useRef, useEffect } from 'react';
import { useDarkMode } from "../contexts/DarkModeContext";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
  Divider,
  IconButton,
  Tabs,
  Tab,
  Badge,
} from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { 
  Close, 
  NavigateBefore, 
  NavigateNext, 
  ZoomIn,
  InfoOutlined,
  Palette,
  MenuBook,
  Event,
  Link as LinkIcon
} from '@mui/icons-material';
import '../styles/ProjectModal.css';

const ProjectModal = ({ open, onClose, project }) => {
  const { isDarkMode } = useDarkMode();
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [allImages, setAllImages] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
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

  // Reset active tab when modal opens
  useEffect(() => {
    if (open) {
      setActiveTab(0);
    }
  }, [open]);
  
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

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Define available tabs based on project content
  const tabs = [
    { label: 'Overview', icon: InfoOutlined, content: 'overview' },
    ...(project.HasArtwork && project.Artworks?.length > 0 ? [{ 
      label: 'Artworks', 
      icon: Palette, 
      content: 'artworks',
      count: project.Artworks.length 
    }] : []),
    ...(project.HasPoems && project.Poems?.length > 0 ? [{ 
      label: 'Poems', 
      icon: MenuBook, 
      content: 'poems',
      count: project.Poems.length 
    }] : []),
    ...(project.Activities?.length > 0 ? [{ 
      label: 'Activities', 
      icon: Event, 
      content: 'activities',
      count: project.Activities.length 
    }] : []),
    ...(project.relatedUrls?.length > 0 ? [{ 
      label: 'Links', 
      icon: LinkIcon, 
      content: 'links',
      count: project.relatedUrls.length 
    }] : [])
  ];

  const renderOverviewTab = () => (
    <div className="tab-content">
      <Grid2 container spacing={3}>
        {/* Description */}
        {(project.DescriptionLong || project.DescriptionShort) && (
          <Grid2 xs={12}>
            <Paper className="info-card">
              <Typography variant="h6" className="card-title">
                📝 Description
              </Typography>
              <Typography variant="body1" className="card-content">
                {project.DescriptionLong || project.DescriptionShort}
              </Typography>
            </Paper>
          </Grid2>
        )}

        {/* Background */}
        {project.Background && (
          <Grid2 xs={12}>
            <Paper className="info-card">
              <Typography variant="h6" className="card-title">
                🎯 Background
              </Typography>
              <Typography variant="body1" className="card-content">
                {project.Background}
              </Typography>
            </Paper>
          </Grid2>
        )}

        {/* Education */}
        {project.Education && project.Education.length > 0 && (
          <Grid2 xs={12}>
            <Paper className="info-card">
              <Typography variant="h6" className="card-title">
                🎓 Education
              </Typography>
              <div className="education-list">
                {project.Education.map((edu, index) => (
                  <Typography key={index} variant="body1" className="education-item">
                    {edu}
                  </Typography>
                ))}
              </div>
            </Paper>
          </Grid2>
        )}

        {/* Affiliation Info Grid */}
        <Grid2 xs={12}>
          <Grid2 container spacing={2}>
            {project.Affiliation && (
              <Grid2 xs={12} sm={6} md={3}>
                <Paper className="info-card compact">
                  <Typography variant="h6" className="card-title">
                    🏢 Affiliation
                  </Typography>
                  <Typography variant="body1" className="card-content">
                    {project.Affiliation}
                  </Typography>
                </Paper>
              </Grid2>
            )}
            {project.College && (
              <Grid2 xs={12} sm={6} md={3}>
                <Paper className="info-card compact">
                  <Typography variant="h6" className="card-title">
                    🏛️ College
                  </Typography>
                  <Typography variant="body1" className="card-content">
                    {project.College}
                  </Typography>
                </Paper>
              </Grid2>
            )}
            {project.Department && (
              <Grid2 xs={12} sm={6} md={3}>
                <Paper className="info-card compact">
                  <Typography variant="h6" className="card-title">
                    📚 Department
                  </Typography>
                  <Typography variant="body1" className="card-content">
                    {project.Department}
                  </Typography>
                </Paper>
              </Grid2>
            )}
            {project.Year && (
              <Grid2 xs={12} sm={6} md={3}>
                <Paper className="info-card compact">
                  <Typography variant="h6" className="card-title">
                    📅 Year
                  </Typography>
                  <Typography variant="body1" className="card-content">
                    {project.Year}
                  </Typography>
                </Paper>
              </Grid2>
            )}
          </Grid2>
        </Grid2>

        {/* Location */}
        {project.Location && (
          <Grid2 xs={12}>
            <Paper className="info-card">
              <Typography variant="h6" className="card-title">
                📍 Location
              </Typography>
              <Typography variant="body1" className="card-content">
                {project.Location}
              </Typography>
            </Paper>
          </Grid2>
        )}

        {/* Outcome */}
        {project.Outcome && project.Outcome.Type && (
          <Grid2 xs={12}>
            <Paper className="outcome-card">
              <Typography variant="h6" className="card-title">
                🎯 Outcome
              </Typography>
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
          </Grid2>
        )}
      </Grid2>
    </div>
  );

  const renderArtworksTab = () => (
    <div className="tab-content">
      <div className="artwork-gallery">
        {project.Artworks?.map((artwork, index) => (
          <Paper key={index} className="artwork-card" onClick={() => {
            let imageIndex = allImages.findIndex(img => img.src === artwork.ImageUrl);
            console.log('card clicked', artwork.ImageUrl, imageIndex, allImages);
            if (imageIndex === -1) {
              imageIndex = index + (project.ImageUrl ? 1 : 0);
            }
            openLightbox(imageIndex);
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
    </div>
  );

  const renderPoemsTab = () => (
    <div className="tab-content">
      <Grid2 container spacing={3}>
        {project.Poems?.map((poem, index) => (
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
    </div>
  );

  const renderActivitiesTab = () => (
    <div className="tab-content">
      <Grid2 container spacing={3}>
        {project.Activities?.map((activity, index) => (
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
    </div>
  );

  const renderLinksTab = () => (
    <div className="tab-content">
      <Grid2 container spacing={2}>
        {project.relatedUrls?.map((url, index) => (
          <Grid2 xs={12} sm={6} key={index}>
            <Button
              href={url.url}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              fullWidth
              className="related-link-button"
              startIcon={<LinkIcon />}
            >
              {url.title}
            </Button>
          </Grid2>
        ))}
      </Grid2>
    </div>
  );

  const renderTabContent = () => {
    const currentTab = tabs[activeTab];
    if (!currentTab) return null;

    switch (currentTab.content) {
      case 'overview':
        return renderOverviewTab();
      case 'artworks':
        return renderArtworksTab();
      case 'poems':
        return renderPoemsTab();
      case 'activities':
        return renderActivitiesTab();
      case 'links':
        return renderLinksTab();
      default:
        return renderOverviewTab();
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        className={`project-modal ${isDarkMode ? 'dark-mode' : ''}`}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(15px) saturate(1.5)',
              WebkitBackdropFilter: 'blur(15px) saturate(1.5)',
            },
          },
        }}
      >
        {/* Header Section */}
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

        {/* Tabs Navigation */}
        <Box className="modal-tabs-container">
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            className="modal-tabs"
          >
            {tabs.map((tab, index) => {
              const IconComponent = tab.icon;
              return (
                <Tab
                  key={index}
                  icon={<IconComponent />}
                  label={
                    tab.count ? (
                      <Badge badgeContent={tab.count} color="primary">
                        {tab.label}
                      </Badge>
                    ) : (
                      tab.label
                    )
                  }
                  className="modal-tab"
                />
              );
            })}
          </Tabs>
        </Box>
        
        <DialogContent className="modal-content" ref={contentRef}>
          {renderTabContent()}
        </DialogContent>
        
        <DialogActions className="modal-actions">
          <Button onClick={onClose} variant="contained" className="close-button">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Simplified Image Lightbox for debugging */}
      {lightboxOpen && allImages.length > 0 && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}
          onClick={closeLightbox}
        >
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }} onClick={e => e.stopPropagation()}>
            <img
              src={allImages[currentImageIndex].src}
              alt={allImages[currentImageIndex].title}
              style={{ maxWidth: '90vw', maxHeight: '70vh', borderRadius: 8, background: '#fff', marginBottom: 12 }}
            />
            {allImages[currentImageIndex].description && (
              <div style={{ color: '#e5e7eb', marginTop: 4, fontSize: 14, fontWeight: 400, maxWidth: '60vw', marginLeft: 'auto', marginRight: 'auto', whiteSpace: 'pre-line', opacity: 0.85, textAlign: 'center' }}>
                {allImages[currentImageIndex].description}
              </div>
            )}
            <button style={{ position: 'absolute', top: 10, right: 10, zIndex: 3 }} onClick={closeLightbox}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectModal;