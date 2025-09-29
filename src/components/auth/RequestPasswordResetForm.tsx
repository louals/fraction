// src/features/auth/RequestPasswordResetForm.tsx
import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase/firebase.ts';

export default function RequestPasswordResetForm() {
  // Track email input value
  const [email, setEmail] = useState('');
  // Track whether reset email has been successfully sent
  const [sent, setSent] = useState(false);
  // Track error messages (if any)
  const [err, setErr] = useState<string | null>(null);

  // Handle form submit for password reset request
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    try {
      // Firebase method to send password reset email
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (e: any) {
      // Capture Firebase error message or fallback text
      setErr(e?.message ?? 'Unexpected error');
    }
  }

  // If email was successfully sent, show confirmation message
  if (sent)
    return (
      <p className="text-sm">
        A password reset link has been sent to your email.
      </p>
    );

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      {/* Email input field */}
      <input
        type="email"
        placeholder="Enter e-mail here ..."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 border rounded-lg"
        required
      />

      {/* Error message */}
      {err && <p className="text-xs text-red-600">{err}</p>}

      {/* Submit button */}
      <button
        type="submit"
        className="bg-[#3A3178] text-white rounded-[21.5px] px-4 py-2"
      >
        Send password reset link
      </button>
    </form>
  );
}
