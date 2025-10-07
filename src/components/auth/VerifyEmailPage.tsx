// src/components/auth/VerifyEmailPage.tsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { applyActionCode, sendEmailVerification } from 'firebase/auth';
import { auth } from '../../firebase/firebase';

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const oobCode = params.get('oobCode');
  const next = params.get('next') || '/';

  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<
    'verifying' | 'notice' | 'success' | 'error'
  >(oobCode ? 'verifying' : 'notice');
  const [message, setMessage] = useState<string>('');

  // --- If opened from verification link (contains oobCode)
  useEffect(() => {
    if (!oobCode) return;
    (async () => {
      try {
        setLoading(true);
        await applyActionCode(auth, oobCode);
        await auth.currentUser?.reload().catch(() => {});
        setMode('success');
        setMessage('Your email has been verified. You can now continue.');
        setTimeout(() => navigate(next, { replace: true }), 1200);
      } catch (err) {
        console.error(err);
        setMode('error');
        setMessage(
          'Invalid or expired link. Please request a new verification email.'
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [oobCode, next, navigate]);

  // --- Auto-refresh when returning to tab
  useEffect(() => {
    if (oobCode) return;
    const onFocus = async () => {
      try {
        await auth.currentUser?.reload();
        if (auth.currentUser?.emailVerified) navigate(next, { replace: true });
      } catch {}
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [oobCode, next, navigate]);

  // --- Resend email
  const handleResend = async () => {
    const user = auth.currentUser;
    if (!user) {
      setMode('error');
      setMessage('You must be signed in to resend the verification email.');
      return;
    }
    try {
      setLoading(true);
      await sendEmailVerification(user, {
        url: `${window.location.origin}/verify-email?next=${encodeURIComponent(
          next
        )}`,
        handleCodeInApp: false,
      });
      setMode('notice');
      setMessage('Verification email sent again. Please check your inbox.');
    } catch (e) {
      console.error(e);
      setMode('error');
      setMessage('Unable to send verification email. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  // --- Manual check button
  const handleCheck = async () => {
    try {
      setLoading(true);
      await auth.currentUser?.reload();
      if (auth.currentUser?.emailVerified) navigate(next, { replace: true });
      else
        setMessage(
          'Your email is not verified yet. Try again in a few seconds.'
        );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#E4E5FF] via-[#F3BBCE9D] to-[#FF99A54D] px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-[#3A3178] mb-3">
          Email Verification
        </h1>

        {mode === 'verifying' && (
          <p className="text-gray-700">Verifying your email, please wait...</p>
        )}

        {mode === 'success' && (
          <div className="space-y-4">
            <p className="text-green-600 font-medium">
              ✅ Your email has been verified.
            </p>
            <p className="text-gray-700">
              You can now sign in with your new account.
            </p>
            <button
              onClick={() => navigate(next, { replace: true })}
              className="w-full rounded-full bg-[#3A3178] text-white py-3 font-medium hover:opacity-90 transition"
            >
              Continue
            </button>
          </div>
        )}

        {mode === 'notice' && (
          <div className="space-y-4">
            <p className="text-gray-700">
              We have sent a verification link to your email. Please check your
              inbox and spam folder. Once verified, return to this tab and click
              the button below.
            </p>
            {message && <p className="text-blue-600 text-sm">{message}</p>}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleCheck}
                disabled={loading}
                className="w-full rounded-full border border-[#3A3178]/40 text-[#3A3178] py-3 font-medium hover:bg-[#3A3178]/10 transition disabled:opacity-50"
              >
                I’m verified
              </button>
              <button
                onClick={handleResend}
                disabled={loading}
                className="w-full rounded-full border border-[#3A3178]/40 text-[#3A3178] py-3 font-medium hover:bg-[#3A3178]/10 transition disabled:opacity-50"
              >
                Resend verification email
              </button>
            </div>
          </div>
        )}

        {mode === 'error' && (
          <div className="space-y-4">
            <p className="text-red-600 font-medium">{message}</p>
            <button
              onClick={handleResend}
              disabled={loading}
              className="w-full rounded-full border border-[#3A3178]/40 text-[#3A3178] py-3 font-medium hover:bg-[#3A3178]/10 transition disabled:opacity-50"
            >
              Resend verification email
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
