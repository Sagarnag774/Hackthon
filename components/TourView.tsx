
import React from 'react';
import { Tour } from '../types';
import { PencilIcon } from './icons/PencilIcon';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

interface TourViewProps {
  tours: Tour[];
  onSelectTour: (tour: Tour) => void;
  isManagerMode: boolean;
  onLogin: () => void;
  onAddNewTour: () => void;
  onEditTour: (tour: Tour) => void;
  onDeleteTour: (tourId: string) => void;
}

const TourView: React.FC<TourViewProps> = ({ tours, onSelectTour, isManagerMode, onLogin, onAddNewTour, onEditTour, onDeleteTour }) => {
  return (
    <div className="p-6 bg-stone-100 h-full overflow-y-auto pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-stone-900">Explore a Tour</h1>
        {!isManagerMode && (
          <button onClick={onLogin} className="text-sm text-stone-500 hover:text-amber-600 transition-colors">
            Manager Login
          </button>
        )}
      </div>

      {isManagerMode && (
        <div className="mb-6">
          <button
            onClick={onAddNewTour}
            className="w-full flex items-center justify-center bg-amber-600 text-white font-bold py-3 px-4 rounded-md hover:bg-amber-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          >
            <PlusIcon className="w-5 h-5 mr-2"/>
            Create New Tour
          </button>
        </div>
      )}

      <div className="space-y-4">
        {tours.map(tour => (
          <div key={tour.id} className="bg-white rounded-lg shadow-md p-5 border border-stone-200 transition-all hover:shadow-lg hover:border-amber-500 relative">
            {isManagerMode && (
              <div className="absolute top-3 right-3 flex space-x-2">
                <button onClick={() => onEditTour(tour)} className="p-1 text-stone-500 hover:text-blue-600 transition-colors" aria-label={`Edit ${tour.title}`}>
                  <PencilIcon className="w-5 h-5"/>
                </button>
                <button onClick={() => onDeleteTour(tour.id)} className="p-1 text-stone-500 hover:text-red-600 transition-colors" aria-label={`Delete ${tour.title}`}>
                  <TrashIcon className="w-5 h-5"/>
                </button>
              </div>
            )}
            <h2 className="text-xl font-bold text-amber-700">{tour.title}</h2>
            <p className="text-stone-600 mt-2">{tour.description}</p>
            <ul className="mt-4 text-sm text-stone-500 list-disc list-inside space-y-1">
                {tour.artworks.map(art => <li key={art.title}>{art.title}</li>)}
            </ul>
            <button
              onClick={() => onSelectTour(tour)}
              className="mt-4 w-full bg-stone-800 text-white font-bold py-2 px-4 rounded-md hover:bg-stone-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              Start Tour
            </button>
          </div>
        ))}
        {tours.length === 0 && (
          <div className="text-center py-10 px-4 bg-white rounded-lg border border-stone-200">
            <h3 className="text-lg font-semibold text-stone-700">No Tours Available</h3>
            <p className="text-stone-500 mt-2">
              {isManagerMode ? "Click 'Create New Tour' to get started." : "Check back later for curated museum tours."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TourView;
