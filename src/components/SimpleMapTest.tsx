"use client"

import React, { useState } from 'react';
import Map from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoibXJwcnVzdCIsImEiOiJjbWMzcGkzaW0wNzh4MmtwbjczZzRkbHBrIn0.VdJXQCJyCnweU6kAhsjRug';

export default function SimpleMapTest() {
  const [mapLoaded, setMapLoaded] = useState(false);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          longitude: -77.35,
          latitude: 25.05,
          zoom: 10
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        onLoad={() => {
          console.log('Simple map loaded!');
          setMapLoaded(true);
        }}
        onError={(error) => {
          console.error('Simple map error:', error);
        }}
      />
      <div style={{ 
        position: 'absolute', 
        top: 10, 
        left: 10, 
        background: 'white', 
        padding: '10px',
        zIndex: 1000
      }}>
        Map Status: {mapLoaded ? 'Loaded' : 'Loading...'}
      </div>
    </div>
  );
} 