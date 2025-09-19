import { ChevronDown } from 'lucide-react';

type Item = { label: string; value: string };

// Component for rendering a collapsible strategy section with headings and items
export default function StrategySection({
  headingsLabel,
  items,
}: {
  headingsLabel: string;
  items: Item[];
}) {
  return (
    <div className="space-y-4">
      {/* Section heading */}
      <h3 className="text-[20px] font-semibold text-fraction-violet-600">
        {headingsLabel}
      </h3>

      {/* List of expandable items */}
      <div className="divide-y divide-gray-100  bg-white">
        {items.map((it, idx) => (
          <details key={idx} className="group open:bg-gray-50">
            {/* Summary row with label, value and chevron icon */}
            <summary className="flex cursor-pointer items-center justify-between gap-6  py-4 list-none [&::-webkit-details-marker]:hidden">
              <span className="text-[14px] text-gray-700">
                <span className="font-medium">{it.label}:</span>{' '}
                <span className="text-gray-500">{it.value}</span>
              </span>

              {/* Chevron icon replaces the default ▾ and rotates when open */}
              <span
                className="shrink-0 transition-transform duration-200 group-open:rotate-180"
                aria-hidden
              >
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </span>
            </summary>

            {/* Content visible only when the details element is open */}
            <div className="hidden px-5 pb-4 text-sm text-gray-600 group-open:block">
              <p className="leading-6 p-2">
                Sample information for{' '}
                <span className="font-medium">{it.label}</span> — Lorem ipsum
                dolor sit amet consectetur adipisicing elit. Commodi dolor
                provident laborum est officia molestias! Possimus veritatis odio
                molestias perspiciatis nesciunt optio.
              </p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
