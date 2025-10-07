import * as React from 'react';

type Step = { number: 1 | 2 | 3; label: string };
export type StepCirclesProps = {
  current: 1 | 2 | 3;
  steps?: Step[];
  className?: string;
};

export default function StepCircles({
  current,
  className,
  steps = [
    { number: 1, label: 'Infos & Photos' },
    { number: 2, label: 'Plans' },
    { number: 3, label: 'Documents légaux' },
  ],
}: StepCirclesProps) {
  return (
    <div className={['w-full', className ?? ''].join(' ')}>
      <ol className='flex items-center gap-3'>
        {steps.map((s, idx) => {
          const reached = s.number <= current;
          const isCurrent = s.number === current;

          return (
            <React.Fragment key={s.number}>
              <li className='relative flex items-center gap-3'>
                <span
                  className={[
                    'grid size-9 place-items-center rounded-full border text-sm font-semibold transition',
                    reached
                      ? 'bg-[var(--color-fraction-violet-500)] text-white border-transparent shadow-[0_4px_14px_rgba(123,97,255,.35)]'
                      : 'bg-white text-zinc-600 border-zinc-300',
                    isCurrent
                      ? 'ring-4 ring-[var(--color-fraction-violet-500)]/15'
                      : '',
                  ].join(' ')}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {s.number}
                </span>
                <span
                  className={[
                    'hidden sm:block text-sm',
                    reached ? 'text-zinc-900 font-medium' : 'text-zinc-500',
                  ].join(' ')}
                >
                  {s.label}
                </span>
              </li>

              {/* connecteur */}
              {idx < steps.length - 1 && (
                <div
                  aria-hidden
                  className={[
                    'h-[2px] flex-1 rounded-full transition-colors',
                    s.number < current
                      ? 'bg-[var(--color-fraction-violet-500)]'
                      : 'bg-zinc-200',
                  ].join(' ')}
                />
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </div>
  );
}
