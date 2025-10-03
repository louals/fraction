type Step = { number: 1 | 2 | 3; label: string };

export type StepCirclesProps = {
  current: 1 | 2 | 3;
  steps?: Step[];
};

/**
 * StepCircles
 * - Matches sample style (outlined circles, active/inactive colors, RTL-aware)
 * - Step data (labels and numbers) are passed via props
 * - Responsive: vertical on mobile, horizontal from sm and up
 */
export default function StepCircles({
  current,
  steps = [
    { number: 1, label: 'Infos & Photos' },
    { number: 2, label: 'Plans' },
    { number: 3, label: 'Documents légaux' },
  ],
}: StepCirclesProps) {
  return (
    <ol
      className="items-center w-full space-y-4 sm:flex sm:space-x-8 sm:space-y-0 rtl:space-x-reverse"
      aria-label="Progression"
    >
      {steps.map((s) => {
        const active = s.number <= current;
        return (
          <li
            key={s.number}
            className={[
              'flex items-center space-x-2.5 rtl:space-x-reverse',
              active
                ? 'text-[var(--color-fraction-violet-600)] dark:text-[var(--color-fraction-violet-400)]'
                : 'text-slate-500 dark:text-slate-400',
            ].join(' ')}
          >
            <span
              className={[
                'flex items-center justify-center w-8 h-8 rounded-full shrink-0 border',
                active
                  ? 'border-[var(--color-fraction-violet-600)] dark:border-[var(--color-fraction-violet-400)]'
                  : 'border-slate-500 dark:border-slate-400',
              ].join(' ')}
              aria-current={s.number === current ? 'step' : undefined}
            >
              {s.number}
            </span>

            <span>
              <h3 className="font-medium leading-tight">{s.label}</h3>
              {/* Optional subtitle/description: uncomment to use */}
              {/* <p className="text-sm opacity-80">Details for this step</p> */}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
