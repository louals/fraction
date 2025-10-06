import * as React from 'react';
import FileDropzone from '../../../components/FileDropzone';

type Props = {
  /** Fichiers PDF sélectionnés (contrôlé par le wizard) */
  value: File[];
  /** Mise à jour de la liste (contrôlé par le wizard) */
  onChange: (files: File[]) => void;
  onPrev: () => void;
  /** Soumission finale (le wizard fait les uploads + createProperty) */
  onSubmit: () => Promise<void>;
  /** État d’envoi global (wizard) */
  submitting?: boolean;
  /** Progression globale (0..100) — optionnelle */
  progress?: number;
  /** Message d’erreur global — optionnel */
  error?: string | null;
};

export default function Step3Legal({
  value,
  onChange,
  onPrev,
  onSubmit,
  submitting = false,
  progress = 0,
  error = null,
}: Props) {
  const [agree, setAgree] = React.useState<boolean>(false);

  async function handleClick() {
    if (!agree || submitting) return;
    await onSubmit();
  }

  const btnGhost =
    'inline-flex items-center justify-center rounded-3xl px-6 py-2 border-2 bg-white select-none transition ease-out ' +
    'text-[var(--color-fraction-violet-500)] border-[var(--color-fraction-violet-500)] ' +
    'hover:shadow-lg motion-safe:duration-200 will-change-[transform,box-shadow] ' +
    'motion-safe:hover:scale-[1.03] hover:-translate-y-0.5 active:scale-95';

  const btnPrimary =
    'inline-flex items-center justify-center rounded-3xl px-6 py-2 border-2 select-none transition ease-out ' +
    'text-white bg-[var(--color-fraction-violet-500)] border-transparent ' +
    'shadow-sm hover:shadow-lg motion-safe:duration-200 will-change-[transform,box-shadow] ' +
    'motion-safe:hover:scale-[1.03] hover:-translate-y-0.5 active:scale-95 ' +
    'hover:bg-white hover:text-[var(--color-fraction-violet-500)] hover:border-[var(--color-fraction-violet-500)]';

  return (
    <div className='grid gap-6'>
      <FileDropzone
        label='Documents légaux (PDF)'
        hint='Ex: titre de propriété, déclaration du vendeur… (PDF uniquement, ≤ 20MB)'
        accept='application/pdf,.pdf'
        maxSizeMB={20}
        multiple
        value={value}
        onChange={onChange}
      />

      <label className='flex items-center gap-3'>
        <input
          type='checkbox'
          className='size-4'
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
        />
        <span className='text-sm'>
          Je confirme que les informations fournies sont exactes et que je
          possède les droits pour publier ces documents.
        </span>
      </label>

      {/* Barre de progression globale (affichée pendant l'envoi) */}
      {submitting && (
        <div className='mt-1'>
          <div className='h-2 w-full rounded bg-zinc-100'>
            <div
              className='h-2 rounded bg-[var(--color-fraction-violet-500)] transition-[width] motion-safe:duration-200'
              style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
            />
          </div>
          <p className='mt-1 text-xs text-zinc-500'>
            Téléversement… {Math.round(progress)}%
          </p>
        </div>
      )}

      {/* Erreur globale éventuelle venant du wizard */}
      {error && <p className='text-red-600'>{error}</p>}

      <div className='flex justify-between'>
        <button className={btnGhost} onClick={onPrev} disabled={submitting}>
          Retour
        </button>
        <button
          className={`${btnPrimary} disabled:opacity-50`}
          disabled={!agree || submitting}
          onClick={handleClick}
        >
          {submitting ? 'Envoi…' : 'Soumettre'}
        </button>
      </div>
    </div>
  );
}
