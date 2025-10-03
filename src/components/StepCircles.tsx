type Step = { number: 1 | 2 | 3; label: string };
export type StepCirclesProps = {
  current: 1 | 2 | 3;
  steps?: Step[];
};

export function StepCircles({
  current,
  steps = [
    { number: 1, label: 'Infos & Photos' },
    { number: 2, label: 'Plans' },
    { number: 3, label: 'Documents légaux' },
  ],
}: StepCirclesProps) {
  return (
    <ol className='flex items-center gap-6' aria-label='Progression'>
      {steps.map((s) => {
        const active = s.number <= current;
        return (
          <li key={s.number} className='flex items-center gap-3'>
            <span
              className={[
                'grid size-8 place-items-center rounded-full border-2 text-sm font-semibold',
                active
                  ? 'bg-[var(--color-fraction-violet-500)] text-white border-transparent'
                  : 'bg-white text-[var(--color-fraction-violet-500)] border-[var(--color-fraction-violet-500)]',
              ].join(' ')}
              aria-current={s.number === current ? 'step' : undefined}
            >
              {s.number}
            </span>
            <span className='text-sm'>{s.label}</span>
          </li>
        );
      })}
    </ol>
  );
}

export default StepCircles;
