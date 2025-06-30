import React, { useState, useEffect } from 'react';
import { X, Info, Palette, BookOpen, Calendar, ExternalLink, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { EnhancedPoemsTabSidebar, EnhancedPoemsTabDisplay } from './EnhancedPoemsTab';
import { useDarkMode } from '../contexts/DarkModeContext';

export default function ProjectGalleryLayout({ project, onClose }) {
  console.log('ProjectGalleryLayout rendered with project:', project?.Name);
  
  const [activeTab, setActiveTab] = useState(0);
  const [allImages, setAllImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { isDarkMode } = useDarkMode();

  // --- Poems tab state ---
  const [selectedPoem, setSelectedPoem] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [completedLines, setCompletedLines] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);

  // Animation logic for poems
  const startAnimation = () => {
    if (!project.Poems || !project.Poems[selectedPoem]) return;
    const lines = project.Poems[selectedPoem].Content?.split('\n')?.filter(line => line.trim()) || [];
    setIsAnimating(true);
    setCompletedLines([]);
    setCurrentLineIndex(-1);
    lines.forEach((line, index) => {
      setTimeout(() => {
        setCurrentLineIndex(index);
        setTimeout(() => {
          setCompletedLines(prev => [...prev, index]);
          if (index === lines.length - 1) {
            setIsAnimating(false);
            setCurrentLineIndex(-1);
          }
        }, 2000 + line.length * 50);
      }, index * 3000);
    });
  };
  const resetAnimation = () => {
    setIsAnimating(false);
    setCompletedLines([]);
    setCurrentLineIndex(-1);
  };

  useEffect(() => {
    if (!project) return;
    const images = [];
    if (project.ImageUrl) {
      images.push({ src: project.ImageUrl, title: project.Name, type: 'project' });
    }
    if (project.Artworks && project.Artworks.length > 0) {
      project.Artworks.forEach((artwork) => {
        if (artwork.ImageUrl) {
          images.push({ src: artwork.ImageUrl, title: artwork.Title, type: 'artwork', description: artwork.Description });
        }
      });
    }
    setAllImages(images);
  }, [project]);

  if (!project) return null;

  const tabs = [
    { label: 'Overview', icon: Info, content: 'overview' },
    ...(project.HasArtwork && project.Artworks?.length > 0 ? [{ label: 'Artworks', icon: Palette, content: 'artworks', count: project.Artworks.length }] : []),
    ...(project.HasPoems && project.Poems?.length > 0 ? [{ label: 'Poems', icon: BookOpen, content: 'poems', count: project.Poems.length }] : []),
    ...(project.Activities?.length > 0 ? [{ label: 'Activities', icon: Calendar, content: 'activities', count: project.Activities.length }] : []),
    ...(project.relatedUrls?.length > 0 ? [{ label: 'Links', icon: ExternalLink, content: 'links', count: project.relatedUrls.length }] : [])
  ];

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {project.ImageUrl && (
        <div className="mb-4 flex justify-center">
          <img
            src={project.ImageUrl}
            alt={project.Name}
            className="rounded-lg shadow-lg max-w-full max-h-56 object-contain border"
            style={{ 
              width: '100%', 
              maxWidth: 320,
              borderColor: isDarkMode ? '#374151' : '#e5e7eb',
              backgroundColor: isDarkMode ? '#000000' : '#ffffff'
            }}
          />
        </div>
      )}
      {(project.DescriptionLong || project.DescriptionShort) && (
        <section>
          <h3 
            className="text-lg font-bold mb-2"
            style={{ color: isDarkMode ? '#ffffff' : '#111827' }}
          >
            Description
          </h3>
          <p 
            className="text-lg leading-relaxed"
            style={{ color: isDarkMode ? '#d1d5db' : '#374151' }}
          >
            {project.DescriptionLong || project.DescriptionShort}
          </p>
        </section>
      )}
      {project.Background && (
        <section>
          <h3 
            className="text-lg font-bold mb-2"
            style={{ color: isDarkMode ? '#ffffff' : '#111827' }}
          >
            Background
          </h3>
          <p 
            className="text-lg leading-relaxed"
            style={{ color: isDarkMode ? '#d1d5db' : '#374151' }}
          >
            {project.Background}
          </p>
        </section>
      )}
    </div>
  );

  const renderArtworksTab = () => (
    <div className="space-y-3">
      {project.Artworks?.map((artwork, index) => (
        <div 
          key={index} 
          className="group flex items-start gap-3 p-2 rounded-lg cursor-pointer transition-colors"
          style={{
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: isDarkMode ? '#374151' : '#f3f4f6'
            }
          }}
          onClick={() => setCurrentImageIndex(index + (project.ImageUrl ? 1 : 0))}
        >
          {artwork.ImageUrl && (
            <div className="relative flex-shrink-0">
              <img src={artwork.ImageUrl} alt={artwork.Title} className="w-12 h-12 object-cover rounded" />
              <div 
                className="absolute inset-0 rounded transition-colors flex items-center justify-center"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.2)'
                  }
                }}
              >
                <ZoomIn className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h4 
              className="text-base font-medium mb-1 break-words"
              style={{ color: isDarkMode ? '#ffffff' : '#111827' }}
            >
              {artwork.Title}
            </h4>
            <p 
              className="text-sm leading-relaxed break-words whitespace-pre-line"
              style={{ color: isDarkMode ? '#d1d5db' : '#6b7280' }}
            >
              {artwork.DescriptionLong || artwork.Description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPoemsTab = () => (
    <EnhancedPoemsTabSidebar
      poems={project.Poems || []}
      selectedPoem={selectedPoem}
      setSelectedPoem={index => {
        setSelectedPoem(index);
        resetAnimation();
      }}
      isAnimating={isAnimating}
      startAnimation={startAnimation}
      resetAnimation={resetAnimation}
    />
  );

  const renderActivitiesTab = () => (
    <div className="space-y-3">
      {project.Activities?.map((activity, index) => (
        <div 
          key={index} 
          className="p-3 rounded-lg"
          style={{ 
            backgroundColor: isDarkMode ? '#374151' : '#f3f4f6'
          }}
        >
          <h4 
            className="font-medium text-sm mb-1"
            style={{ color: isDarkMode ? '#ffffff' : '#111827' }}
          >
            {activity.Title}
          </h4>
          <p 
            className="text-sm mb-2"
            style={{ color: isDarkMode ? '#d1d5db' : '#6b7280' }}
          >
            {activity.Description}
          </p>
          <div className="flex items-center justify-between">
            {activity.Date && (
              <span 
                className="text-xs"
                style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}
              >
                {activity.Date}
              </span>
            )}
            {activity.Link && (
              <a 
                href={activity.Link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs flex items-center gap-1"
                style={{ 
                  color: '#3b82f6',
                  '&:hover': {
                    color: '#60a5fa'
                  }
                }}
              >
                Learn More <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderLinksTab = () => (
    <div className="space-y-2">
      {project.relatedUrls?.map((url, index) => (
        <a 
          key={index} 
          href={url.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-2 p-2 rounded-lg transition-colors text-sm"
          style={{
            color: isDarkMode ? '#d1d5db' : '#6b7280',
            '&:hover': {
              backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
              color: isDarkMode ? '#ffffff' : '#111827'
            }
          }}
        >
          <ExternalLink className="w-4 h-4" />
          {url.title}
        </a>
      ))}
    </div>
  );

  const renderTabContent = () => {
    switch (tabs[activeTab]?.content) {
      case 'overview': return renderOverviewTab();
      case 'artworks': return renderArtworksTab();
      case 'poems': return renderPoemsTab();
      case 'activities': return renderActivitiesTab();
      case 'links': return renderLinksTab();
      default: return null;
    }
  };

  const mainImage = allImages[currentImageIndex] || allImages[0];

  return (
    <div 
      className="h-screen w-screen grid grid-cols-[420px_1fr] fixed top-0 left-0 z-[2000]"
      style={{ 
        backgroundColor: isDarkMode ? '#111827' : '#ffffff'
      }}
    >
      {/* Sidebar */}
      <div 
        className="border-r flex flex-col min-w-0" 
        style={{ 
          width: 420,
          backgroundColor: isDarkMode ? '#111827' : '#f9fafb',
          borderColor: isDarkMode ? '#374151' : '#e5e7eb'
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-6 border-b"
          style={{ 
            borderColor: isDarkMode ? '#374151' : '#e5e7eb'
          }}
        >
          <h1 
            className="font-bold text-2xl truncate pr-2"
            style={{ color: isDarkMode ? '#ffffff' : '#111827' }}
          >
            {project.Name}
          </h1>
          <button 
            onClick={onClose} 
            className="p-2 rounded-lg transition-colors"
            style={{
              color: isDarkMode ? '#9ca3af' : '#6b7280',
              '&:hover': {
                backgroundColor: isDarkMode ? '#374151' : '#f3f4f6'
              }
            }}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div 
          className="flex overflow-x-auto scrollbar-hide border-b"
          style={{ 
            borderColor: isDarkMode ? '#374151' : '#e5e7eb'
          }}
        >
          {tabs.map((tab, i) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.label}
                onClick={() => setActiveTab(i)}
                className="flex items-center gap-2 px-4 py-3 text-base font-semibold border-b-2 transition-colors whitespace-nowrap"
                style={{
                  color: activeTab === i 
                    ? '#3b82f6' 
                    : isDarkMode ? '#d1d5db' : '#6b7280',
                  borderBottomColor: activeTab === i ? '#3b82f6' : 'transparent',
                  backgroundColor: activeTab === i 
                    ? (isDarkMode ? '#374151' : '#f3f4f6')
                    : 'transparent',
                  '&:hover': {
                    color: activeTab === i ? '#3b82f6' : '#60a5fa'
                  }
                }}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
                {tab.count && (
                  <span 
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ 
                      backgroundColor: isDarkMode ? '#4b5563' : '#e5e7eb',
                      color: isDarkMode ? '#d1d5db' : '#374151'
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6" style={{ maxHeight: 'calc(100vh - 112px)' }}>
          {tabs[activeTab]?.content === 'poems'
            ? renderPoemsTab()
            : renderTabContent()}
        </div>
      </div>

      {/* Main Content Area */}
      <div 
        className="flex items-center justify-center relative"
        style={{ 
          backgroundColor: isDarkMode ? '#000000' : '#f9fafb'
        }}
      >
        {tabs[activeTab]?.content === 'overview' ? (
          project.ImageUrl ? (
            <img
              src={project.ImageUrl}
              alt={project.Name}
              className="max-h-[70vh] max-w-full object-contain rounded-lg shadow-lg border"
              style={{ 
                width: '100%', 
                maxWidth: 600,
                borderColor: isDarkMode ? '#374151' : '#e5e7eb',
                backgroundColor: isDarkMode ? '#000000' : '#ffffff'
              }}
            />
          ) : (
            <div 
              className="text-center"
              style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}
            >
              <Palette className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No image available</p>
            </div>
          )
        ) : tabs[activeTab]?.content === 'poems' ? (
          <div className="w-full h-full flex items-center justify-center" style={{ minHeight: '60vh' }}>
            <div 
              className="w-full max-w-2xl mx-auto p-8 rounded-2xl shadow-2xl border"
              style={{
                borderColor: isDarkMode ? '#1e3a8a' : '#dbeafe',
                background: isDarkMode 
                  ? 'linear-gradient(135deg, #181c24 0%, #1e2233 50%, #23293a 100%)'
                  : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)',
                opacity: 0.9
              }}
            >
              <EnhancedPoemsTabDisplay
                poem={project.Poems?.[selectedPoem]}
                completedLines={completedLines}
                currentLineIndex={currentLineIndex}
              />
            </div>
          </div>
        ) : mainImage ? (
          <>
            <img src={mainImage.src} alt={mainImage.title} 
                 className="max-h-full max-w-full object-contain" />
            {/* Image Counter */}
            <div 
              className="absolute top-4 right-4 backdrop-blur-sm rounded-lg px-2 py-1"
              style={{ backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.8)' }}
            >
              <span 
                className="text-xs"
                style={{ color: isDarkMode ? '#ffffff' : '#111827' }}
              >
                {currentImageIndex + 1} / {allImages.length}
              </span>
            </div>
            {/* Navigation */}
            {allImages.length > 1 && (
              <>
                <button 
                  onClick={() => setCurrentImageIndex((currentImageIndex - 1 + allImages.length) % allImages.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 backdrop-blur-sm p-2 rounded-lg transition-colors"
                  style={{ 
                    backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.8)'
                  }}
                >
                  <ChevronLeft className="w-5 h-5" style={{ color: isDarkMode ? '#ffffff' : '#111827' }} />
                </button>
                <button 
                  onClick={() => setCurrentImageIndex((currentImageIndex + 1) % allImages.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 backdrop-blur-sm p-2 rounded-lg transition-colors"
                  style={{ 
                    backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.8)'
                  }}
                >
                  <ChevronRight className="w-5 h-5" style={{ color: isDarkMode ? '#ffffff' : '#111827' }} />
                </button>
              </>
            )}
          </>
        ) : (
          <div 
            className="text-center"
            style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}
          >
            <Palette className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No image available</p>
          </div>
        )}
      </div>
    </div>
  );
}
