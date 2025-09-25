// src/components/MapFrame.tsx
// @ts-ignore → TypeScript does not yet have proper type definitions for react-map-gl/mapbox

import Map, { Marker, NavigationControl } from 'react-map-gl/mapbox';
import { MapPin } from 'lucide-react';
type MapFrameProps = {
  lat: number; // Latitude of the map center
  lng: number; // Longitude of the map center
  zoom?: number; // Initial zoom level (optional)
  className?: string; // Additional CSS classes (optional)
  mapStyleUrl?: string; // Mapbox style URL (optional)
};

export default function MapFrame({
  lat,
  lng,
  zoom = 12,
  className = '',
  mapStyleUrl = 'mapbox://styles/mapbox/streets-v12',
}: MapFrameProps) {
  // Retrieve the Mapbox token from environment variables (.env.local)
  const token = import.meta.env.VITE_MAPBOX_API_KEY as string;

  // Debugging: check if the token is correctly loaded
  console.log('Mapbox token:', token);

  return (
    <div
      className={`rounded-xl border border-fraction-gray-280 bg-white shadow-sm overflow-hidden ${className}`}
      style={{ height: '400px', width: '100%' }} // Fixed height to prevent rendering issues
    >
      <Map
        mapboxAccessToken={token} // Mapbox API key
        initialViewState={{ latitude: lat, longitude: lng, zoom }} // Initial map coordinates
        mapStyle={mapStyleUrl} // Mapbox style (default: streets-v12)
        style={{ width: '100%', height: '100%' }} // Map fills the container
      >
        {/* Navigation controls (zoom, rotation) positioned at the top right */}
        <NavigationControl position="top-right" />

        {/* Add a marker at the given coordinates */}
        <Marker latitude={lat} longitude={lng} anchor="bottom">
          <MapPin size={36} color="#7c3aed" strokeWidth={2.5} />
        </Marker>
      </Map>
    </div>
  );
}
