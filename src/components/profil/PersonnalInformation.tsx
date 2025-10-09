import * as React from 'react';
import { auth, db } from '../../firebase/firebase';
import {
  doc,
  onSnapshot,
  setDoc,
  serverTimestamp,
  arrayUnion,
} from 'firebase/firestore';
import { uploadFiles, type UploadResult } from '../../lib/firebase-io';

type KycKind = 'id' | 'proof_of_funds' | 'proof_of_address';
type ExistingDoc = string | { kind?: string; path?: string };

// ---- helpers ------------------------------------------------
function kindFrom(entry: ExistingDoc): KycKind | null {
  if (typeof entry === 'string') {
    const p = entry.toLowerCase();
    if (p.includes('/kyc/id/')) return 'id';
    if (p.includes('/kyc/proof_of_funds/')) return 'proof_of_funds';
    if (p.includes('/kyc/proof_of_address/')) return 'proof_of_address';
    return null;
  }
  const k = (entry.kind ?? '').toLowerCase();
  if (k === 'id' || k === 'proof_of_funds' || k === 'proof_of_address')
    return k as KycKind;
  const path = (entry.path ?? '').toLowerCase();
  if (path.includes('/kyc/id/')) return 'id';
  if (path.includes('/kyc/proof_of_funds/')) return 'proof_of_funds';
  if (path.includes('/kyc/proof_of_address/')) return 'proof_of_address';
  return null;
}
function hasKind(list: ExistingDoc[], kind: KycKind) {
  return list.some((e) => kindFrom(e) === kind);
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
        active ? 'bg-emerald-600 text-white' : 'bg-zinc-200 text-zinc-800',
      ].join(' ')}
      title={active ? 'Buyer & Seller' : 'Buyer'}
    >
      {active ? 'Buyer & Seller' : 'Buyer'}
    </span>
  );
}

