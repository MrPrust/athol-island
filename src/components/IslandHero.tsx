"use client"

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Map, { Source } from 'react-map-gl/mapbox';
import Image from 'next/image';
import 'mapbox-gl/dist/mapbox-gl.css';
import { cn } from '@/lib/utils';


const MAPBOX_TOKEN = 'pk.eyJ1IjoibXJwcnVzdCIsImEiOiJjbWMzcGkzaW0wNzh4MmtwbjczZzRkbHBrIn0.VdJXQCJyCnweU6kAhsjRug';

// Photo data for the gallery
const VENUE_PHOTOS = [
  {
    src: '/images/restaurant-bar.jpeg',
    alt: 'Restaurant and bar area with ocean views',
    title: 'Restaurant & Bar'
  },
  {
    src: '/images/venue.jpeg',
    alt: 'Main venue structure and outdoor areas',
    title: 'Venue Structure'
  },
  {
    src: '/images/ocean-view-deck.jpeg',
    alt: 'Ocean view deck with stunning water views',
    title: 'Ocean View Deck'
  },
  {
    src: '/images/beach-bungalows.jpeg',
    alt: 'Beach bungalows and accommodation areas',
    title: 'Beach Bungalows'
  },
  {
    src: '/images/dock.jpeg',
    alt: 'Private dock and marina facilities',
    title: 'Private Dock'
  }
];

// Animation sequence coordinates with 3D camera angles
const ANIMATION_STEPS = [
  {
    // Nassau area - Starting view (more zoomed out)
    longitude: -77.35,
    latitude: 25.05,
    zoom: 11,
    pitch: 30,
    bearing: 0,
    duration: 2000
  },
  {
    // Athol Island - Perfect context view showing full island
    longitude: -77.267794,
    latitude: 25.076308,
    zoom: 14.5,
    pitch: 50,
    bearing: 20,
    duration: 4500
  },
  {
    // Close-up venue view - For form section
    longitude: -77.267794,
    latitude: 25.076308,
    zoom: 16.5,
    pitch: 45,
    bearing: 0,
    duration: 3000
  }
];

interface IslandHeroProps {
  className?: string;
}

