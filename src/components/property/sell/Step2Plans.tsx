import * as React from 'react';
import Field from '../../../components/Field';
import { uploadFiles, patchProperty } from '../../../lib/firebase-io';

type Props = {
  propId: string;
  onPrev: () => void;
  onNext: () => void;
};

export default function Step2Plans({ propId, onPrev, onNext }: Props) {
  const [files, setFiles] = React.useState<File[]>([]);
  const [progress, setProgress] = React.useState<number>(0);

  async function handleSave() {
    if (!files.length) return onNext();
    const results = await uploadFiles(
      files,
      `properties/${propId}/plans`,
      (p) => setProgress(p)
    );
    await patchProperty(propId, { planPaths: results.map((r) => r.path) });
    onNext();
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
      <Field
        label='Plans (PDF ou images)'
        hint={progress ? `Upload: ${progress}%` : 'PDF/PNG/JPG'}
      >
        <input
          type='file'
          accept='application/pdf,image/*'
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
        />
      </Field>

      <div className='flex justify-between'>
        <button className={btnGhost} onClick={onPrev}>
          Retour
        </button>
        <button className={btnPrimary} onClick={handleSave}>
          Continuer
        </button>
      </div>
    </div>
  );
}
