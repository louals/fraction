import * as React from 'react';
import Field from '../../../components/Field';
import {
  PROVINCES_CA,
  CA_POSTAL_REGEX,
  type ProvinceCA,
} from '../../../types/realestate';

import FileDropzone from '../../FileDropzone';

export type Step1Form = {
  title: string;
  description: string;
  priceCAD: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  province: ProvinceCA;
  postalCode: string;
  bedrooms: string;
  bathrooms: string;
  sizeSqft: string;
};

type Props = {
  value: Step1Form;
  onChange: (next: Step1Form) => void;
  photos: File[];
  onPhotosChange: (files: File[]) => void;
  onNext: () => void;
};

export default function Step1Basic({
  value,
  onChange,
  photos,
  onPhotosChange,
  onNext,
}: Props) {
  const [error, setError] = React.useState<string>('');

  function update<K extends keyof Step1Form>(key: K, val: Step1Form[K]) {
    onChange({ ...value, [key]: val });
  }

  function validateMinimal(): string | null {
    if (!value.title.trim()) return 'Titre requis';
    if (
      !value.addressLine1.trim() ||
      !value.city.trim() ||
      !value.postalCode.trim()
    ) {
      return 'Adresse incomplète';
    }
    if (!CA_POSTAL_REGEX.test(value.postalCode)) {
      return 'Code postal canadien invalide (ex: H2X 1Y4)';
    }
    const price = Number(value.priceCAD);
    if (Number.isNaN(price) || price <= 0) return 'Prix invalide';
    return null;
  }

  function handleNext() {
    const v = validateMinimal();
    if (v) {
      setError(v);
      return;
    }
    setError('');
    onNext();
  }

  const inputBase =
    'w-full rounded-xl border px-3 py-2 outline-none focus-visible:ring-2 ring-[var(--color-fraction-violet-500)]/40';

  return (
    <div className='grid gap-6'>
      <div className='grid gap-4 md:grid-cols-2'>
        <Field label='Titre' required>
          <input
            className={inputBase}
            value={value.title}
            onChange={(e) => update('title', e.target.value)}
          />
        </Field>

        <Field label='Prix (CAD)' required>
          <input
            className={inputBase}
            inputMode='numeric'
            value={value.priceCAD}
            onChange={(e) => update('priceCAD', e.target.value)}
          />
        </Field>

        <Field label='Adresse (ligne 1)' required>
          <input
            className={inputBase}
            value={value.addressLine1}
            onChange={(e) => update('addressLine1', e.target.value)}
          />
        </Field>

        <Field label='Adresse (ligne 2)'>
          <input
            className={inputBase}
            value={value.addressLine2}
            onChange={(e) => update('addressLine2', e.target.value)}
          />
        </Field>

        <Field label='Ville' required>
          <input
            className={inputBase}
            value={value.city}
            onChange={(e) => update('city', e.target.value)}
          />
        </Field>

        <Field label='Province' required>
          <select
            className={inputBase}
            value={value.province}
            onChange={(e) => update('province', e.target.value as ProvinceCA)}
          >
            {PROVINCES_CA.map((p) => (
              <option key={p.code} value={p.code}>
                {p.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label='Code postal' required>
          <input
            className={`${inputBase} uppercase`}
            value={value.postalCode}
            onChange={(e) => update('postalCode', e.target.value)}
            placeholder='H2X 1Y4'
          />
        </Field>

        <Field label='Chambres'>
          <input
            className={inputBase}
            inputMode='numeric'
            value={value.bedrooms}
            onChange={(e) => update('bedrooms', e.target.value)}
          />
        </Field>

        <Field label='Salles de bain'>
          <input
            className={inputBase}
            inputMode='numeric'
            value={value.bathrooms}
            onChange={(e) => update('bathrooms', e.target.value)}
          />
        </Field>

        <Field label='Superficie (pi²)'>
          <input
            className={inputBase}
            inputMode='numeric'
            value={value.sizeSqft}
            onChange={(e) => update('sizeSqft', e.target.value)}
          />
        </Field>
      </div>

      <Field label='Description'>
        <textarea
          className={`${inputBase} min-h-24`}
          value={value.description}
          onChange={(e) => update('description', e.target.value)}
        />
      </Field>

      <FileDropzone
        label='Photos (WEBP ou PNG)'
        hint='WEBP/PNG jusqu’à 10MB'
        accept='image/webp,image/png,.webp,.png'
        maxSizeMB={10}
        multiple
        value={photos}
        onChange={onPhotosChange}
      />

      {/* --- Version INPUT classique (si tu n'as pas le composant Dropzone) ---
      <Field label="Photos (images)" hint="JPG/PNG/WEBP">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => onPhotosChange(Array.from(e.target.files ?? []))}
        />
      </Field>
      ---------------------------------------------------------------------- */}

      {error && <p className='text-red-600'>{error}</p>}

      <div className='flex justify-end'>
        <button
          className='inline-flex items-center justify-center rounded-3xl px-6 py-2 border-2 select-none transition ease-out
                     text-white bg-[var(--color-fraction-violet-500)] border-transparent
                     shadow-sm hover:shadow-lg motion-safe:duration-200 will-change-[transform,box-shadow]
                     motion-safe:hover:scale-[1.03] hover:-translate-y-0.5 active:scale-95
                     hover:bg-white hover:text-[var(--color-fraction-violet-500)] hover:border-[var(--color-fraction-violet-500)]
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-fraction-violet-500)]/60'
          onClick={handleNext}
        >
          Continuer
        </button>
      </div>
    </div>
  );
}
