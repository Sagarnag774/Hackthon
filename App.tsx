
import React, { useState, useEffect, useCallback } from 'react';
import { Artwork, Tour, View } from './types';
import { TOURS } from './constants';
import { identifyArtwork } from './services/geminiService';
import { trackEvent } from './services/analyticsService';
import Scanner from './components/Scanner';
import ArtworkDetail from './components/ArtworkDetail';
import TourView from './components/TourView';
import BottomNav from './components/BottomNav';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('scanner');
  const [activeTour, setActiveTour] = useState<Tour | null>(null);
  const [currentArtwork, setCurrentArtwork] = useState<Artwork | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [showPrivacyBanner, setShowPrivacyBanner] = useState<boolean>(false);

  useEffect(() => {
    let visitorId = localStorage.getItem('realmeta_visitor_id');
    if (!visitorId) {
      visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('realmeta_visitor_id', visitorId);
    }
    setUserId(visitorId);
    trackEvent('session_start', { userId: visitorId });

    const privacyAcknowledged = localStorage.getItem('realmeta_privacy_ack');
    if (!privacyAcknowledged) {
      setShowPrivacyBanner(true);
    }
  }, []);

  const handleScan = async (imageData: string) => {
    setIsLoading(true);
    setError(null);
    setCurrentArtwork(null);
    trackEvent('scan_initiated', { userId });

    try {
      const artwork = await identifyArtwork(imageData);
      if (artwork.error) {
        throw new Error(artwork.error);
      }
      setCurrentArtwork(artwork);
      setCurrentView('detail');
      trackEvent('scan_success', { userId, artworkTitle: artwork.title });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Could not identify artwork.';
      setError(errorMessage);
      trackEvent('scan_failed', { userId, error: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSelectTour = (tour: Tour) => {
    setActiveTour(tour);
    setCurrentView('scanner'); // Guide user to scan the first piece
    trackEvent('tour_selected', { userId, tourId: tour.id });
  };
  
  const resetToScanner = () => {
    setCurrentView('scanner');
    setCurrentArtwork(null);
    setError(null);
  };

  const renderView = () => {
    switch (currentView) {
      case 'tours':
        return <TourView tours={TOURS} onSelectTour={handleSelectTour} />;
      case 'detail':
        return currentArtwork && <ArtworkDetail artwork={currentArtwork} onBack={resetToScanner} userId={userId} activeTour={activeTour} />;
      case 'scanner':
      default:
        return (
          <Scanner 
            onScan={handleScan} 
            isLoading={isLoading} 
            error={error} 
            activeTour={activeTour}
            currentArtworkTitle={currentArtwork?.title}
          />
        );
    }
  };
  
  const dismissPrivacyBanner = () => {
    localStorage.setItem('realmeta_privacy_ack', 'true');
    setShowPrivacyBanner(false);
  };

  return (
    <div className="min-h-screen font-sans text-stone-800 flex flex-col max-w-lg mx-auto bg-white shadow-2xl">
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {renderView()}
      </main>
      <BottomNav currentView={currentView} setView={setCurrentView} />
      {showPrivacyBanner && (
        <div className="fixed bottom-16 sm:bottom-4 left-1/2 -translate-x-1/2 w-11/12 max-w-md bg-stone-800 text-white p-4 rounded-lg shadow-lg text-xs z-50 animate-fade-in-up">
          <p>We use anonymous analytics to understand visitor engagement and improve the museum experience. We respect your privacy.</p>
          <button onClick={dismissPrivacyBanner} className="mt-2 w-full bg-amber-600 text-white font-bold py-2 px-4 rounded hover:bg-amber-700 transition-colors">
            Got it
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
