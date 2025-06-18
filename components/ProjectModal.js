import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Paper,
  Divider,
} from '@mui/material';

const ProjectModal = ({ open, onClose, project, isDarkMode }) => {
  if (!project) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: isDarkMode ? '#333' : '#fff',
          color: isDarkMode ? '#fff' : '#000',
        },
      }}
    >
      <DialogTitle>
        {project.Name}
        {project.FacultyFellow && (
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
            By {project.FacultyFellow}
          </Typography>
        )}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {project.ImageUrl && (
            <Grid item xs={12}>
              <img
                src={project.ImageUrl}
                alt={project.Name}
                style={{
                  width: '100%',
                  maxHeight: '300px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
            </Grid>
          )}
          
          {project.Location && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Location
              </Typography>
              <Typography variant="body1" paragraph>
                📍 {project.Location}
              </Typography>
            </Grid>
          )}

          {project.DescriptionLong || project.DescriptionShort ? (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Description: {project.ProjectName}
              </Typography>
              <Typography variant="body1" paragraph>
                {project.DescriptionLong || project.DescriptionShort}
              </Typography>
            </Grid>
          ) : null}

          {project.Background && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Background
              </Typography>
              <Typography variant="body1" paragraph>
                {project.Background}
              </Typography>
            </Grid>
          )}

          {project.Education && project.Education.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Education
              </Typography>
              {project.Education.map((edu, index) => (
                <Typography key={index} variant="body1" paragraph>
                  • {edu}
                </Typography>
              ))}
            </Grid>
          )}

          {project.Affiliation && (
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Affiliation
              </Typography>
              <Typography variant="body1">
                {project.Affiliation}
              </Typography>
            </Grid>
          )}

          {project.College && (
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                College
              </Typography>
              <Typography variant="body1">
                {project.College}
              </Typography>
            </Grid>
          )}

          {project.Department && (
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Department
              </Typography>
              <Typography variant="body1">
                {project.Department}
              </Typography>
            </Grid>
          )}

          {project.Year && (
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Year
              </Typography>
              <Typography variant="body1">
                {project.Year}
              </Typography>
            </Grid>
          )}

          {project.Outcome && project.Outcome.Type && (
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Outcome
              </Typography>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  backgroundColor: isDarkMode ? '#444' : '#f5f5f5',
                }}
              >
                <Typography variant="subtitle1">{project.Outcome.Title}</Typography>
                <Typography variant="body2" paragraph>
                  {project.Outcome.Summary}
                </Typography>
                {project.Outcome.Link && (
                  <Button
                    variant="contained"
                    color="primary"
                    href={project.Outcome.Link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Outcome
                  </Button>
                )}
              </Paper>
            </Grid>
          )}

          {project.HasArtwork && project.Artworks && project.Artworks.length > 0 && (
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Artworks
              </Typography>
              <Grid container spacing={2}>
                {project.Artworks.map((artwork, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 2,
                        backgroundColor: isDarkMode ? '#444' : '#f5f5f5',
                      }}
                    >
                      {artwork.ImageUrl && (
                        <img
                          src={artwork.ImageUrl}
                          alt={artwork.Title}
                          style={{
                            width: '100%',
                            height: '200px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                            marginBottom: '8px',
                          }}
                        />
                      )}
                      <Typography variant="subtitle1">{artwork.Title}</Typography>
                      <Typography variant="body2">{artwork.Description}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}

          {project.HasPoems && project.Poems && project.Poems.length > 0 && (
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Poems
              </Typography>
              <Grid container spacing={2}>
                {project.Poems.map((poem, index) => (
                  <Grid item xs={12} key={index}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 2,
                        backgroundColor: isDarkMode ? '#444' : '#f5f5f5',
                      }}
                    >
                      <Typography variant="subtitle1">{poem.Title}</Typography>
                      <Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>
                        {poem.Content}
                      </Typography>
                      {poem.Author && (
                        <Typography variant="subtitle2" sx={{ mt: 1, fontStyle: 'italic' }}>
                          - {poem.Author}
                        </Typography>
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}

          {project.Activities && project.Activities.length > 0 && (
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Activities
              </Typography>
              <Grid container spacing={2}>
                {project.Activities.map((activity, index) => (
                  <Grid item xs={12} key={index}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 2,
                        backgroundColor: isDarkMode ? '#444' : '#f5f5f5',
                      }}
                    >
                      <Typography variant="subtitle1">{activity.Title}</Typography>
                      <Typography variant="body2" paragraph>
                        {activity.Description}
                      </Typography>
                      {activity.Date && (
                        <Typography variant="caption" color="text.secondary">
                          {activity.Date}
                        </Typography>
                      )}
                      {activity.Link && (
                        <Button
                          variant="text"
                          color="primary"
                          href={activity.Link}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ mt: 1 }}
                        >
                          Learn More
                        </Button>
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}

          {project.relatedUrls && project.relatedUrls.length > 0 && (
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Related Links
              </Typography>
              <Grid container spacing={2}>
                {project.relatedUrls.map((url, index) => (
                  <Grid item xs={12} key={index}>
                    <Button
                      href={url.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outlined"
                      fullWidth
                    >
                      {url.title}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectModal; 