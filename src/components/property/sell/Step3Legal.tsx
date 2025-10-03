import * as React from 'react';
import Field from '../../../components/Field';
import { uploadFiles, patchProperty } from '../../../lib/firebase-io';

type Props = {
  propId: string;
  onPrev: () => void;
  onFinish: () => void;
};

export default function Step3Legal({ propId, onPrev, onFinish }: Props) {
  const [files, setFiles] = React.useState<File[]>([]);
  const [progress, setProgress] = React.useState<number>(0);
  const [agree, setAgree] = React.useState(false);

  async function handleSubmit() {
    if (!agree) return;
    if (files.length) {
      const results = await uploadFiles(
        files,
        `properties/${propId}/legal`,
        (p) => setProgress(p)
      );
      await patchProperty(propId, {
        legalDocPaths: results.map((r) => r.path),
        status: 'submitted',
      });
    } else {
      await patchProperty(propId, { status: 'submitted' });
    }
    onFinish();
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
        label='Documents légaux (PDF)'
        hint={
          progress
            ? `Upload: ${progress}%`
            : 'Ex: titre de propriété, déclaration vendeur…'
        }
      >
        <input
          type='file'
          accept='application/pdf'
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
        />
      </Field>

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

      <div className='flex justify-between'>
        <button className={btnGhost} onClick={onPrev}>
          Retour
        </button>
        <button
          className={`${btnPrimary} disabled:opacity-50`}
          disabled={!agree}
          onClick={handleSubmit}
        >
          Soumettre
        </button>
      </div>
    </div>
  );
}
