// src/components/MapSection.tsx
import MapFrame from './MapFrame';

type MapSectionProps = {
  lat: number; // Latitude of the map center
  lng: number; // Longitude of the map center
  zoom?: number; // Initial zoom level (optional)
  aboutTitle?: string; // Title of the "About" section (optional)
  aboutText?: string[]; // Text content of the "About" section (optional)
  mapStyleUrl?: string; // Custom Mapbox style URL (optional)
};

export default function MapSection({
  lat,
  lng,
  zoom = 12,
  aboutTitle = 'About',
  aboutText = [
    'This is an example section (About) on the left, with the map on the right.',
  ],
  mapStyleUrl,
}: MapSectionProps) {
  return (
    <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch text-white">
      {/* Left block: About section */}
      <div className="flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm min-h-[400px]">
        {/* Header with a purple background and title */}
        <div className="mx-2 mt-2 rounded-md bg-fraction-violet-500 px-4 py-2">
          <h3 className="text-white text-sm font-medium">{aboutTitle}</h3>
        </div>

        {/* Text content of the About section */}
        <div className="flex-1 p-6 space-y-2 text-sm text-gray-700">
          {aboutText.map((t, i) => (
            <p key={i}>{t}</p>
          ))}
        </div>
      </div>

      {/* Right block: Mapbox map display */}
      <MapFrame
        lat={lat}
        lng={lng}
        zoom={zoom}
        mapStyleUrl={mapStyleUrl}
        className="min-h-[400px]"
      />
    </section>
  );
}
