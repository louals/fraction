// src/features/auth/ConfirmPasswordResetPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '../../firebase/firebase.ts';
import logocomplet from '../../assets/images/logocomplet.png';

export default function ConfirmPasswordResetPage() {
  // Read action code (oobCode) from query string
  const [params] = useSearchParams();
  const oobCode = params.get('oobCode') || '';
  const navigate = useNavigate();

  // Async verification state
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState<string | null>(null);

  // Form and UI state
  const [newPassword, setNewPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // Verify the reset link (action code) on mount
  useEffect(() => {
    async function run() {
      if (!oobCode) {
        setErr('Invalid reset link (missing code).');
        setChecking(false);
        return;
      }
      try {
        // Verify the code and retrieve the email associated with it
        const mail = await verifyPasswordResetCode(auth, oobCode);
        setEmail(mail);
      } catch (e: any) {
        // Map Firebase error codes to friendly messages
        const code = e?.code as string | undefined;
        if (code === 'auth/expired-action-code')
          setErr('This link has expired. Please request a new reset email.');
        else if (code === 'auth/invalid-action-code')
          setErr('This reset link is invalid or already used.');
        else setErr(e?.message ?? 'Failed to verify reset link.');
      } finally {
        setChecking(false);
      }
    }
    run();
  }, [oobCode]);

  // Submit new password to Firebase using the verified action code
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setSubmitting(true);
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setDone(true);
      // Small delay to show success message before redirecting
      setTimeout(() => navigate('/login', { replace: true }), 1200);
    } catch (e: any) {
      // Map Firebase error codes to user-friendly messages
      const code = e?.code as string | undefined;
      if (code === 'auth/weak-password')
        setErr('Password is too weak (min 6 characters).');
      else if (code === 'auth/expired-action-code')
        setErr('This link has expired. Please request a new reset email.');
      else if (code === 'auth/invalid-action-code')
        setErr('This reset link is invalid or already used.');
      else setErr(e?.message ?? 'Reset failed.');
    } finally {
      setSubmitting(false);
    }
  }

  // Loading state — shows while validating the reset link
  if (checking) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{
          background: 'linear-gradient(135deg, #E4E5FF, #F3BBCE9D, #FF99A54D)',
        }}
      >
        <div className="bg-white shadow-2xl w-full max-w-xl px-6 md:px-12 py-10">
          <p className="text-sm text-gray-700">Validating reset link…</p>
        </div>
      </div>
    );
  }

  // Error state — shows error and a helper link to request a new code
  if (err) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{
          background: 'linear-gradient(135deg, #E4E5FF, #F3BBCE9D, #FF99A54D)',
        }}
      >
        <div className="bg-white shadow-2xl w-full max-w-xl px-6 md:px-12 py-10">
          <p className="text-sm text-red-600">{err}</p>
          <a
            href="/forgot-password"
            className="inline-block mt-4 text-[#3b3b64] hover:underline"
          >
            Request a new reset link
          </a>
        </div>
      </div>
    );
  }

  // Success state — password updated, then redirect to login
  if (done) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{
          background: 'linear-gradient(135deg, #E4E5FF, #F3BBCE9D, #FF99A54D)',
        }}
      >
        <div className="bg-white shadow-2xl w-full max-w-xl px-6 md:px-12 py-10 text-center">
          <p className="text-sm text-green-700">
            Your new password has been set successfully. Redirecting to login…
          </p>
        </div>
      </div>
    );
  }

  // Main form — set a new password
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4"
      style={{
        background: 'linear-gradient(135deg, #E4E5FF, #F3BBCE9D, #FF99A54D)',
      }}
    >
      <div className="bg-white shadow-2xl w-full max-w-xl px-6 md:px-12 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <img
            src={logocomplet}
            alt="Fraction logo"
            className="w-[200px] md:w-[260px] h-auto mx-auto"
          />
          <p className="text-[#FF99A5] text-2xl md:text-[28px] font-bold mt-3">
            Set a new password
          </p>
          {email && (
            <p className="text-xs text-gray-600 mt-1">
              for <strong>{email}</strong>
            </p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm">New password</span>
            <input
              type="password"
              placeholder="New password ..."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 border-gray-300 focus:ring-[#a052e0]"
              minLength={8}
              required
            />
          </label>

          {/* Password hint */}
          <p className="text-[11px] text-gray-500">
            Use at least 8 characters. Avoid common or reused passwords.
          </p>

          {/* Submit button */}
          <button
            type="submit"
            disabled={submitting}
            className="
              w-full md:w-[300px] mx-auto
              py-3 rounded-[21.5px]
              bg-[#3A3178] text-white
              hover:opacity-90 disabled:opacity-60
              transition
              flex items-center justify-center
            "
          >
            {submitting ? 'Resetting…' : 'Confirm new password'}
          </button>

          {/* Back to login link */}
          <div className="text-center text-sm text-gray-600 mt-3">
            <a
              href="/login"
              className="text-[#3b3b64] font-medium hover:underline"
            >
              Back to Log in
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
