
import React, { useEffect, useState } from 'react';
import { Artwork, Tour } from '../types';
import { trackEvent } from '../services/analyticsService';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';

interface ArtworkDetailProps {
  artwork: Artwork;
  onBack: () => void;
  userId: string | null;
  activeTour: Tour | null;
}

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(title === 'Description');
    const sectionId = `section-${title.replace(/\s+/g, '-')}`;

    return (
        <div className="border-b border-stone-200 py-4">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-full text-left flex justify-between items-center"
                aria-expanded={isOpen}
                aria-controls={sectionId}
            >
                <h3 className="text-lg font-semibold text-stone-700">{title}</h3>
                <span className={`transform transition-transform text-2xl font-light text-stone-400 ${isOpen ? 'rotate-90' : ''}`}>›</span>
            </button>
            {isOpen && <div id={sectionId} className="mt-2 text-stone-600 space-y-2">{children}</div>}
        </div>
    );
};

const ArtworkDetail: React.FC<ArtworkDetailProps> = ({ artwork, onBack, userId, activeTour }) => {
  useEffect(() => {
    trackEvent('view_artwork_details', { userId, artworkTitle: artwork.title });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, artwork.title]);

  const tourStory = activeTour?.artworks.find(a => a.title === artwork.title)?.story;

  return (
    <div className="w-full h-full bg-stone-50 animate-fade-in">
      <div className="p-4 relative">
        <button onClick={onBack} className="absolute top-4 left-4 z-10 bg-white/70 backdrop-blur-sm rounded-full p-2 hover:bg-white transition shadow-md">
           <ChevronLeftIcon className="h-6 w-6 text-stone-800" />
        </button>
        {artwork.scannedImage ? (
            <img 
                src={`data:image/jpeg;base64,${artwork.scannedImage}`} 
                alt={`Your photo of ${artwork.title}`} 
                className="w-full h-64 object-cover rounded-lg shadow-lg" 
            />
        ) : (
             <div className="w-full h-64 bg-stone-200 rounded-lg shadow-lg flex items-center justify-center">
                <span className="text-stone-500">Image not available</span>
            </div>
        )}
      </div>
      <div className="p-6 pt-2 h-[calc(100%-18rem)] overflow-y-auto pb-20">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900">{artwork.title}</h1>
        <h2 className="text-xl text-stone-500 mt-1">{artwork.artist}</h2>
        <p className="text-sm text-stone-400 mt-1">{artwork.year} &bull; {artwork.style}</p>
        
        {tourStory && (
            <div className="mt-6 p-4 bg-amber-50 border-l-4 border-amber-400 text-amber-900 rounded-r-md">
                <p className="font-bold text-sm tracking-wide uppercase">Tour Spotlight</p>
                <p className="mt-2 italic">{tourStory}</p>
            </div>
        )}
        
        <div className="mt-4">
            {artwork.description && (
              <DetailSection title="Description">
                  <p>{artwork.description}</p>
              </DetailSection>
            )}
            {artwork.context && (
              <DetailSection title="Context">
                  <p>{artwork.context}</p>
              </DetailSection>
            )}
            {artwork.related_works && artwork.related_works.length > 0 && (
                <DetailSection title="Related Works">
                    <ul className="list-disc pl-5 space-y-1">
                        {artwork.related_works.map((work, index) => (
                            <li key={index}>
                                <span className="font-semibold">{work.title}</span> by {work.artist}
                            </li>
                        ))}
                    </ul>
                </DetailSection>
            )}
        </div>
      </div>
    </div>
  );
};

export default ArtworkDetail;
