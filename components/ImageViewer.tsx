
import React, { useState, useEffect } from 'react';
import type { Equipment } from '../types';
import { getEquipmentDescription } from '../services/geminiService';
import { LoaderIcon, LabIcon } from './icons';

interface ImageViewerProps {
  equipment: Equipment | null;
}

const SkeletonLoader: React.FC = () => (
    <div className="space-y-3 animate-pulse">
        <div className="h-4 bg-gray-600 rounded w-3/4"></div>
        <div className="h-4 bg-gray-600 rounded w-full"></div>
        <div className="h-4 bg-gray-600 rounded w-5/6"></div>
    </div>
);

const ImageViewer: React.FC<ImageViewerProps> = ({ equipment }) => {
  const [description, setDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!equipment) {
      setDescription('');
      setError(null);
      return;
    }

    const fetchDescription = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const desc = await getEquipmentDescription(equipment.name);
        setDescription(desc);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        setError(`Failed to fetch description: ${errorMessage}`);
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDescription();
  }, [equipment]);

  if (!equipment) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 bg-gray-800 rounded-lg shadow-lg p-8">
        <LabIcon />
        <h3 className="mt-4 text-2xl font-bold">Welcome to the Lab</h3>
        <p className="mt-2 max-w-sm">Select a piece of equipment from the list on the left to see its image and learn more about it.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg h-full flex flex-col p-6 space-y-6">
      <h2 className="text-3xl font-bold text-center text-teal-300 truncate">{equipment.name}</h2>
      <div className="flex-shrink-0 w-full h-80 bg-gray-900 rounded-lg overflow-hidden shadow-inner">
        <img
          src={equipment.imageUrl}
          alt={`Image of ${equipment.name}`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-grow bg-gray-900/50 p-4 rounded-lg min-h-[120px]">
        <h3 className="text-lg font-semibold text-gray-200 mb-2">Description</h3>
        {isLoading && <SkeletonLoader />}
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {!isLoading && !error && (
          <p className="text-gray-300 leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  );
};

export default ImageViewer;
