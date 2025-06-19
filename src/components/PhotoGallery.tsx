import React from 'react';
import Image from 'next/image';

interface Photo {
  src: string;
  alt: string;
  title: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
  className?: string;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, className = "" }) => {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 gap-3 ${className}`}>
      {photos.map((photo, index) => (
        <div key={index} className={`aspect-square bg-gray-200 rounded-xl overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300 ${photos.length === 5 && index === 4 ? 'md:col-span-3 md:mx-auto md:max-w-xs' : ''}`}>
          {photo.src ? (
            <Image
              src={photo.src}
              alt={photo.alt}
              width={200}
              height={200}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 text-xs text-center p-2">
              <div className="w-8 h-8 mb-2 opacity-50">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-medium">{photo.title}</span>
              <span className="text-xs opacity-75 mt-1">Photo coming soon</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PhotoGallery; 