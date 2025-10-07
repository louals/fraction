import * as React from 'react';
import { Trash2 } from 'lucide-react';

export type FileDropzoneProps = {
  label: string;
  hint?: string;
  accept?: string;
  maxSizeMB?: number;
  multiple?: boolean;
  value: File[];
  onChange: (files: File[]) => void;
  className?: string;
  disabled?: boolean;
};

/** Format bytes to KB (ceiled) for display */
function toKB(size: number) {
  return `${Math.ceil(size / 1024)} KB`;
}

/** Split the accept string into individual tokens (e.g., ".png", "image/*") */
function splitAccept(accept?: string) {
  return accept
    ? accept
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
}

/** Build a stable key for a File object */
function fileKey(f: File) {
  return `${f.name}__${f.size}__${f.lastModified}`;
}

/** Check if file name has a given extension token (with or without leading dot) */
function hasExt(file: File, token: string) {
  const dot = token.startsWith('.')
    ? token.toLowerCase()
    : `.${token.toLowerCase()}`;
  return file.name.toLowerCase().endsWith(dot);
}

/** Heuristic: determine if a filename looks like an image by extension */
function isImageByExt(name: string) {
  return /\.(png|webp|jpe?g|gif|bmp|avif|heic)$/i.test(name);
}

/** Match a single accept token against a file handles ", "type/subtype") */
function matchSingleAccept(file: File, token: string) {
  if (token === '*/*') return true;
  if (token.startsWith('.')) return hasExt(file, token);
  const ft = (file.type || '').toLowerCase();
  const tk = token.toLowerCase();
  if (tk.endsWith('/*')) return ft ? ft.startsWith(tk.slice(0, -2)) : false;
  return ft === tk;
}

/** Check if a file matches any of the accept tokens */
function matchesAccept(file: File, tokens: string[]) {
  if (tokens.length === 0) return true;
  const hasType = (file.type || '').trim().length > 0;
  return tokens.some((tk) =>
    tk.startsWith('.')
      ? hasExt(file, tk)
      : hasType && matchSingleAccept(file, tk)
  );
}

