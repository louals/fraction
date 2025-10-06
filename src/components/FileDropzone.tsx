import * as React from 'react';

export type FileDropzoneProps = {
  label: string;
  hint?: string;
  accept?: string; // ex: "image/webp,image/png,.webp,.png"
  maxSizeMB?: number; // défaut 20
  multiple?: boolean; // défaut true
  value: File[];
  onChange: (files: File[]) => void;
  className?: string;
  disabled?: boolean;
};

function toKB(size: number): string {
  return `${Math.ceil(size / 1024)} KB`;
}
function splitAccept(accept?: string): string[] {
  if (!accept) return [];
  return accept
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}
function fileKey(f: File): string {
  return `${f.name}__${f.size}__${f.lastModified}`;
}
function hasExt(file: File, extToken: string): boolean {
  const dot = extToken.startsWith('.')
    ? extToken.toLowerCase()
    : `.${extToken.toLowerCase()}`;
  return file.name.toLowerCase().endsWith(dot);
}
function isImageByExt(name: string): boolean {
  return /\.(png|webp|jpe?g|gif|bmp|avif|heic)$/i.test(name);
}

/** Vérifie si un fichier correspond à un token d'accept :
 * - "*\/*" : tout
 * - "image/*" : préfixe MIME
 * - "application/pdf" : MIME exact
 * - ".png" (ou ".webp") : extension
 */
function matchSingleAccept(file: File, token: string): boolean {
  if (token === '*/*') return true;
  if (token.startsWith('.')) return hasExt(file, token);
  const ft = file.type.toLowerCase(); // parfois ""
  const tk = token.toLowerCase();
  if (tk.endsWith('/*')) {
    const prefix = tk.slice(0, -2);
    return ft ? ft.startsWith(prefix) : false;
  }
  return ft === tk;
}
function matchesAccept(file: File, tokens: string[]): boolean {
  if (tokens.length === 0) return true;
  const hasType = file.type.trim().length > 0;
  return tokens.some((tk) => {
    if (tk.startsWith('.')) return hasExt(file, tk);
    if (!hasType) return false;
    return matchSingleAccept(file, tk);
  });
}

