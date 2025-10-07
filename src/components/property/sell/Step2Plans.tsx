import FileDropzone from '../../../components/FileDropzone';

type Props = {
  /** Fichiers sélectionnés (contrôlé par le wizard) */
  value: File[];
  /** Mise à jour de la liste (contrôlé par le wizard) */
  onChange: (files: File[]) => void;
  onPrev: () => void;
  onNext: () => void;
};

export default function Step2Plans({ value, onChange, onPrev, onNext }: Props) {
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
        label='Plans (PDF ou images)'
        hint='PDF/PNG/JPG/WEBP jusqu’à 20MB — tu peux glisser-déposer plusieurs fichiers'
        accept='application/pdf,image/*,.png,.jpg,.jpeg,.webp'
        maxSizeMB={20}
        multiple
        value={value}
        onChange={onChange}
      />

      <div className='flex justify-between'>
        <button className={btnGhost} onClick={onPrev}>
          Retour
        </button>
        <button className={btnPrimary} onClick={onNext}>
          Continuer
        </button>
      </div>
    </div>
  );
}