export default function FileDropzone({
  label,
  hint,
  accept,
  maxSizeMB = 10,
  multiple = true,
  value,
  onChange,
  className,
  disabled = false,
}: FileDropzoneProps) {
  const [isOver, setIsOver] = React.useState(false);
  const [justDropped, setJustDropped] = React.useState(false);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [, setPreviewVersion] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // NEW: transient "uploading" visual state (2s overlay)
  const [uploading, setUploading] = React.useState(false);

  const maxBytes = maxSizeMB * 1024 * 1024;
  const acceptTokens = React.useMemo(() => splitAccept(accept), [accept]);

  /** Cache for object URLs so previews are stable and cleaned up when files change */
  const previewsRef = React.useRef<Map<string, string>>(new Map());
  React.useEffect(() => {
    const map = previewsRef.current;
    let changed = false;
    const keep = new Set(value.map(fileKey));

    // Revoke URLs for files that were removed
    for (const [k, url] of map) {
      if (!keep.has(k)) {
        URL.revokeObjectURL(url);
        map.delete(k);
        changed = true;
      }
    }
    // Create URLs for new image files
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

  // Cleanup all object URLs on unmount
  React.useEffect(
    () => () => {
      for (const url of previewsRef.current.values()) URL.revokeObjectURL(url);
      previewsRef.current.clear();
    },
    []
  );

  /** Programmatically open the file picker (ignored when disabled) */
  function pick() {
    if (!disabled) inputRef.current?.click();
  }

  /** Collect an error line for the UI list */
  function pushError(msg: string) {
    setErrors((prev) => [...prev, msg]);
  }

  /** Remove duplicates by our stable file key (name/size/mtime) */
  function dedupeByKey(files: File[]) {
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

  /** Validate dropped/selected files then merge with current value */
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

  /** Show a transient uploading animation (visual only); integrate with real async if needed */
  function showUploading(ms = 2000) {
    setUploading(true);
    window.setTimeout(() => setUploading(false), ms);
  }

  /** Handle native input change (click-to-upload) */
  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setErrors([]);
    validateAndMerge(e.target.files ?? []);
    // Reset input so the same file can be selected again
    e.currentTarget.value = '';
    // Visual feedbacks
    setJustDropped(true);
    showUploading(2000); // NEW: start 2s uploading overlay
    window.setTimeout(() => setJustDropped(false), 700);
  }

  /** Handle drag-and-drop events */
  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);
    setErrors([]);
    if (!disabled) {
      validateAndMerge(e.dataTransfer.files);
      // Visual feedbacks
      setJustDropped(true);
      showUploading(2000); // NEW: start 2s uploading overlay
      window.setTimeout(() => setJustDropped(false), 700);
    }
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

  /** Keyboard support (Enter/Space to open picker) */
  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      pick();
    }
  }

  /** Remove file at a specific index and cleanup its preview URL */
  function removeAt(idx: number) {
    const next = value.slice();
    const removed = next.splice(idx, 1)[0];
    onChange(next);
    if (removed) {
      const k = fileKey(removed);
      const url = previewsRef.current.get(k);
      if (url) {
        URL.revokeObjectURL(url);
        previewsRef.current.delete(k);
      }
      setPreviewVersion((v) => v + 1);
    }
  }

  // ===== Visual styling tokens (border always visible, subtle hover feedback)
  const base =
    'relative overflow-hidden rounded-2xl p-8 transition-all text-center select-none';
  const borderAlways =
    'border-2 border-[color:var(--color-fraction-violet-500,#3f3cbb)]/40';
  const surface = isOver ? 'bg-violet-50/50' : 'bg-white';
  const layout = 'flex flex-col items-center justify-center';
  const state = disabled ? 'opacity-60 pointer-events-none' : '';
  const rootCls = [base, borderAlways, surface, layout, state, className ?? '']
    .filter(Boolean)
    .join(' ');

  // Build preview items with memoized object URLs for images
  const previewItems = value.map((f, i) => {
    const k = fileKey(f);
    const isImg =
      (f.type && f.type.startsWith('image/')) || isImageByExt(f.name);
    const url = previewsRef.current.get(k) ?? null;
    return { index: i, file: f, isImg, url, key: k };
  });

  return (
    <div className="grid gap-2">
      <style>{`
        /* Floating cloud icon */
        @keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
        /* Soft falling chevrons for drag-over hint */
        @keyframes chevron { 0% { transform: translateY(-2px); opacity: .0 } 50% { opacity: .8 } 100% { transform: translateY(3px); opacity: 0 } }
        /* Inner pulse ring after successful drop/select */
        @keyframes pulseRing {
          0% { box-shadow: 0 0 0 0 rgba(63,60,187,.18) inset }
          70% { box-shadow: 0 0 0 10px rgba(63,60,187,.06) inset }
          100% { box-shadow: 0 0 0 0 rgba(63,60,187,0) inset }
        }
        /* NEW: progress bar fill */
        @keyframes barFill {
          0% { width: 0% }
          100% { width: 100% }
        }
        /* NEW: shimmer for the progress track (subtle) */
        @keyframes shimmer {
          0% { transform: translateX(-100%) }
          100% { transform: translateX(100%) }
        }
      `}</style>

      <span className="text-sm font-medium">{label}</span>

      <div
        role="button"
        tabIndex={0}
        aria-disabled={disabled}
        aria-label={`${label} — glisser-déposer ou cliquer pour téléverser`}
        className={`${rootCls} cursor-pointer hover:cursor-[copy] focus:outline-none mb-5`}
        onClick={pick}
        onKeyDown={onKeyDown}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {(isOver || justDropped) && (
          <div
            aria-hidden
            className="absolute inset-1 rounded-[1rem] pointer-events-none"
            style={{
              background:
                'radial-gradient(60% 60% at 50% 40%, rgba(63,60,187,.12), transparent 60%)',
              transition: 'opacity .2s ease',
              opacity: isOver ? 1 : 0.9,
              animation: justDropped ? 'pulseRing 650ms ease-out 1' : undefined,
            }}
          />
        )}

        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className={`mb-3 size-10 opacity-80 transition-transform ${
            isOver ? 'scale-110' : ''
          }`}
          style={{ animation: 'float 4s ease-in-out infinite' }}
        >
          <path
            fill="currentColor"
            d="M19 15a4 4 0 0 0-3.8-4A5 5 0 0 0 6 11a4 4 0 0 0 0 8h12a3 3 0 0 0 1-5.83A4 4 0 0 0 19 15Z"
          />
        </svg>

        <div className="text-sm sm:text-base">
          <b>Glissez & déposez</b> ou <span className="underline">cliquez</span>{' '}
          pour téléverser
        </div>
        <div className="mt-2 text-xs text-zinc-500">
          {(accept ?? 'Tous types').toUpperCase()} — ≤ {maxSizeMB} MB / fichier
        </div>

        {isOver && (
          <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2 pointer-events-none">
            {[0, 1, 2].map((i) => (
              <svg
                key={i}
                viewBox="0 0 20 12"
                width="18"
                height="12"
                className="opacity-70"
              >
                <path
                  d="M2 2l8 8 8-8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{
                    animation: `chevron 900ms ease-in-out ${
                      i * 120
                    }ms infinite`,
                  }}
                />
              </svg>
            ))}
          </div>
        )}

        {/* Hidden input for file selection */}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={onInputChange}
        />

        {/* NEW: 2s Uploading overlay */}
        {uploading && (
          <div
            aria-live="polite"
            className="absolute inset-0 z-10 grid place-items-center bg-white/75 backdrop-blur-sm"
          >
            <div className="w-[min(460px,90%)] rounded-2xl border border-zinc-200 bg-white shadow-lg p-5 text-center">
              <div className="text-sm font-semibold mb-3">Uploading…</div>

              <div className="relative h-2 w-full rounded-full bg-zinc-200 overflow-hidden">
                {/* Fill bar */}
                <div
                  className="h-full rounded-full"
                  style={{
                    background:
                      'linear-gradient(90deg, var(--color-fraction-violet-500,#3f3cbb), #9ca3af)',
                    animation: 'barFill 2s ease-out forwards',
                  }}
                />
                {/* Optional shimmer highlight */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -translate-x-full"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent, rgba(255,255,255,.6), transparent)',
                    animation: 'shimmer 1.2s ease-in-out 0.2s infinite',
                  }}
                />
              </div>

              <div className="mt-2 text-xs text-zinc-500">
                Please wait, processing files…
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Previews grid */}
      {previewItems.length > 0 && (
        <ul className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {previewItems.map(({ key, file, isImg, url, index }) => (
            <li key={key} className="group relative rounded-xl border p-3">
              {/* Image container is relative so the trash button can be precisely positioned */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-zinc-50 border-2 border-zinc-200 transition-all group-hover:border-[color:var(--color-fraction-violet-500,#3f3cbb)] group-hover:shadow-sm">
                {isImg && url ? (
                  <img
                    src={url}
                    alt={file.name}
                    className="h-full w-full object-contain"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500">
                    {file.name.split('.').pop()?.toUpperCase() ?? 'FILE'}
                  </div>
                )}

                {/* Delete button (always visible; not hover-gated) */}
                <button
                  type="button"
                  onClick={() => removeAt(index)}
                  className="
                    absolute top-3 right-3
                    inline-flex items-center justify-center
                    h-8 w-8 rounded-full
                    bg-white/90 backdrop-blur
                    border border-zinc-200 shadow-sm
                    text-red-600
                    hover:bg-white hover:shadow
                    focus:outline-none focus:ring-2 focus:ring-red-500/40
                    transition
                  "
                  aria-label={`Retirer ${file.name}`}
                  title="Retirer"
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </div>

              <div className="mt-2 truncate text-xs" title={file.name}>
                {file.name}
                <span className="ml-1 text-[10px] text-zinc-500">
                  ({toKB(file.size)})
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {errors.length > 0 && (
        <ul className="mt-2 list-disc pl-5 text-xs text-red-600">
          {errors.map((e, idx) => (
            <li key={idx}>{e}</li>
          ))}
        </ul>
      )}

      {hint && <span className="text-xs text-zinc-500">{hint}</span>}
    </div>
  );
}