const IslandHero: React.FC<IslandHeroProps> = ({ className = "" }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentView, setCurrentView] = useState<'nassau' | 'island' | 'form'>('nassau');
  
  // Scroll handling state
  const [isAnimating, setIsAnimating] = useState(false);
  const lastScrollTime = useRef(0);

  const zoomToIsland = useCallback(() => {
    if (!mapLoaded || !mapRef.current || currentView === 'island' || isAnimating) return;

    setIsAnimating(true);
    setCurrentView('island');
    
    const islandStep = ANIMATION_STEPS[1]; // Athol Island step
    
    mapRef.current.flyTo({
      center: [islandStep.longitude, islandStep.latitude],
      zoom: islandStep.zoom,
      pitch: islandStep.pitch,
      bearing: islandStep.bearing,
      duration: islandStep.duration,
      essential: true
    });

    // Reset animation state after zoom
    setTimeout(() => {
      setIsAnimating(false);
    }, islandStep.duration + 1000);
  }, [mapLoaded, currentView, isAnimating]);

  const zoomToForm = useCallback(() => {
    if (!mapLoaded || !mapRef.current || currentView !== 'island' || isAnimating) return;

    setIsAnimating(true);
    setCurrentView('form');
    
    const formStep = ANIMATION_STEPS[2]; // Close-up view
    
    mapRef.current.flyTo({
      center: [formStep.longitude, formStep.latitude],
      zoom: formStep.zoom,
      pitch: formStep.pitch,
      bearing: formStep.bearing,
      duration: formStep.duration,
      essential: true
    });

    // Reset animation state after zoom
    setTimeout(() => {
      setIsAnimating(false);
    }, formStep.duration);
  }, [mapLoaded, currentView, isAnimating]);

  const zoomToNassau = useCallback(() => {
    if (!mapLoaded || !mapRef.current || currentView === 'nassau' || isAnimating) return;

    setIsAnimating(true);
    setCurrentView('nassau');
    
    const nassauStep = ANIMATION_STEPS[0]; // Nassau step
    
    mapRef.current.flyTo({
      center: [nassauStep.longitude, nassauStep.latitude],
      zoom: nassauStep.zoom,
      pitch: nassauStep.pitch,
      bearing: nassauStep.bearing,
      duration: nassauStep.duration,
      essential: true
    });

    // Reset animation state after zoom
    setTimeout(() => {
      setIsAnimating(false);
    }, nassauStep.duration);
  }, [mapLoaded, currentView, isAnimating]);

  useEffect(() => {
    if (!mapLoaded) return;

    const handleScroll = (e: Event) => {
      e.preventDefault();
      if (isAnimating) return;
      
      if (currentView === 'nassau') {
        zoomToIsland();
      } else if (currentView === 'island') {
        zoomToForm();
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isAnimating) return;

      const now = Date.now();
      // Throttle scroll events to prevent rapid firing
      if (now - lastScrollTime.current < 300) return;
      
      lastScrollTime.current = now;

      if (e.deltaY > 0) { // Scrolling down
        if (currentView === 'nassau') {
          zoomToIsland();
        } else if (currentView === 'island') {
          zoomToForm();
        }
      } else if (e.deltaY < 0) { // Scrolling up
        if (currentView === 'form') {
          zoomToIsland();
        } else if (currentView === 'island') {
          zoomToNassau();
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimating) return;
      
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        if (currentView === 'nassau') {
          zoomToIsland();
        } else if (currentView === 'island') {
          zoomToForm();
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        if (currentView === 'form') {
          zoomToIsland();
        } else if (currentView === 'island') {
          zoomToNassau();
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (isAnimating) return;
      
      const touch = e.touches[0];
      const startY = touch.clientY;
      
      const handleTouchMove = (moveEvent: TouchEvent) => {
        if (isAnimating) return;
        
        const moveTouch = moveEvent.touches[0];
        const deltaY = moveTouch.clientY - startY;
        
        if (deltaY < -50) { // Swipe up (scroll down) - increased threshold
          moveEvent.preventDefault();
          if (currentView === 'nassau') {
            zoomToIsland();
          } else if (currentView === 'island') {
            zoomToForm();
          }
          document.removeEventListener('touchmove', handleTouchMove);
        } else if (deltaY > 50) { // Swipe down (scroll up) - increased threshold
          moveEvent.preventDefault();
          if (currentView === 'form') {
            zoomToIsland();
          } else if (currentView === 'island') {
            zoomToNassau();
          }
          document.removeEventListener('touchmove', handleTouchMove);
        }
      };

      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      
      setTimeout(() => {
        document.removeEventListener('touchmove', handleTouchMove);
      }, 1000);
    };

    // Add event listeners
    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('scroll', handleScroll, { passive: false });
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('touchstart', handleTouchStart, { passive: false });

    return () => {
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('scroll', handleScroll);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('touchstart', handleTouchStart);
    };
     }, [mapLoaded, currentView, isAnimating, zoomToIsland, zoomToForm, zoomToNassau]);

  return (
    <div className={cn("relative w-full", className)} style={{ height: '200vh' }}>
      {/* Map Container */}
      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
                initialViewState={{
          longitude: -77.35,
          latitude: 25.05,
          zoom: 11,
          pitch: 30,
          bearing: 0
        }}
        style={{ 
          width: '100vw', 
          height: '100vh', 
          position: 'absolute', 
          top: 0, 
          left: 0,
          filter: 'contrast(1.02) saturate(1.1) brightness(1.01)'
        }}
          mapStyle="mapbox://styles/mapbox/satellite-v9"
          onLoad={() => {
            setMapLoaded(true);
          }}
          onError={(error) => {
            console.error('Map error:', error);
            console.error('Error details:', error.error);
          }}
          interactive={false}
          attributionControl={false}
          terrain={{ source: 'mapbox-dem', exaggeration: 2.0 }}
          fog={{
            range: [-1, 2],
            color: '#74b9ff',
            'horizon-blend': 0.3
          }}
          projection="globe"
      >
        <Source
          id="mapbox-dem"
          type="raster-dem"
          url="mapbox://mapbox.mapbox-terrain-dem-v1"
          tileSize={512}
          maxzoom={14}
        />
      </Map>

      {/* Nassau View Overlay - Shows when zoomed out */}
      {currentView === 'nassau' && (
        <div className="absolute top-4 left-4 right-4 md:top-8 md:left-8 md:right-auto pointer-events-none" style={{ zIndex: 10 }}>
          <div className="max-w-xl bg-blue-500/20 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-white/30">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-3 font-display text-amber-100">
              Minutes from Nassau
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-yellow-100 leading-relaxed font-sans">
              An exclusive island venue, crafted for unforgettable experiences
            </p>
          </div>
        </div>
      )}

      {/* Island View Overlay - Shows when zoomed in */}
      {currentView === 'island' && (
        <div 
          className="fixed bottom-4 left-4 right-4 md:bottom-8 md:left-auto md:right-8 md:max-w-md pointer-events-none opacity-100 translate-y-0"
          style={{ zIndex: 9999 }}
        >
          <div className="bg-blue-500/60 backdrop-blur-xl rounded-2xl p-4 md:p-6 border-2 border-white/70 shadow-2xl">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 text-orange-200 drop-shadow-lg font-display">
              Miles from Ordinary
            </h2>
            <p className="text-sm md:text-base text-yellow-100 leading-relaxed drop-shadow font-sans">
              Strategic location perfect for events, cruise excursions and hotel partnerships. Opening Q4 2025.
            </p>
          </div>
        </div>
      )}



      {/* Navigation Buttons */}
      {mapLoaded && (
        <>
          {/* Scroll Down Button - Show when in Nassau view */}
          {currentView === 'nassau' && (
            <div 
              className="fixed bottom-16 left-1/2 transform -translate-x-1/2 pointer-events-auto" 
              style={{ zIndex: 9999 }}
            >
              <div className="flex flex-col items-center">
                <button
                  onClick={zoomToIsland}
                  className="bg-transparent p-6 text-amber-100 hover:text-white transition-all duration-300"
                >
                  <svg className="w-8 h-8 animate-bounce drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>
                <p className="text-center text-amber-100 text-sm mt-3 font-medium drop-shadow-lg font-sans">
                  Scroll to explore
                </p>
              </div>
            </div>
          )}

          {/* Island View Navigation */}
          {currentView === 'island' && (
            <div 
              className="fixed bottom-16 left-1/2 transform -translate-x-1/2 pointer-events-auto" 
              style={{ zIndex: 9999 }}
            >
              <div className="flex flex-col items-center">
                <button
                  onClick={zoomToForm}
                  className="bg-transparent p-6 text-amber-100 hover:text-white transition-all duration-300"
                >
                  <svg className="w-8 h-8 animate-bounce drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>
                <p className="text-center text-amber-100 text-sm mt-3 font-medium drop-shadow-lg font-sans">
                  Get involved
                </p>
              </div>
            </div>
          )}


        </>
      )}

      {/* Contact Section - Shows when in form view */}
      {currentView === 'form' && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          style={{ zIndex: 20 }}
          onKeyDown={(e) => {
            // Allow keyboard navigation back to island view
            if ((e.key === 'ArrowUp' || e.key === 'PageUp') && !isAnimating) {
              e.preventDefault();
              e.stopPropagation();
              zoomToIsland();
            }
          }}
          tabIndex={0}
        >
          <div className="rounded-3xl p-4 md:p-6 max-w-lg md:max-w-xl w-full max-h-[85vh] shadow-2xl modal-content"
            style={{ backgroundColor: '#F8F1E5E6', backdropFilter: 'blur(16px)' }}
            onWheel={(e) => {
              // Handle scroll events directly on the modal content
              if (e.deltaY < 0 && !isAnimating) {
                // Check if we're at the top of the scrollable content
                const target = e.currentTarget as HTMLElement;
                if (target.scrollTop <= 10) {
                  // At or near the top - navigate back to island view
                  e.preventDefault();
                  e.stopPropagation();
                  const now = Date.now();
                  if (now - lastScrollTime.current >= 300) {
                    lastScrollTime.current = now;
                    zoomToIsland();
                  }
                }
                // If not at top, allow normal scroll up within the modal
              }
            }}
          >
            {/* Header */}
            <div className="text-center mb-4">
              <h2 className="text-xl md:text-2xl font-display font-bold mb-2" style={{ color: '#2E3A59' }}>
                Get Involved
              </h2>
              <p className="text-sm md:text-base font-sans" style={{ color: '#2E3A59', opacity: 0.8 }}>
                Join us in creating something extraordinary on Athol Island
              </p>
            </div>

            {/* Photo Gallery with Logo - Uniform sized images */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {/* Logo in first slot */}
              <div className="aspect-square overflow-hidden rounded-lg flex items-center justify-center" style={{ backgroundColor: '#DAA520' }}>
                <Image
                  src="/images/thejunkanooclub.png"
                  alt="The Junkanoo Club"
                  width={100}
                  height={100}
                  className="w-3/4 h-auto object-contain"
                />
              </div>
              {/* Venue photos in remaining slots */}
              {VENUE_PHOTOS.map((photo, index) => (
                <div key={index} className="aspect-square overflow-hidden rounded-lg">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>

            {/* Contact Button */}
            <div className="text-center mt-6 mb-2">
              <a
                href="mailto:contact@example.com?subject=Partnership Inquiry - Athol Island Venue"
                className="inline-block py-3 px-6 rounded-xl font-semibold transition-colors duration-300 text-base"
                style={{ 
                  backgroundColor: '#DAA520', 
                  color: '#2E3A59'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#C8941C';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#DAA520';
                }}
              >
                Join In Before It Jam Up
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <div className="text-white text-xl">Loading paradise...</div>
        </div>
      )}
    </div>
  );
};

export default IslandHero; 