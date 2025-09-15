import React from 'react';

// Fake API –
async function fakeFetchHero(_payload: {}): Promise<{ images: string[] }> {
  await new Promise((r) => setTimeout(r, 300));
  return {
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&q=80&w=1600&auto=format&fit=crop',

      'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?ixlib=rb-4.0.3&q=80&w=1600&auto=format&fit=crop',

      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&q=80&w=1600&auto=format&fit=crop',
    ],
  };
}

export default function GalleryHero({ productId }: { productId?: string }) {
  const [images, setImages] = React.useState<string[] | null>(null);
  const [active, setActive] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    fakeFetchHero({})
      .then((data) => {
        if (!isMounted) return;
        if (!data?.images?.length) {
          setError('No images found');
          setImages([]);
        } else {
          setImages(data.images);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setError('Failed to load images');
        setImages([]);
      });
    return () => {
      isMounted = false;
    };
  }, [productId]);

  const prev = () =>
    setActive((i) =>
      images && images.length ? (i - 1 + images.length) % images.length : 0
    );
  const next = () =>
    setActive((i) => (images && images.length ? (i + 1) % images.length : 0));

  // Loading
  if (images === null) {
    return (
      <div className="relative h-full min-h-64 w-full animate-pulse overflow-hidden rounded-2xl bg-gray-100" />
    );
  }

  // Error / Empty
  if (error || images.length === 0) {
    return (
      <div className="relative h-full min-h-64 w-full overflow-hidden rounded-2xl bg-gray-100">
        <div className="flex h-full items-center justify-center text-sm text-gray-500">
          {error || 'No image'}
        </div>
      </div>
    );
  }

  // Normal
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-black/5">
      <img
        src={images[active]}
        alt={`Image ${active + 1}`}
        className="h-full w-full object-cover"
        draggable={false}
      />

      {/* Controls */}
      <button
        aria-label="Previous"
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-2 text-sm shadow hover:bg-white"
      >
        ‹
      </button>
      <button
        aria-label="Next"
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-2 text-sm shadow hover:bg-white"
      >
        ›
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to image ${i + 1}`}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === active
                ? 'w-6 bg-white shadow'
                : 'w-3 bg-white/70 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
