import * as React from 'react';
import type { ProvinceCA } from '../types/realestate';

type Props = {
  value: string;
  onAddress: (v: {
    addressLine1: string;
    city: string;
    province: ProvinceCA | '';
    postalCode: string;
  }) => void;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
};

type MapboxFeature = {
  id: string;
  place_type: string[];
  text: string;
  address?: string;
  place_name: string;
  context?: Array<{
    id: string;
    text: string;
    short_code?: string;
  }>;
};
type MapboxResponse = { features: MapboxFeature[] };

function toProvinceCA(codeOrName?: string): ProvinceCA | '' {
  if (!codeOrName) return '';
  const c = codeOrName.toLowerCase();
  if (c.startsWith('ca-') && c.length === 5)
    return c.slice(3).toUpperCase() as ProvinceCA;
  const byName: Record<string, ProvinceCA> = {
    alberta: 'AB',
    'colombie-britannique': 'BC',
    manitoba: 'MB',
    'nouveau-brunswick': 'NB',
    'terre-neuve-et-labrador': 'NL',
    'nouvelle-écosse': 'NS',
    'territoires du nord-ouest': 'NT',
    nunavut: 'NU',
    ontario: 'ON',
    'île-du-prince-édouard': 'PE',
    québec: 'QC',
    saskatchewan: 'SK',
    yukon: 'YT',
  };
  return byName[c] ?? '';
}

function sanitizePostal(pc: string): string {
  const raw = pc.replace(/\s+/g, '').toUpperCase();
  return raw.length === 6 ? `${raw.slice(0, 3)} ${raw.slice(3)}` : raw;
}

const MAPBOX_TOKEN: string | undefined =
  (import.meta.env as any).VITE_MAPBOX_TOKEN ??
  (import.meta.env as any).VITE_MAPBOX_API_KEY;

export default function AddressAutocomplete({
  value,
  onAddress,
  onChange,
  placeholder,
  className,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState<
    Array<{
      id: string;
      label: string;
      addressLine1: string;
      city: string;
      province: ProvinceCA | '';
      postalCode: string;
    }>
  >([]);
  const [activeIdx, setActiveIdx] = React.useState<number>(-1);
  const wrapRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  React.useEffect(() => {
    if (!MAPBOX_TOKEN) {
      setItems([]);
      setOpen(false);
      return;
    }

    if (!value || value.trim().length < 3) {
      setItems([]);
      setOpen(false);
      return;
    }

    const t = setTimeout(async () => {
      try {
        const q = encodeURIComponent(value.trim());
        const url =
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${q}.json` +
          `?access_token=${MAPBOX_TOKEN}&autocomplete=true&types=address&country=ca&language=fr&limit=6`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Mapbox ${res.status}`);
        const data = (await res.json()) as MapboxResponse;

        const suggestions = (data.features ?? [])
          .filter((f) => f.place_type?.includes('address'))
          .map((f) => {
            const city =
              f.context?.find((c) => c.id.startsWith('place.'))?.text ??
              f.context?.find((c) => c.id.startsWith('locality.'))?.text ??
              f.context?.find((c) => c.id.startsWith('district.'))?.text ??
              '';

            const region = f.context?.find((c) => c.id.startsWith('region.'));
            const province = toProvinceCA(region?.short_code ?? region?.text);

            const postcode =
              f.context?.find((c) => c.id.startsWith('postcode.'))?.text ?? '';

            const addressLine1 = [f.address ?? '', f.text ?? '']
              .filter(Boolean)
              .join(' ')
              .trim();

            return {
              id: f.id,
              label: f.place_name,
              addressLine1,
              city,
              province,
              postalCode: sanitizePostal(postcode),
            };
          });

        setItems(suggestions);
        setOpen(suggestions.length > 0);
        setActiveIdx(-1);
      } catch {
        setItems([]);
        setOpen(false);
      }
    }, 250);

    return () => clearTimeout(t);
  }, [value]);

  function selectItem(idx: number) {
    const it = items[idx];
    if (!it) return;
    onChange(it.addressLine1);
    onAddress({
      addressLine1: it.addressLine1,
      city: it.city,
      province: it.province,
      postalCode: sanitizePostal(it.postalCode),
    });
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || items.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => (i + 1) % items.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => (i - 1 + items.length) % items.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIdx >= 0) selectItem(activeIdx);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    <div ref={wrapRef} className='relative'>
      <input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className={className}
        autoComplete='street-address'
        onFocus={() => items.length > 0 && setOpen(true)}
      />

      {open && items.length > 0 && (
        <ul
          role='listbox'
          className='absolute z-20 mt-2 max-h-72 w-full overflow-auto rounded-xl border border-violet-200/60 bg-white shadow-[0_12px_32px_rgba(17,12,46,.15)]'
        >
          {items.map((it, i) => (
            <li
              key={it.id}
              role='option'
              aria-selected={i === activeIdx}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => selectItem(i)}
              className={[
                'cursor-pointer px-3 py-2 text-sm',
                i === activeIdx
                  ? 'bg-[var(--color-fraction-violet-500)]/10 text-zinc-900'
                  : 'hover:bg-violet-50',
              ].join(' ')}
            >
              <div className='truncate font-medium'>{it.addressLine1}</div>
              <div className='truncate text-xs text-zinc-500'>
                {it.city}
                {it.city && ', '} {it.province || '—'} {it.postalCode || ''}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
