
import React from 'react';
import { Tour } from '../types';

interface TourViewProps {
  tours: Tour[];
  onSelectTour: (tour: Tour) => void;
}

const TourView: React.FC<TourViewProps> = ({ tours, onSelectTour }) => {
  return (
    <div className="p-6 bg-stone-100 h-full overflow-y-auto">
      <h1 className="text-3xl font-bold text-stone-900 mb-6">Explore a Tour</h1>
      <div className="space-y-4">
        {tours.map(tour => (
          <div key={tour.id} className="bg-white rounded-lg shadow-md p-5 border border-stone-200 transition-all hover:shadow-lg hover:border-amber-500">
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
      </div>
    </div>
  );
};

export default TourView;
