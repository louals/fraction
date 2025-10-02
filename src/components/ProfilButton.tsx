import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';

export default function ProfilButton() {
  // State for controlling dropdown visibility
  const [open, setOpen] = useState(false);

  // Ref to detect clicks outside the dropdown
  const popRef = useRef<HTMLDivElement>(null);

  // Handle closing dropdown on outside click or Escape key
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!popRef.current) return;
      if (!popRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);

    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);

    // Cleanup listeners on unmount
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  // Handle user logout and close the dropdown
  async function handleLogout() {
    try {
      await signOut(auth);
    } finally {
      setOpen(false);
    }
  }

  return (
    <div ref={popRef} className="relative">
      {/* Profile button with avatar and dropdown arrow */}
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full p-1.5
                   focus-visible:outline-none focus-visible:ring-2
                   focus-visible:ring-[var(--color-fraction-violet-500,#7c3aed)]/50"
      >
        <img
          src="/assets/img/icone-account.svg"
          alt="Account"
          className="h-12 w-12"
        />
        <svg
          className={`h-8 w-8 text-purple-500 transition ${
            open ? 'rotate-180' : ''
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-200 bg-white
                     p-1.5 shadow-lg ring-1 ring-black/5 z-50"
        >
          {/* Link to profile/dashboard */}
          <Link
            to="/dashboard"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block w-full rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Profile
          </Link>

          {/* Log out button */}
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="block w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
