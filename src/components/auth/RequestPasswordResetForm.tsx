import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase/firebase.ts';
import phone from '../../assets/images/phone.png';
import logocomplet from '../../assets/images/logocomplet.png';

/** Map Firebase Auth error codes to friendly messages for the user */
function mapResetError(code?: string): string {
  switch (code) {
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/invalid-email':
      return 'Email address is invalid.';
    case 'auth/missing-email':
      return 'Please enter your email.';
    case 'auth/network-request-failed':
      return 'Network issue. Check your connection.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

export default function RequestPasswordResetForm() {
  // Controlled input state for the email field
  const [email, setEmail] = useState('');
  // Whether the reset link has been sent successfully
  const [sent, setSent] = useState(false);
  // Error message to display (if any)
  const [err, setErr] = useState<string | null>(null);
  // Loading flag while calling Firebase
  const [loading, setLoading] = useState(false);

  /** Handle form submit: calls Firebase to send a password reset email */
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim(), {
        url: 'http://localhost:5173/reset-password', // dev
        handleCodeInApp: true,
      });
      setSent(true);
    } catch (e: any) {
      // Store a user-friendly error based on Firebase error code
      setErr(mapResetError(e?.code));
    } finally {
      // Always stop loading regardless of success/failure
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-[100svh] md:min-h-[100vh] w-full flex items-center justify-center px-4 md:px-8 py-6 md:py-10"
      style={{
        background: 'linear-gradient(135deg, #E4E5FF, #F3BBCE9D, #FF99A54D)',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex flex-col md:flex-row w-full max-w-[1600px] justify-between items-center">
        {/* Left card: logo + form content */}
        <div className="w-full md:w-6/12 bg-white shadow-2xl flex flex-col justify-center p-6 md:p-12 h-auto md:h-[790px]">
          {/* Brand / heading */}
          <div className="mb-16 text-center">
            <img
              src={logocomplet}
              alt="logo fraction"
              className="w-[200px] md:w-[299px] h-auto mx-auto"
            />
            <p className="text-[#FF99A5] text-2xl md:text-[32px] font-bold mt-2">
              Reset password
            </p>
          </div>

          {/* Success state: show confirmation and a link back to login */}
          {sent ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-green-700">
                A password reset link has been sent to your email. Please check
                your inbox (and spam).
              </p>
              <a
                href="/login"
                className="inline-block bg-fraction-violet-500 text-white py-3 px-6 rounded-[21.5px] hover:opacity-90 transition"
              >
                Back to Log in
              </a>
            </div>
          ) : (
            // Default state: render the request form
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              <div>
                {/* Email input (controlled) */}
                <input
                  type="email"
                  placeholder="Enter e-mail here ..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 placeholder-gray-400 ${
                    err
                      ? 'border-red-500 focus:ring-red-400'
                      : 'border-gray-300 focus:ring-[#a052e0]'
                  }`}
                  required
                  aria-invalid={!!err}
                  autoComplete="email"
                />
                {/* Inline error message (if any) */}
                {err && (
                  <p className="mt-1 text-xs text-red-600" aria-live="polite">
                    {err}
                  </p>
                )}
              </div>

              {/* Submit button; disabled while loading */}
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-[300px] mx-auto py-3 rounded-[21.5px] bg-fraction-violet-500 text-white hover:opacity-90 disabled:opacity-60 transition"
              >
                {loading ? 'Sending…' : 'Send password reset link'}
              </button>

              {/* Secondary links: login / signup */}
              <p className="text-center text-sm text-gray-600 mt-2">
                Remembered it?{' '}
                <a
                  href="/login"
                  className="text-[#3b3b64] font-medium hover:underline"
                >
                  Log in
                </a>
              </p>
              <p className="text-center text-sm text-gray-600">
                New here?{' '}
                <a
                  href="/signup"
                  className="text-[#3b3b64] font-medium hover:underline"
                >
                  Create an account
                </a>
              </p>
            </form>
          )}
        </div>

        {/* Right side: phone mockup illustration (desktop only) */}
        <div className="hidden md:flex w-full md:w-5/12 items-center justify-end relative">
          <div className="relative">
            <img
              src={phone}
              alt="Phone Mockup"
              className="relative z-10 w-[300px] md:w-[458px] h-auto mr-4 md:mr-12"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
