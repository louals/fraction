import { useState } from 'react';

/**
 * Card properties definition.
 */
export interface CardProps {
  id: number;
  title: string;
  type: string;
  size: number; // in square feet
  fundingRequired: number; // in dollars
  situated: string;
  status?: string;
  tag?: 'New' | 'Almost gone' | 'Coming soon';
  image?: string;
}

// Format size (sqft)
const fmtSize = (sqft?: number) =>
  sqft != null ? `${sqft.toLocaleString()} sqft` : null;

// Format funding (e.g. 12000 → $12k)
const fmtFunding = (usd?: number) =>
  usd != null ? `$${Math.round(usd / 1000)}k` : null;

export function Card(props: CardProps) {
  /** Renders a tag badge below the image */
  function renderTag(tag?: CardProps['tag']) {
    if (!tag) return null;
    let classes =
      'inline-flex items-center gap-1 border border-transparent text-white shadow-sm h-max rounded-xl px-2 whitespace-nowrap';
    switch (tag) {
      case 'New':
        classes += ' bg-[var(--color-fraction-pink-500)]';
        break;
      case 'Almost gone':
        classes += ' bg-[var(--color-fraction-light-400)]';
        break;
      case 'Coming soon':
        classes += ' bg-[var(--color-fraction-lilac-500)]';
        break;
    }
    return (
      <span className={classes}>
        {tag}
        {tag === 'New' && (
          <img src="/assets/img/star.svg" alt="" className="size-5" />
        )}
      </span>
    );
  }

  // Local state for the favorite (filled/unfilled)
  const [favorited, setFavorited] = useState(false);

  // Toggle favorite on click
  const toggleFavorite = () => setFavorited((v) => !v);

  return (
    <div
      className="
        group
        border-2 rounded-lg p-[6px] pb-[12px]
        border-[var(--color-fraction-light-400)]
        bg-[var(--color-fraction-light-100)]
        transition-all duration-300 ease-out transform-gpu
        hover:-translate-y-0.5
        hover:bg-white
        hover:border-[var(--color-fraction-violet-500)]
        hover:shadow-[0_12px_28px_rgba(26,22,63,0.18)]
        motion-reduce:transition-none
      "
    >
      <div className="border rounded-lg border-transparent relative overflow-hidden">
        <img
          src={props.image}
          alt={props.title}
          className="
            w-full h-auto
            transition-transform duration-500 ease-out
            group-hover:scale-[1.02]
            will-change-transform
          "
        />

        {/* Favorite button with toggle */}
        <button
          type="button"
          aria-label="Add to favorites"
          aria-pressed={favorited}
          onClick={toggleFavorite}
          title={favorited ? 'Remove from favorites' : 'Add to favorites'}
          className={`
            absolute top-3 right-3 grid place-items-center rounded-md border border-transparent
            p-[6px] shadow-sm transition-all duration-300 cursor-pointer focus:outline-none
            ${
              favorited
                ? 'bg-[var(--color-fraction-violet-500)] shadow-md'
                : 'bg-[var(--color-fraction-light-100)] hover:bg-white/90 hover:shadow-md'
            }
          `}
        >
          <img
            src="/assets/img/favorite-icon.svg"
            alt=""
            className={`size-5 transition-all duration-300 ${
              favorited ? 'brightness-0 invert' : ''
            }`}
          />
        </button>
      </div>

      {/* Title + tag */}
      <div className="flex flex-row justify-between items-center mt-[14px]">
        <div className="flex flex-col">
          <h3 className="text-2xl text-[var(--color-fraction-violet-500)]">
            {props.title}
          </h3>
          <p className="text-[var(--color-fraction-light-600)]">{props.type}</p>
        </div>
        {renderTag(props.tag)}
      </div>

      {/* Property details */}
      <div className="flex flex-row justify-between border-b border-[var(--color-fraction-light-600)] mt-[20px]">
        <p className="text-[var(--color-fraction-light-600)]">Size</p>
        <p className="text-[var(--color-fraction-light-600)]">
          {fmtSize(props.size)}
        </p>
      </div>

      <div className="flex flex-row justify-between border-b border-[var(--color-fraction-light-600)] mt-[8px]">
        <p className="text-[var(--color-fraction-light-600)]">
          Funding required
        </p>
        <p className="text-[var(--color-fraction-light-600)]">
          {fmtFunding(props.fundingRequired)}
        </p>
      </div>

      <div className="flex flex-row justify-between border-b border-[var(--color-fraction-light-600)] mt-[8px]">
        <p className="text-[var(--color-fraction-light-600)]">Situated</p>
        <p className="text-[var(--color-fraction-light-600)]">
          {props.situated}
        </p>
      </div>

      <p className="mt-[16px] text-[var(--color-fraction-light-600)]">
        {props.status}
      </p>
    </div>
  );
}
