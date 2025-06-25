import React, { useState, useEffect } from 'react';
import { X, Info, Palette, BookOpen, Calendar, ExternalLink, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { EnhancedPoemsTabSidebar, EnhancedPoemsTabDisplay } from './EnhancedPoemsTab';

export default function ProjectGalleryLayout({ project, onClose }) {
  const [activeTab, setActiveTab] = useState(0);
  const [allImages, setAllImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
            className="rounded-lg shadow-lg max-w-full max-h-56 object-contain border border-gray-800 bg-black"
            style={{ width: '100%', maxWidth: 320 }}
          />
        </div>
      )}
      {(project.DescriptionLong || project.DescriptionShort) && (
        <section>
          <h3 className="text-lg font-bold text-white mb-2">Description</h3>
          <p className="text-gray-200 text-lg leading-relaxed">{project.DescriptionLong || project.DescriptionShort}</p>
        </section>
      )}
      {project.Background && (
        <section>
          <h3 className="text-lg font-bold text-white mb-2">Background</h3>
          <p className="text-gray-200 text-lg leading-relaxed">{project.Background}</p>
        </section>
      )}
    </div>
  );

  const renderArtworksTab = () => (
    <div className="space-y-3">
      {project.Artworks?.map((artwork, index) => (
        <div key={index} className="group flex items-start gap-3 p-2 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors"
             onClick={() => setCurrentImageIndex(index + (project.ImageUrl ? 1 : 0))}>
          {artwork.ImageUrl && (
            <div className="relative flex-shrink-0">
              <img src={artwork.ImageUrl} alt={artwork.Title} className="w-12 h-12 object-cover rounded" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded transition-colors flex items-center justify-center">
                <ZoomIn className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h4 className="text-white text-base font-medium mb-1 break-words">{artwork.Title}</h4>
            <p className="text-gray-300 text-sm leading-relaxed break-words whitespace-pre-line">{artwork.DescriptionLong || artwork.Description}</p>
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
        <div key={index} className="p-3 bg-gray-800 rounded-lg">
          <h4 className="text-white font-medium text-sm mb-1">{activity.Title}</h4>
          <p className="text-gray-300 text-sm mb-2">{activity.Description}</p>
          <div className="flex items-center justify-between">
            {activity.Date && <span className="text-gray-500 text-xs">{activity.Date}</span>}
            {activity.Link && (
              <a href={activity.Link} target="_blank" rel="noopener noreferrer" 
                 className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1">
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
        <a key={index} href={url.url} target="_blank" rel="noopener noreferrer" 
           className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors text-sm">
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
    <div className="h-screen w-screen grid grid-cols-[420px_1fr] fixed top-0 left-0 z-[2000] bg-gray-900">
      {/* Sidebar */}
      <div className="bg-gray-900 border-r border-gray-800 flex flex-col min-w-0" style={{ width: 420 }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h1 className="text-white font-bold text-2xl truncate pr-2">{project.Name}</h1>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-800">
          {tabs.map((tab, i) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.label}
                onClick={() => setActiveTab(i)}
                className={`flex items-center gap-2 px-4 py-3 text-base font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === i 
                    ? 'text-blue-400 border-blue-400 bg-gray-800'
                    : 'text-gray-300 border-transparent hover:text-blue-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
                {tab.count && <span className="text-xs bg-gray-700 px-2 py-0.5 rounded-full">{tab.count}</span>}
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
      <div className="bg-black flex items-center justify-center relative">
        {tabs[activeTab]?.content === 'overview' ? (
          project.ImageUrl ? (
            <img
              src={project.ImageUrl}
              alt={project.Name}
              className="max-h-[70vh] max-w-full object-contain rounded-lg shadow-lg border border-gray-800 bg-black"
              style={{ width: '100%', maxWidth: 600 }}
            />
          ) : (
            <div className="text-gray-500 text-center">
              <Palette className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No image available</p>
            </div>
          )
        ) : tabs[activeTab]?.content === 'poems' ? (
          <div className="w-full h-full flex items-center justify-center" style={{ minHeight: '60vh' }}>
            <div className="w-full max-w-2xl mx-auto p-8 rounded-2xl shadow-2xl border border-blue-900/30 bg-gradient-to-br from-[#181c24] via-[#1e2233] to-[#23293a] bg-opacity-90">
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
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
              <span className="text-white text-xs">
                {currentImageIndex + 1} / {allImages.length}
              </span>
            </div>
            {/* Navigation */}
            {allImages.length > 1 && (
              <>
                <button 
                  onClick={() => setCurrentImageIndex((currentImageIndex - 1 + allImages.length) % allImages.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm hover:bg-black/70 p-2 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <button 
                  onClick={() => setCurrentImageIndex((currentImageIndex + 1) % allImages.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm hover:bg-black/70 p-2 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </>
            )}
          </>
        ) : (
          <div className="text-gray-500 text-center">
            <Palette className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No image available</p>
          </div>
        )}
      </div>
    </div>
  );
}
