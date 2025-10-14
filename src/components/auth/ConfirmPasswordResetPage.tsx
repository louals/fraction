import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '../../firebase/firebase.ts';
import logocomplet from '../../assets/images/logocomplet.png';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

/** Map Firebase Auth error codes to readable messages */
function mapResetError(code?: string): string {
  switch (code) {
    case 'auth/expired-action-code':
      return 'This link has expired. Please request a new one.';
    case 'auth/invalid-action-code':
      return 'This link is invalid or already used.';
    case 'auth/weak-password':
      return 'Password is too weak (min 8 characters).';
    default:
      return 'Something went wrong. Try again.';
  }
}

export default function ConfirmPasswordResetPage() {
  // Get query parameters from URL (Firebase oobCode)
  const [params] = useSearchParams();
  const oobCode = params.get('oobCode') || '';
  const navigate = useNavigate();

  // Component state management
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  /** Verify reset code from Firebase when component mounts */
  useEffect(() => {
    async function run() {
      if (!oobCode) {
        setErr('Invalid or missing reset code.');
        setChecking(false);
        return;
      }
      try {
        const mail = await verifyPasswordResetCode(auth, oobCode);
        setEmail(mail);
      } catch (e: any) {
        setErr(mapResetError(e?.code));
      } finally {
        setChecking(false);
      }
    }
    run();
  }, [oobCode]);

  /** Define password rules (same as in signup page) */
  const checks = useMemo(
    () => ({
      minLen: newPassword.length >= 8,
      upper: /[A-Z]/.test(newPassword),
      lower: /[a-z]/.test(newPassword),
      number: /\d/.test(newPassword),
      symbol: /[^A-Za-z0-9]/.test(newPassword),
    }),
    [newPassword]
  );

  /** Check if all password rules are valid */
  const allValid = useMemo(
    () => Object.values(checks).every(Boolean),
    [checks]
  );

  /** Handle password reset form submission */
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!allValid) return setErr('Please meet all password requirements.');
    if (newPassword !== confirm)
      return setErr('Password confirmation does not match.');

    setSubmitting(true);
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setDone(true);
      // Redirect to login after success
      setTimeout(() => navigate('/login', { replace: true }), 1500);
    } catch (e: any) {
      setErr(mapResetError(e?.code));
    } finally {
      setSubmitting(false);
    }
  }

  /** Show loading screen while verifying reset link */
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E4E5FF] via-[#F3BBCE9D] to-[#FF99A54D]">
        <p className="text-gray-700 text-sm">Validating link...</p>
      </div>
    );
  }

  /** Show confirmation when password is successfully updated */
  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E4E5FF] via-[#F3BBCE9D] to-[#FF99A54D]">
        <p className="text-green-700 text-sm">
          Password successfully updated. Redirecting to login...
        </p>
      </div>
    );
  }

  /** Show error state when verification fails */
  if (err && !email) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#E4E5FF] via-[#F3BBCE9D] to-[#FF99A54D] text-center">
        <p className="text-red-600 text-sm mb-4">{err}</p>
        <a
          href="/forgot-password"
          className="text-[#3b3b64] text-sm hover:underline"
        >
          Request a new link
        </a>
      </div>
    );
  }

  /** Main render: password reset form */
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4"
      style={{
        background: 'linear-gradient(135deg, #E4E5FF, #F3BBCE9D, #FF99A54D)',
      }}
    >
      <div className="bg-white shadow-2xl w-full max-w-xl px-6 md:px-12 py-10 ">
        {/* Header: logo + title */}
        <div className="text-center mb-8">
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

        {/* Password reset form */}
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          {/* New password input */}
          <label className="block">
            <span className="text-sm">New password</span>
            <input
              type="password"
              placeholder="New password ..."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 w-full h-12 p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#a052e0]"
              minLength={8}
              required
              autoComplete="new-password"
              aria-describedby="pw-reqs"
            />
          </label>

          {/* Password requirement checklist */}
          <ul id="pw-reqs" className="text-sm space-y-1" aria-live="polite">
            <li
              className={`flex items-center gap-2 ${
                checks.minLen ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              {checks.minLen ? <FaCheckCircle /> : <FaTimesCircle />} Use at
              least 8 characters
            </li>
            <li
              className={`flex items-center gap-2 ${
                checks.upper ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              {checks.upper ? <FaCheckCircle /> : <FaTimesCircle />} Add at
              least one uppercase letter
            </li>
            <li
              className={`flex items-center gap-2 ${
                checks.lower ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              {checks.lower ? <FaCheckCircle /> : <FaTimesCircle />} Add at
              least one lowercase letter
            </li>
            <li
              className={`flex items-center gap-2 ${
                checks.number ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              {checks.number ? <FaCheckCircle /> : <FaTimesCircle />} Add at
              least one number
            </li>
            <li
              className={`flex items-center gap-2 ${
                checks.symbol ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              {checks.symbol ? <FaCheckCircle /> : <FaTimesCircle />} Add at
              least one symbol
            </li>
          </ul>

          {/* Confirm password input */}
          <label className="block">
            <span className="text-sm">Confirm new password</span>
            <input
              type="password"
              placeholder="Confirm password ..."
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-1 w-full h-12 p-3 border rounded-lg border-fraction-gray-300 focus:outline-none focus:ring-2 focus:ring-[#a052e0]"
              required
            />
          </label>

          {/* Error message display */}
          {err && (
            <p className="text-xs text-red-600" aria-live="polite">
              {err}
            </p>
          )}

          {/* Submit button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={submitting}
              className="w-[220px] md:w-[250px] py-2.5 rounded-[21.5px] bg-fraction-violet-500 text-white text-sm md:text-base 
               hover:opacity-90 disabled:opacity-60 transition text-center"
            >
              {submitting ? 'Resetting…' : 'Confirm new password'}
            </button>
          </div>

          {/* Navigation link back to login */}
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
