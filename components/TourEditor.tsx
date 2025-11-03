
import React, { useState } from 'react';
import { Tour } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

interface TourEditorProps {
  tour: Tour;
  onSave: (tour: Tour) => void;
  onCancel: () => void;
}

const TourEditor: React.FC<TourEditorProps> = ({ tour: initialTour, onSave, onCancel }) => {
  const [tour, setTour] = useState<Tour>(initialTour);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTour(prev => ({ ...prev, [name]: value }));
  };

  const handleArtworkChange = (index: number, field: 'title' | 'story', value: string) => {
    const updatedArtworks = [...tour.artworks];
    updatedArtworks[index] = { ...updatedArtworks[index], [field]: value };
    setTour(prev => ({ ...prev, artworks: updatedArtworks }));
  };

  const addArtwork = () => {
    setTour(prev => ({
      ...prev,
      artworks: [...prev.artworks, { title: '', story: '' }]
    }));
  };

  const removeArtwork = (index: number) => {
    setTour(prev => ({
      ...prev,
      artworks: prev.artworks.filter((_, i) => i !== index)
    }));
  };
  
  const isFormValid = tour.title.trim() !== '' && tour.description.trim() !== '';

  return (
    <div className="p-6 bg-stone-50 h-full overflow-y-auto pb-24 animate-fade-in">
      <h1 className="text-3xl font-bold text-stone-900 mb-6">
        {initialTour.title ? 'Edit Tour' : 'Create Tour'}
      </h1>
      <div className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-stone-700">Tour Title</label>
          <input
            type="text"
            name="title"
            id="title"
            value={tour.title}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-stone-700">Description</label>
          <textarea
            name="description"
            id="description"
            rows={3}
            value={tour.description}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            required
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-stone-800 mb-2">Artworks</h2>
          <div className="space-y-4">
            {tour.artworks.map((artwork, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-stone-200 relative">
                <button onClick={() => removeArtwork(index)} className="absolute top-2 right-2 p-1 text-stone-400 hover:text-red-600 transition-colors" aria-label={`Remove artwork at index ${index}`}>
                  <TrashIcon className="w-5 h-5"/>
                </button>
                <div className="mb-2">
                  <label htmlFor={`artwork-title-${index}`} className="block text-xs font-medium text-stone-600">Artwork Title</label>
                  <input
                    type="text"
                    id={`artwork-title-${index}`}
                    value={artwork.title}
                    onChange={(e) => handleArtworkChange(index, 'title', e.target.value)}
                    className="mt-1 block w-full px-2 py-1 bg-white border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label htmlFor={`artwork-story-${index}`} className="block text-xs font-medium text-stone-600">Tour Story</label>
                  <textarea
                    id={`artwork-story-${index}`}
                    rows={2}
                    value={artwork.story}
                    onChange={(e) => handleArtworkChange(index, 'story', e.target.value)}
                    className="mt-1 block w-full px-2 py-1 bg-white border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={addArtwork}
              className="w-full flex items-center justify-center border-2 border-dashed border-stone-300 text-stone-600 font-semibold py-2 px-4 rounded-md hover:bg-stone-100 hover:border-stone-400 transition-colors"
            >
              <PlusIcon className="w-5 h-5 mr-2"/>
              Add Artwork
            </button>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button onClick={onCancel} className="bg-stone-200 text-stone-800 font-bold py-2 px-6 rounded-md hover:bg-stone-300 transition-colors">
            Cancel
          </button>
          <button 
            onClick={() => onSave(tour)} 
            disabled={!isFormValid}
            className="bg-stone-800 text-white font-bold py-2 px-6 rounded-md hover:bg-stone-900 disabled:bg-stone-400 disabled:cursor-not-allowed transition-colors"
          >
            Save Tour
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourEditor;
