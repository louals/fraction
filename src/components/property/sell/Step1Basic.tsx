import * as React from 'react';
import Field from '../../../components/Field';
import FileDropzone from '../../../components/FileDropzone';
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

  function validateMinimal(): string | null {
    if (!value.title.trim()) return 'Titre requis';
    if (
      !value.addressLine1.trim() ||
      !value.city.trim() ||
      !value.postalCode.trim()
    )
      return 'Adresse incomplète';
    if (!CA_POSTAL_REGEX.test(value.postalCode))
      return 'Code postal canadien invalide (ex: H2X 1Y4)';
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

  // style champ unique (input / select / textarea)
  const baseField =
    'w-full rounded-xl border bg-white px-3 py-2.5 text-[15px] ' +
    'border-zinc-300 shadow-[0_1px_0_rgba(16,24,40,.04)] transition ' +
    'placeholder:text-zinc-400 ' +
    'focus-visible:outline-none focus-visible:ring-4 ' +
    'focus-visible:ring-[var(--color-fraction-violet-500)]/20 ' +
    'focus:border-[var(--color-fraction-violet-500)]';

  return (
    <div className='grid gap-8'>
      {/* Barre d’erreur élégante */}
      {error && (
        <div className='rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>
          {error}
        </div>
      )}

      {/* Intro courte */}
      <div>
        <h2 className='text-lg font-semibold text-zinc-900'>
          Informations de base
        </h2>
        <p className='mt-1 text-sm text-zinc-500'>
          Renseigne les détails principaux de la propriété. Tu pourras affiner
          ensuite.
        </p>
      </div>

      {/* Grid des champs */}
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
            inputMode='numeric'
            value={value.priceCAD}
            onChange={(e) => update('priceCAD', e.target.value)}
            placeholder='Ex: 325000'
          />
        </Field>

        <Field label='Adresse (ligne 1)' required>
          <input
            className={baseField}
            value={value.addressLine1}
            onChange={(e) => update('addressLine1', e.target.value)}
            placeholder='123 Rue Principale'
          />
        </Field>

        <Field label='Adresse (ligne 2)'>
          <input
            className={baseField}
            value={value.addressLine2}
            onChange={(e) => update('addressLine2', e.target.value)}
            placeholder='Apt, unité, etc. (optionnel)'
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
          />
        </Field>

        <Field label='Chambres'>
          <input
            className={baseField}
            inputMode='numeric'
            value={value.bedrooms}
            onChange={(e) => update('bedrooms', e.target.value)}
            placeholder='Ex: 2'
          />
        </Field>

        <Field label='Salles de bain'>
          <input
            className={baseField}
            inputMode='numeric'
            value={value.bathrooms}
            onChange={(e) => update('bathrooms', e.target.value)}
            placeholder='Ex: 1'
          />
        </Field>

        <Field label='Superficie (pi²)'>
          <input
            className={baseField}
            inputMode='numeric'
            value={value.sizeSqft}
            onChange={(e) => update('sizeSqft', e.target.value)}
            placeholder='Ex: 780'
          />
        </Field>
      </div>

      <Field label='Description'>
        <textarea
          className={`${baseField} min-h-[120px]`}
          value={value.description}
          onChange={(e) => update('description', e.target.value)}
          placeholder='Parle de la luminosité, du voisinage, des atouts (balcon, stationnement, rénovations, etc.).'
        />
      </Field>

      {/* Photos (dropzone) */}
      <FileDropzone
        label='Photos (images)'
        hint='JPG/PNG/WEBP jusqu’à 10MB — glisse & dépose ou clique pour téléverser'
        accept='image/webp,image/png,image/jpeg,.webp,.png,.jpg,.jpeg'
        maxSizeMB={10}
        multiple
        value={photos}
        onChange={onPhotosChange}
      />

      {/* CTA */}
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
