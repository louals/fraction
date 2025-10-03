import * as React from 'react';
import Field from '../../../components/Field';
import {
  PROVINCES_CA,
  CA_POSTAL_REGEX,
  type ProvinceCA,
} from '../../../types/realestate';
import { uploadFiles, patchProperty } from '../../../lib/firebase-io';

type Props = {
  propId: string;
  onNext: () => void;
};

export default function Step1Basic({ propId, onNext }: Props) {
  const [form, setForm] = React.useState({
    title: '',
    description: '',
    priceCAD: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    province: 'QC' as ProvinceCA,
    postalCode: '',
    bedrooms: '',
    bathrooms: '',
    sizeSqft: '',
  });
  const [photos, setPhotos] = React.useState<File[]>([]);
  const [progress, setProgress] = React.useState<number>(0);
  const [error, setError] = React.useState<string>('');

  function update<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSave() {
    setError('');

    // Validations Canada
    if (!form.title.trim()) return setError('Titre requis');
    if (
      !form.addressLine1.trim() ||
      !form.city.trim() ||
      !form.postalCode.trim()
    ) {
      return setError('Adresse incomplète');
    }
    if (!CA_POSTAL_REGEX.test(form.postalCode)) {
      return setError('Code postal canadien invalide (ex: H2X 1Y4)');
    }
    const price = Number(form.priceCAD);
    if (Number.isNaN(price) || price <= 0) return setError('Prix invalide');

    // Upload des photos si besoin
    let uploadedPaths: string[] = [];
    if (photos.length) {
      const results = await uploadFiles(
        photos,
        `properties/${propId}/photos`,
        (p) => setProgress(p)
      );
      uploadedPaths = results.map((r) => r.path);
    }

    await patchProperty(propId, {
      title: form.title.trim(),
      description: form.description.trim(),
      priceCAD: price,
      addressLine1: form.addressLine1.trim(),
      addressLine2: form.addressLine2.trim() || undefined,
      city: form.city.trim(),
      province: form.province,
      postalCode: form.postalCode.toUpperCase(),
      bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
      sizeSqft: form.sizeSqft ? Number(form.sizeSqft) : null,
      photoPaths: uploadedPaths.length ? uploadedPaths : undefined,
    });

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
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
          />
        </Field>
        <Field label='Prix (CAD)' required>
          <input
            className={inputBase}
            inputMode='numeric'
            value={form.priceCAD}
            onChange={(e) => update('priceCAD', e.target.value)}
          />
        </Field>
        <Field label='Adresse (ligne 1)' required>
          <input
            className={inputBase}
            value={form.addressLine1}
            onChange={(e) => update('addressLine1', e.target.value)}
          />
        </Field>
        <Field label='Adresse (ligne 2)'>
          <input
            className={inputBase}
            value={form.addressLine2}
            onChange={(e) => update('addressLine2', e.target.value)}
          />
        </Field>
        <Field label='Ville' required>
          <input
            className={inputBase}
            value={form.city}
            onChange={(e) => update('city', e.target.value)}
          />
        </Field>
        <Field label='Province' required>
          <select
            className={inputBase}
            value={form.province}
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
            value={form.postalCode}
            onChange={(e) => update('postalCode', e.target.value)}
            placeholder='H2X 1Y4'
          />
        </Field>
        <Field label='Chambres'>
          <input
            className={inputBase}
            inputMode='numeric'
            value={form.bedrooms}
            onChange={(e) => update('bedrooms', e.target.value)}
          />
        </Field>
        <Field label='Salles de bain'>
          <input
            className={inputBase}
            inputMode='numeric'
            value={form.bathrooms}
            onChange={(e) => update('bathrooms', e.target.value)}
          />
        </Field>
        <Field label='Superficie (pi²)'>
          <input
            className={inputBase}
            inputMode='numeric'
            value={form.sizeSqft}
            onChange={(e) => update('sizeSqft', e.target.value)}
          />
        </Field>
      </div>

      <Field label='Description'>
        <textarea
          className={`${inputBase} min-h-24`}
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
        />
      </Field>

      <Field
        label='Photos (images)'
        hint={progress ? `Upload: ${progress}%` : 'Formats: JPG/PNG/WEBP'}
      >
        <input
          type='file'
          accept='image/*'
          multiple
          onChange={(e) => setPhotos(Array.from(e.target.files ?? []))}
        />
      </Field>

      {error && <p className='text-red-600'>{error}</p>}

      <div className='flex justify-end'>
        <button
          className='inline-flex items-center justify-center rounded-3xl px-6 py-2 border-2 select-none transition ease-out
                     text-white bg-[var(--color-fraction-violet-500)] border-transparent
                     shadow-sm hover:shadow-lg motion-safe:duration-200 will-change-[transform,box-shadow]
                     motion-safe:hover:scale-[1.03] hover:-translate-y-0.5 active:scale-95
                     hover:bg-white hover:text-[var(--color-fraction-violet-500)] hover:border-[var(--color-fraction-violet-500)]
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-fraction-violet-500)]/60'
          onClick={handleSave}
        >
          Enregistrer & Continuer
        </button>
      </div>
    </div>
  );
}
