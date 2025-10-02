// src/features/auth/RequestPasswordResetForm.tsx
import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase/firebase.ts';
import phone from '../../assets/images/phone.png';
import logocomplet from '../../assets/images/logocomplet.png';

export default function RequestPasswordResetForm() {
  // State for form inputs and UI states
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle password reset request
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/reset-password`,
        handleCodeInApp: true,
      });
      setSent(true);
    } catch (e: any) {
      const code = e?.code as string | undefined;
      if (code === 'auth/user-not-found')
        setErr('No account found with this email.');
      else if (code === 'auth/invalid-email') setErr('Email is invalid.');
      else setErr(e?.message ?? 'Unexpected error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 md:px-8"
      style={{
        background: 'linear-gradient(135deg, #E4E5FF, #F3BBCE9D, #FF99A54D)',
      }}
    >
      <div className="flex flex-col md:flex-row w-full max-w-[1600px] justify-between items-center">
        {/* Left — Form card */}
        <div className="w-full md:w-6/12 bg-white shadow-2xl flex flex-col justify-center px-6 md:px-12 pt-0 pb-6 md:pb-12 h-auto md:h-[790px]">
          {/* Logo + Title */}
          <div className="mb-24 text-center">
            <img
              src={logocomplet}
              alt="logo fraction"
              className="w-[200px] md:w-[299px] h-auto mx-auto"
            />
            <p className="text-[#FF99A5] text-2xl md:text-[32px] font-bold mt-2">
              Reset password
            </p>
          </div>

          {/* Success state */}
          {sent ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-green-700">
                A password reset link has been sent to your email. Please check
                your inbox (and spam).
              </p>
              <a
                href="/login"
                className="inline-block bg-[#3A3178] text-white py-3 px-6 rounded-[21.5px] hover:opacity-90 transition"
              >
                Back to Log in
              </a>
            </div>
          ) : (
            // Password reset form (email input only)
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              <div>
                <input
                  type="email"
                  placeholder="Enter e-mail here ..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 placeholder-gray-400
                              ${
                                err
                                  ? 'border-red-500 focus:ring-red-400'
                                  : 'border-gray-300 focus:ring-[#a052e0]'
                              }`}
                  required
                  aria-invalid={!!err}
                />
                {err && (
                  <p className="mt-1 text-xs text-red-600" aria-live="polite">
                    {err}
                  </p>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="
  w-full md:w-[300px] mx-auto
  py-3 rounded-[21.5px]
  bg-[#3A3178] text-white
  hover:opacity-90 disabled:opacity-60
  transition
"
              >
                {loading ? 'Sending…' : 'Send password reset link'}
              </button>

              {/* Helper links */}
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

        {/* Right — Phone mockup (for design consistency with login) */}
        <div className="hidden md:flex w-full md:w-5/12 items-center justify-end relative">
          <div className="relative">
            <img
              src={phone}
              alt="Phone Mockup"
              className="relative z-10 w-[300px] md:w-[458px] h-auto mr-4 md:mr-12"
            />
          </div>
          {/* Decorative floating elements */}
          <div className="absolute top-[60%] right-[60%] w-[138px] h-[82px] rounded-lg border border-white/60 backdrop-blur-[2px] bg-white/60 shadow-lg z-50" />
          <div className="absolute top-[16%] right-[15%] w-[98px] h-[56px] rounded-lg border border-white/60 backdrop-blur-[2px] bg-white/70 shadow-lg z-20" />
          <div className="absolute top-[18%] right-[25%] w-16 h-12 rounded-lg border border-white/60 backdrop-blur-[2px] bg-white/60 shadow-lg" />
          <div className="absolute top-[12%] left-[38%] w-[26px] h-[21px] rounded-[5px] border border-white/60 backdrop-blur-[2px] bg-white/60 shadow-lg z-40" />
          <div className="absolute top-[15%] left-[33%] w-[47px] h-[39px] rounded-lg border border-white/60 backdrop-blur-[2px] bg-white/60 shadow-lg z-30" />
          <div className="absolute top-[18%] left-[36%] w-[60px] h-[40px] rounded-[5px] border border-white/60 backdrop-blur-[2px] bg-white/60 shadow-lg z-0" />
          <div className="absolute bottom-[33%] right-[76%] w-[86px] h-[74px] rounded-[10px] border border-white/60 backdrop-blur-[2px] bg-white/60 shadow-lg z-50" />
          <div className="absolute top-[10%] right-[12%] w-[56px] h-[40px] rounded-lg border border-white/60 backdrop-blur-[2px] bg-white/60 shadow-lg z-30" />
          <div className="absolute top-[5%] right-[18%] w-[40px] h-[40px] rounded-lg border border-white/60 backdrop-blur-[2px] bg-white/60 shadow-lg z-50" />
          <div className="absolute top-[55%] right-[57%] w-[40px] h-[40px] rounded-lg border border-white/60 backdrop-blur-[2px] bg-white/60 shadow-lg z-20" />
        </div>
      </div>
    </div>
  );
}