function Block({
  title,
  hint,
  accept,
  files,
  setFiles,
  onUpload,
  progress,
  saving,
  done,
}: {
  title: string;
  hint: string;
  accept: string;
  files: File[];
  setFiles: (f: File[]) => void;
  onUpload: () => Promise<void>;
  progress: number;
  saving: boolean;
  done: boolean;
}) {
  return (
    <div className='rounded-2xl border border-violet-100/70 bg-white/90 p-4 shadow-sm'>
      <div className='mb-3 flex items-center justify-between'>
        <div>
          <h4 className='text-sm font-semibold text-zinc-900'>{title}</h4>
          <p className='text-xs text-zinc-500'>{hint}</p>
        </div>
        <span
          className={[
            'rounded-full px-2.5 py-1 text-[11px] font-medium border',
            done
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-amber-200 bg-amber-50 text-amber-700',
          ].join(' ')}
        >
          {done ? 'Complete' : 'Missing'}
        </span>
      </div>

      <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
        <input
          type='file'
          accept={accept}
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          className='block w-full text-sm file:mr-3 file:rounded-xl file:border-2 file:border-transparent file:bg-[var(--color-fraction-violet-500)] file:px-4 file:py-2 file:text-white hover:file:bg-white hover:file:text-[var(--color-fraction-violet-500)] hover:file:border-[var(--color-fraction-violet-500)] file:transition'
        />
        <button
          type='button'
          onClick={onUpload}
          disabled={saving || files.length === 0}
          className={[
            'inline-flex items-center justify-center rounded-3xl px-4 py-2 text-sm border-2 transition',
            saving || files.length === 0
              ? 'cursor-not-allowed opacity-60 border-zinc-300 bg-zinc-200 text-zinc-600'
              : 'text-white bg-[var(--color-fraction-violet-500)] border-transparent hover:bg-white hover:text-[var(--color-fraction-violet-500)] hover:border-[var(--color-fraction-violet-500)]',
          ].join(' ')}
        >
          {saving ? 'Uploading…' : 'Upload'}
        </button>
        {progress > 0 && (
          <span className='text-xs text-zinc-500'>{progress}%</span>
        )}
      </div>

      {files.length > 0 && (
        <ul className='mt-2 grid gap-1 text-xs text-zinc-600'>
          {files.map((f) => (
            <li key={f.name} className='truncate'>
              {f.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ---- main ---------------------------------------------------
export default function PersonnalInformation() {
  const u = auth.currentUser;
  const [existing, setExisting] = React.useState<ExistingDoc[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [filesId, setFilesId] = React.useState<File[]>([]);
  const [filesPoF, setFilesPoF] = React.useState<File[]>([]);
  const [filesPoA, setFilesPoA] = React.useState<File[]>([]);
  const [progId, setProgId] = React.useState(0);
  const [progPoF, setProgPoF] = React.useState(0);
  const [progPoA, setProgPoA] = React.useState(0);
  const [savingId, setSavingId] = React.useState(false);
  const [savingPoF, setSavingPoF] = React.useState(false);
  const [savingPoA, setSavingPoA] = React.useState(false);

  React.useEffect(() => {
    if (!u) {
      setLoading(false);
      return;
    }
    const ref = doc(db, 'users', u.uid);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        const docs = (snap.data()?.documents ?? []) as ExistingDoc[];
        setExisting(Array.isArray(docs) ? docs : []);
        setLoading(false);
      },
      (e) => {
        setError(e?.message ?? 'Profile error');
        setLoading(false);
      }
    );
    return () => unsub();
  }, [u?.uid]);

  const okID = hasKind(existing, 'id');
  const okPoF = hasKind(existing, 'proof_of_funds');
  const okPoA = hasKind(existing, 'proof_of_address');
  const isSeller = okID && okPoF && okPoA;

  async function saveKind(
    kind: KycKind,
    files: File[],
    setProgress: (p: number) => void,
    setSaving: (v: boolean) => void,
    reset: () => void
  ) {
    if (!u || files.length === 0) return;
    setError(null);
    setSaving(true);
    setProgress(0);
    try {
      const base = `users/${u.uid}/kyc/${kind}`;
      const results: UploadResult[] = await uploadFiles(files, base, (p) =>
        setProgress(p)
      );
      const entries = results.map((r) => ({
        kind,
        path: r.path,
        uploadedAt: serverTimestamp(),
      }));
      const ref = doc(db, 'users', u.uid);
      await setDoc(ref, { documents: arrayUnion(...entries) }, { merge: true });
      reset();
      setProgress(100);
      setTimeout(() => setProgress(0), 800);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload error');
    } finally {
      setSaving(false);
    }
  }

  if (!u) {
    return (
      <div className='rounded-2xl border bg-white p-4 text-sm text-red-600'>
        Please sign in to manage your personal information.
      </div>
    );
  }

  return (
    <section className='space-y-6'>
      {/* Account status */}
      <div className='rounded-3xl border border-violet-100/60 bg-white/90 p-5 shadow-[0_10px_30px_rgba(0,0,0,.06)]'>
        <div className='mb-2 flex items-center justify-between'>
          <h3 className='text-lg font-semibold text-zinc-900'>
            Account status
          </h3>
          <StatusBadge active={isSeller} />
        </div>
        <p className='text-sm text-zinc-500'>
          {loading
            ? 'Loading…'
            : isSeller
            ? 'All required documents are present. Your account is enabled to sell.'
            : 'Upload the required documents to enable seller status.'}
        </p>
        {error && <p className='mt-2 text-sm text-red-600'>{error}</p>}
      </div>

      {/* Document blocks */}
      <Block
        title='Government ID'
        hint='PDF or image — up to 10MB'
        accept='application/pdf,image/*,.pdf,.png,.jpg,.jpeg,.webp'
        files={filesId}
        setFiles={setFilesId}
        onUpload={() =>
          saveKind('id', filesId, setProgId, setSavingId, () => setFilesId([]))
        }
        progress={progId}
        saving={savingId}
        done={okID}
      />

      <Block
        title='Proof of funds'
        hint='PDF or image — up to 10MB'
        accept='application/pdf,image/*,.pdf,.png,.jpg,.jpeg,.webp'
        files={filesPoF}
        setFiles={setFilesPoF}
        onUpload={() =>
          saveKind('proof_of_funds', filesPoF, setProgPoF, setSavingPoF, () =>
            setFilesPoF([])
          )
        }
        progress={progPoF}
        saving={savingPoF}
        done={okPoF}
      />

      <Block
        title='Proof of address'
        hint='PDF or image — up to 10MB'
        accept='application/pdf,image/*,.pdf,.png,.jpg,.jpeg,.webp'
        files={filesPoA}
        setFiles={setFilesPoA}
        onUpload={() =>
          saveKind('proof_of_address', filesPoA, setProgPoA, setSavingPoA, () =>
            setFilesPoA([])
          )
        }
        progress={progPoA}
        saving={savingPoA}
        done={okPoA}
      />
    </section>
  );
}
