import React, { useState, useEffect } from 'react';
import type { Equipment } from '../types';
import { getEquipmentDescription, generateEquipmentImage } from '../services/geminiService';
import { LoaderIcon, LabIcon } from './icons';

interface ImageViewerProps {
  equipment: Equipment | null;
}

const DescriptionSkeletonLoader: React.FC = () => (
    <div className="space-y-3 animate-pulse">
        <div className="h-4 bg-gray-600 rounded w-3/4"></div>
        <div className="h-4 bg-gray-600 rounded w-full"></div>
        <div className="h-4 bg-gray-600 rounded w-5/6"></div>
    </div>
);

const ImageSkeletonLoader: React.FC = () => (
    <div className="absolute inset-0 w-full h-full bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-center">
            <LoaderIcon />
            <p className="text-gray-400 mt-2">Generating 3D Model...</p>
        </div>
    </div>
);

const ImageViewer: React.FC<ImageViewerProps> = ({ equipment }) => {
  const [description, setDescription] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isDescLoading, setIsDescLoading] = useState<boolean>(false);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);
  const [descError, setDescError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  useEffect(() => {
    if (!equipment) {
      setDescription('');
      setImageUrl(null);
      setDescError(null);
      setImageError(null);
      return;
    }

    const fetchDescription = async () => {
      setIsDescLoading(true);
      setDescError(null);
      try {
        const desc = await getEquipmentDescription(equipment.name);
        setDescription(desc);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        setDescError(`Failed to fetch description: ${errorMessage}`);
        console.error(e);
      } finally {
        setIsDescLoading(false);
      }
    };

    const fetchImage = async () => {
      setIsImageLoading(true);
      setImageError(null);
      try {
        const imgUrl = await generateEquipmentImage(equipment.name);
        setImageUrl(imgUrl);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        setImageError(`Failed to generate image: ${errorMessage}`);
        console.error(e);
      } finally {
        setIsImageLoading(false);
      }
    };

    fetchDescription();
    fetchImage();
  }, [equipment]);

  if (!equipment) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 bg-gray-800 rounded-lg shadow-lg p-8">
        <LabIcon />
        <h3 className="mt-4 text-2xl font-bold">Welcome to the Lab</h3>
        <p className="mt-2 max-w-sm">Select a piece of equipment from the list on the left to see its generated 3D model and learn more about it.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg h-full flex flex-col p-6 space-y-6">
      <h2 className="text-3xl font-bold text-center text-teal-300 truncate">{equipment.name}</h2>
      <div className="flex-shrink-0 w-full h-80 bg-gray-900 rounded-lg overflow-hidden shadow-inner relative">
        {isImageLoading && <ImageSkeletonLoader />}
        {imageError && (
            <div className="absolute inset-0 w-full h-full flex items-center justify-center text-red-400 text-center p-4 bg-gray-900 rounded-lg">
                {imageError}
            </div>
        )}
        {!isImageLoading && !imageError && imageUrl && (
          <img
            src={imageUrl}
            alt={`Generated 3D model of ${equipment.name}`}
            className="w-full h-full object-contain"
          />
        )}
      </div>
      <div className="flex-grow bg-gray-900/50 p-4 rounded-lg min-h-[120px]">
        <h3 className="text-lg font-semibold text-gray-200 mb-2">Description</h3>
        {isDescLoading && <DescriptionSkeletonLoader />}
        {descError && <p className="text-red-400 text-sm">{descError}</p>}
        {!isDescLoading && !descError && (
          <p className="text-gray-300 leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  );
};

export default ImageViewer;
