// src/features/auth/ConfirmPasswordResetPage.tsx
import { useEffect, useState } from 'react';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '../../firebase/firebase.ts';

export default function ConfirmPasswordResetPage() {
  // The oobCode token extracted from the URL query string
  const [code, setCode] = useState<string | null>(null);
  // New password entered by the user
  const [newPassword, setNewPassword] = useState('');
  // Track whether reset was successful
  const [done, setDone] = useState(false);
  // Track error messages (if any)
  const [err, setErr] = useState<string | null>(null);

  // On component mount, read the oobCode from the URL
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setCode(p.get('oobCode'));
  }, []);

  // Handle form submission
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!code) {
      setErr('Invalid code.');
      return;
    }
    try {
      // Call Firebase confirmPasswordReset with the code and new password
      await confirmPasswordReset(auth, code, newPassword);
      setDone(true);
    } catch (e: any) {
      setErr(e?.message ?? 'Unexpected error');
    }
  }

  // If password reset succeeded, show success message
  if (done)
    return (
      <p className="text-sm">
        Your new password has been set successfully. You can now log in.
      </p>
    );

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      {/* Input for new password */}
      <input
        type="password"
        placeholder="New password ..."
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full p-3 border rounded-lg"
        minLength={8}
        required
      />

      {/* Error message */}
      {err && <p className="text-xs text-red-600">{err}</p>}

      {/* Submit button */}
      <button
        type="submit"
        className="bg-[#3A3178] text-white rounded-[21.5px] px-4 py-2"
      >
        Confirm new password
      </button>
    </form>
  );
}
