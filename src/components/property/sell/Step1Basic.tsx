import * as React from 'react';
import Field from '../../../components/Field';
import FileDropzone from '../../../components/FileDropzone';
import AddressAutocomplete from '../../AdressAutoComplete';
import {
  PROVINCES_CA,
  CA_POSTAL_REGEX,
  type ProvinceCA,
} from '../../../types/realestate';

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

  const onlyDigits = (s: string) => s.replace(/\D+/g, '');

  function validate(): string | null {
    if (!value.title.trim()) return 'Le titre est requis.';
    if (!value.description.trim()) return 'La description est requise.';
    const price = Number(value.priceCAD);
    if (!value.priceCAD || Number.isNaN(price) || price <= 0)
      return 'Prix (CAD) invalide.';
    if (!value.addressLine1.trim()) return 'Adresse (ligne 1) requise.';
    if (!value.city.trim()) return 'Ville requise.';
    if (!value.province) return 'Province requise.';
    if (!value.postalCode.trim()) return 'Code postal requis.';
    if (!CA_POSTAL_REGEX.test(value.postalCode))
      return 'Code postal canadien invalide (ex: H2X 1Y4).';
    const beds = Number(value.bedrooms);
    const baths = Number(value.bathrooms);
    const sqft = Number(value.sizeSqft);
    if (!value.bedrooms || Number.isNaN(beds) || beds <= 0)
      return 'Nombre de chambres invalide.';
    if (!value.bathrooms || Number.isNaN(baths) || baths <= 0)
      return 'Nombre de salles de bain invalide.';
    if (!value.sizeSqft || Number.isNaN(sqft) || sqft <= 0)
      return 'Superficie (pi²) invalide.';
    if (photos.length === 0) return 'Ajoute au moins une photo.';
    return null;
  }

  function handleNext() {
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setError('');
    onNext();
  }

  const baseField =
    'w-full rounded-xl border bg-white px-3 py-2.5 text-[15px] ' +
    'border-zinc-300 shadow-[0_1px_0_rgba(16,24,40,.04)] transition ' +
    'placeholder:text-zinc-400 ' +
    'focus-visible:outline-none focus-visible:ring-4 ' +
    'focus-visible:ring-[var(--color-fraction-violet-500)]/20 ' +
    'focus:border-[var(--color-fraction-violet-500)]';

  return (
    <div className='grid gap-8'>
      {error && (
        <div className='rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>
          {error}
        </div>
      )}

      <div>
        <h2 className='text-lg font-semibold text-zinc-900'>
          Informations de base
        </h2>
        <p className='mt-1 text-sm text-zinc-500'>
          Tous les champs sont obligatoires <b>sauf</b> “Adresse (ligne 2)”.
        </p>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        <Field label='Titre' required>
          <input
            className={baseField}
            value={value.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder='Ex: Condo lumineux 3½ à Montréal'
          />
        </Field>

        <Field label='Prix (CAD)' required>
          <input
            className={baseField}
            type='text'
            inputMode='numeric'
            pattern='\d*'
            value={value.priceCAD}
            onChange={(e) => update('priceCAD', onlyDigits(e.target.value))}
            placeholder='Ex: 325000'
          />
        </Field>

        <Field label='Adresse (ligne 1)' required>
          <AddressAutocomplete
            value={value.addressLine1}
            onChange={(s) => update('addressLine1', s)}
            onAddress={({ addressLine1, city, province, postalCode }) => {
              onChange({
                ...value,
                addressLine1,
                city: city || value.city,
                province: (province || value.province) as ProvinceCA,
                postalCode: postalCode || value.postalCode,
              });
            }}
            placeholder='3800 R. Sherbrooke E'
            className={baseField}
          />
        </Field>

        <Field label='Adresse (ligne 2)'>
          <input
            className={baseField}
            value={value.addressLine2}
            onChange={(e) => update('addressLine2', e.target.value)}
            placeholder='Apt, unité (optionnel)'
          />
        </Field>

        <Field label='Ville' required>
          <input
            className={baseField}
            value={value.city}
            onChange={(e) => update('city', e.target.value)}
            placeholder='Montréal'
          />
        </Field>

        <Field label='Province' required>
          <select
            className={baseField}
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
            className={`${baseField} uppercase`}
            value={value.postalCode}
            onChange={(e) => update('postalCode', e.target.value)}
            placeholder='H2X 1Y4'
            autoComplete='postal-code'
          />
        </Field>

        <Field label='Chambres' required>
          <input
            className={baseField}
            type='text'
            inputMode='numeric'
            pattern='\d*'
            value={value.bedrooms}
            onChange={(e) => update('bedrooms', onlyDigits(e.target.value))}
            placeholder='Ex: 2'
          />
        </Field>

        <Field label='Salles de bain' required>
          <input
            className={baseField}
            type='text'
            inputMode='numeric'
            pattern='\d*'
            value={value.bathrooms}
            onChange={(e) => update('bathrooms', onlyDigits(e.target.value))}
            placeholder='Ex: 1'
          />
        </Field>

        <Field label='Superficie (pi²)' required>
          <input
            className={baseField}
            type='text'
            inputMode='numeric'
            pattern='\d*'
            value={value.sizeSqft}
            onChange={(e) => update('sizeSqft', onlyDigits(e.target.value))}
            placeholder='Ex: 780'
          />
        </Field>
      </div>

      <Field label='Description' required>
        <textarea
          className={`${baseField} min-h-[120px]`}
          value={value.description}
          onChange={(e) => update('description', e.target.value)}
          placeholder='Atouts, rénovations, voisinage, etc.'
        />
      </Field>

      <FileDropzone
        label='Photos (WEBP/PNG/JPG)'
        hint='Au moins 1 image — ≤ 10MB chacune'
        accept='image/webp,image/png,image/jpeg,.webp,.png,.jpg,.jpeg'
        maxSizeMB={10}
        multiple
        value={photos}
        onChange={onPhotosChange}
      />

      <div className='mt-2 flex justify-end'>
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