export default function FileDropzone({
  label,
  hint,
  accept,
  maxSizeMB = 20,
  multiple = true,
  value,
  onChange,
  className,
  disabled = false,
}: FileDropzoneProps) {
  const [isOver, setIsOver] = React.useState(false);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [, setPreviewVersion] = React.useState(0); // déclenche un re-render
  const inputRef = React.useRef<HTMLInputElement>(null);
  const maxBytes = maxSizeMB * 1024 * 1024;
  const acceptTokens = React.useMemo(() => splitAccept(accept), [accept]);

  /** key -> objectURL (pour images) */
  const previewsRef = React.useRef<Map<string, string>>(new Map());

  // Sync previews à chaque changement de value (et re-render si modifié)
  React.useEffect(() => {
    const map = previewsRef.current;
    let changed = false;

    const keep = new Set(value.map(fileKey));
    // révoquer les URLs des fichiers supprimés
    for (const [k, url] of map) {
      if (!keep.has(k)) {
        URL.revokeObjectURL(url);
        map.delete(k);
        changed = true;
      }
    }

    // créer les URLs manquantes pour les images (MIME ou extension)
    for (const f of value) {
      const k = fileKey(f);
      const isImg =
        (f.type && f.type.startsWith('image/')) || isImageByExt(f.name);
      if (isImg && !map.has(k)) {
        map.set(k, URL.createObjectURL(f));
        changed = true;
      }
    }

    if (changed) setPreviewVersion((v) => v + 1);
  }, [value]);

  // Cleanup global (ESLint-friendly: on capture la map)
  React.useEffect(() => {
    const map = previewsRef.current;
    return () => {
      for (const url of map.values()) URL.revokeObjectURL(url);
      map.clear();
    };
  }, []);

  function pick() {
    if (!disabled) inputRef.current?.click();
  }
  function pushError(msg: string) {
    setErrors((prev) => [...prev, msg]);
  }
  function dedupeByKey(files: File[]): File[] {
    const existing = new Set(value.map(fileKey));
    const out: File[] = [];
    for (const f of files) {
      const k = fileKey(f);
      if (existing.has(k)) continue;
      existing.add(k);
      out.push(f);
    }
    return out;
  }
  function validateAndMerge(files: FileList | File[]) {
    const list = Array.from(files);
    const accepted: File[] = [];
    for (const f of list) {
      if (f.size > maxBytes) {
        pushError(`"${f.name}" dépasse ${maxSizeMB} MB (${toKB(f.size)}).`);
        continue;
      }
      if (!matchesAccept(f, acceptTokens)) {
        pushError(
          `"${f.name}" n’est pas un type accepté (${accept ?? 'tous'}).`
        );
        continue;
      }
      accepted.push(f);
    }
    if (accepted.length === 0) return;
    const merged = multiple
      ? [...value, ...dedupeByKey(accepted)]
      : [accepted[0]];
    onChange(merged);
  }
  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setErrors([]);
    validateAndMerge(e.target.files ?? []);
    e.currentTarget.value = ''; // pouvoir re-choisir le même fichier
  }
  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);
    setErrors([]);
    if (!disabled) validateAndMerge(e.dataTransfer.files);
  }
  function onDragOver(e: React.DragEvent<HTMLDivElement>) {
    if (disabled) return;
    e.preventDefault();
    setIsOver(true);
  }
  function onDragEnter(e: React.DragEvent<HTMLDivElement>) {
    if (disabled) return;
    e.preventDefault();
    setIsOver(true);
  }
  function onDragLeave() {
    setIsOver(false);
  }
  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      pick();
    }
  }
  function removeAt(idx: number) {
    const next = value.slice();
    const removed = next.splice(idx, 1)[0];
    onChange(next);
    if (removed) {
      const map = previewsRef.current;
      const k = fileKey(removed);
      const url = map.get(k);
      if (url) {
        URL.revokeObjectURL(url);
        map.delete(k);
      }
      setPreviewVersion((v) => v + 1);
    }
  }

  const baseBorder =
    'rounded-xl border-2 border-dashed p-6 transition flex flex-col items-center justify-center text-center';
  const activeState = isOver
    ? 'border-[var(--color-fraction-violet-500)] bg-violet-50/40'
    : 'border-zinc-300 bg-white';
  const disabledState = disabled ? 'opacity-60 pointer-events-none' : '';
  const rootCls = [baseBorder, activeState, disabledState, className ?? '']
    .filter(Boolean)
    .join(' ');

  // Préparer les items d’affichage
  const previewItems = value.map((f, i) => {
    const k = fileKey(f);
    const isImg =
      (f.type && f.type.startsWith('image/')) || isImageByExt(f.name);
    const url = previewsRef.current.get(k) ?? null;
    return { index: i, file: f, isImg, url, key: k };
  });

  return (
    <div className='grid gap-2'>
      <span className='text-sm font-medium'>{label}</span>

      <div
        role='button'
        tabIndex={0}
        aria-disabled={disabled}
        aria-label={`${label} — glisser-déposer ou cliquer pour téléverser`}
        className={rootCls}
        onClick={pick}
        onKeyDown={onKeyDown}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <svg aria-hidden viewBox='0 0 24 24' className='mb-2 size-8 opacity-70'>
          <path
            fill='currentColor'
            d='M19 15a4 4 0 0 0-3.8-4A5 5 0 0 0 6 11a4 4 0 0 0 0 8h12a3 3 0 0 0 1-5.83A4 4 0 0 0 19 15Z'
          />
        </svg>
        <div className='text-sm'>
          <b>Glissez & déposez</b> ou <span className='underline'>cliquez</span>{' '}
          pour téléverser
        </div>
        <div className='mt-1 text-xs text-zinc-500'>
          {(accept ?? 'Tous types').toUpperCase()} — ≤ {maxSizeMB} MB / fichier
        </div>
        <input
          ref={inputRef}
          type='file'
          accept={accept}
          multiple={multiple}
          className='hidden'
          onChange={onInputChange}
        />
      </div>

      {/* Grille d’aperçus */}
      {previewItems.length > 0 && (
        <ul className='mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3'>
          {previewItems.map(({ key, file, isImg, url, index }) => (
            <li key={key} className='group relative rounded-xl border p-2'>
              <div className='aspect-square w-full overflow-hidden rounded-lg bg-zinc-50 border'>
                {isImg && url ? (
                  <img
                    src={url}
                    alt={file.name}
                    className='h-full w-full object-cover'
                    loading='lazy'
                    decoding='async'
                    referrerPolicy='no-referrer'
                  />
                ) : (
                  <div className='flex h-full w-full items-center justify-center text-xs text-zinc-500'>
                    {file.name.split('.').pop()?.toUpperCase() ?? 'FILE'}
                  </div>
                )}
              </div>
              <div className='mt-1 truncate text-xs' title={file.name}>
                {file.name}
                <span className='ml-1 text-[10px] text-zinc-500'>
                  ({toKB(file.size)})
                </span>
              </div>
              <button
                type='button'
                onClick={() => removeAt(index)}
                className='absolute right-2 top-2 hidden rounded-full border bg-white/90 px-2 py-0.5 text-xs text-red-600 shadow-sm hover:bg-white group-hover:block'
                aria-label={`Retirer ${file.name}`}
                title='Retirer'
              >
                Retirer
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Erreurs */}
      {errors.length > 0 && (
        <ul className='mt-2 list-disc pl-5 text-xs text-red-600'>
          {errors.map((e, idx) => (
            <li key={idx}>{e}</li>
          ))}
        </ul>
      )}

      {hint && <span className='text-xs text-zinc-500'>{hint}</span>}
    </div>
  );
}
