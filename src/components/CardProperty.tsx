/**
 * Propriétés d'une carte.
 */
export interface CardProps {
  id: number;
  title: string;
  type: string;
  size: number; // sqft
  fundingRequired: number; // dollars
  situated: string;
  status?: string;
  tag?: 'New' | 'Almost gone' | 'Coming soon';
  image?: string;
}

const fmtSize = (sqft?: number) =>
  sqft != null ? `${sqft.toLocaleString()} sqft` : null;

const fmtFunding = (usd?: number) =>
  usd != null ? `$${Math.round(usd / 1000)}k` : null;

export function Card(props: CardProps) {
  /**fonction pour le badge en dessous de l'image face au titre */
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
          <img src='/assets/img/star.svg' alt='' className='size-5' />
        )}
      </span>
    );
  }
  return (
    <div className='border rounded-lg border-[var(--color-fraction-light-400)] p-[6px] pb-[12px] bg-[var(--color-fraction-light-100)]'>
      <div className='border rounded-lg border-transparent relative overflow-hidden'>
        <img src={props.image} alt={props.title} />
        <button
          type='button'
          aria-label='Add to favorites'
          className='absolute top-3 right-3 grid place-items-center rounded-md border border-transparent
 bg-[var(--color-fraction-light-100)] p-[6px] shadow-sm'
        >
          <img src='/assets/img/favorite-icon.svg' alt='' className='size-5' />
        </button>
      </div>
      <div className='flex flex-row justify-between items-center mt-[14px]'>
        <div className='flex flex-col'>
          <h3 className='text-2xl text-[var(--color-fraction-violet-500)]'>
            {props.title}
          </h3>
          <p className='text-[var(--color-fraction-light-600)]'>{props.type}</p>
        </div>
        {renderTag(props.tag)}
      </div>
      <div className='flex flex-row justify-between border-b border-[var(--color-fraction-light-600)] mt-[20px]'>
        <p className='text-[var(--color-fraction-light-600)]'>Size</p>
        <p className='text-[var(--color-fraction-light-600)]'>
          {fmtSize(props.size)}
        </p>
      </div>
      <div className='flex flex-row justify-between border-b border-[var(--color-fraction-light-600)] mt-[8px]'>
        <p className='text-[var(--color-fraction-light-600)]'>
          Funding requiered
        </p>
        <p className='text-[var(--color-fraction-light-600)]'>
          {fmtFunding(props.fundingRequired)}
        </p>
      </div>
      <div className='flex flex-row justify-between border-b border-[var(--color-fraction-light-600)] mt-[8px]'>
        <p className='text-[var(--color-fraction-light-600)]'>Situated</p>
        <p className='text-[var(--color-fraction-light-600)]'>
          {props.situated}
        </p>
      </div>
      <p className='mt-[16px] text-[var(--color-fraction-light-600)]'>
        {props.status}
      </p>
    </div>
  );
}
