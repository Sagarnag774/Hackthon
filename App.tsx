
import React, { useState, useEffect, useCallback } from 'react';
import { Artwork, Tour, View } from './types';
import { TOURS as initialTours } from './constants';
import { identifyArtwork } from './services/geminiService';
import { trackEvent } from './services/analyticsService';
import Scanner from './components/Scanner';
import ArtworkDetail from './components/ArtworkDetail';
import TourView from './components/TourView';
import BottomNav from './components/BottomNav';
import TourEditor from './components/TourEditor';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('scanner');
  const [activeTour, setActiveTour] = useState<Tour | null>(null);
  const [currentArtwork, setCurrentArtwork] = useState<Artwork | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [showPrivacyBanner, setShowPrivacyBanner] = useState<boolean>(false);
  const [isManagerMode, setIsManagerMode] = useState<boolean>(false);
  const [tours, setTours] = useState<Tour[]>([]);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);

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
    
    // Load tours from localStorage or initial constants
    const storedTours = localStorage.getItem('realmeta_tours');
    if (storedTours) {
      setTours(JSON.parse(storedTours));
    } else {
      setTours(initialTours);
    }
    
    // Check for manager session
    const managerSession = sessionStorage.getItem('realmeta_manager');
    if (managerSession) {
      setIsManagerMode(true);
    }
  }, []);
  
  // Effect to save tours to localStorage whenever they change
  useEffect(() => {
    if (tours.length > 0) {
        localStorage.setItem('realmeta_tours', JSON.stringify(tours));
    }
  }, [tours]);

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
  
  const handleLogin = () => {
    const password = prompt('Enter manager password:');
    if (password === 'admin123') {
      setIsManagerMode(true);
      sessionStorage.setItem('realmeta_manager', 'true');
      trackEvent('manager_login', { userId });
    } else if (password) {
      alert('Incorrect password.');
    }
  };

  const handleAddNewTour = () => {
    setEditingTour({
      id: `tour_${Date.now()}`,
      title: '',
      description: '',
      artworks: [],
    });
    setCurrentView('tourEditor');
  };

  const handleEditTour = (tour: Tour) => {
    setEditingTour(tour);
    setCurrentView('tourEditor');
  };

  const handleDeleteTour = (tourId: string) => {
    if (window.confirm('Are you sure you want to delete this tour? This action cannot be undone.')) {
      const updatedTours = tours.filter(t => t.id !== tourId);
      setTours(updatedTours);
      trackEvent('tour_deleted', { userId, tourId });
    }
  };
  
  const handleSaveTour = (tourToSave: Tour) => {
    const isNew = !tours.some(t => t.id === tourToSave.id);
    if (isNew) {
      setTours([...tours, tourToSave]);
      trackEvent('tour_created', { userId, tourId: tourToSave.id });
    } else {
      setTours(tours.map(t => t.id === tourToSave.id ? tourToSave : t));
      trackEvent('tour_updated', { userId, tourId: tourToSave.id });
    }
    setCurrentView('tours');
    setEditingTour(null);
  };

  const handleCancelEdit = () => {
    setCurrentView('tours');
    setEditingTour(null);
  };

  const renderView = () => {
    switch (currentView) {
      case 'tours':
        return <TourView 
                tours={tours} 
                onSelectTour={handleSelectTour}
                isManagerMode={isManagerMode}
                onLogin={handleLogin}
                onAddNewTour={handleAddNewTour}
                onEditTour={handleEditTour}
                onDeleteTour={handleDeleteTour}
              />;
      case 'tourEditor':
        return editingTour && <TourEditor 
                                tour={editingTour} 
                                onSave={handleSaveTour} 
                                onCancel={handleCancelEdit} 
                              />;
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
