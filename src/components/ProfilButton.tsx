// src/components/ProfilButton.tsx
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';

/** Detect if the device supports hover (desktop/laptop/trackpad) */
function useSupportsHover() {
  const [supportsHover, setSupportsHover] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(hover: hover)');

    const update = () => setSupportsHover(!!mq.matches);
    update();

    // Add listener with fallback for older Safari
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', update);
      return () => mq.removeEventListener('change', update);
    } else {
      // @ts-ignore deprecated but safe fallback
      mq.addListener(update);
      // @ts-ignore
      return () => mq.removeListener(update);
    }
  }, []);

  return supportsHover;
}

export default function ProfilButton() {
  const [open, setOpen] = useState(false);
  const popRef = useRef<HTMLDivElement>(null);
  const supportsHover = useSupportsHover();

  // Close on outside click & Escape
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!popRef.current) return;
      if (!popRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  async function handleLogout() {
    try {
      await signOut(auth);
    } finally {
      setOpen(false);
    }
  }

  const btnId = 'profile-menu-button';
  const menuId = 'profile-menu';

  return (
    <div
      ref={popRef}
      className="relative"
      // Open/close by hover for pointer devices
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      // Open with keyboard focus, close when focus leaves the whole popover
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!popRef.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      {/* Trigger */}
      <button
        id={btnId}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        // On touch devices (no hover), toggle on click
        onClick={() => {
          if (!supportsHover) setOpen((v) => !v);
        }}
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

      {/* Dropdown */}
      {open && (
        <div
          id={menuId}
          role="menu"
          aria-labelledby={btnId}
          className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-200 bg-white
                     p-1.5 shadow-lg ring-1 ring-black/5 z-50"
        >
          <Link
            to="/dashboard"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block w-full rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Profile
          </Link>

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
