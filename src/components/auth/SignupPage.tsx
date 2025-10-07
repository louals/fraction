// src/components/auth/SignupPage.tsx
import React, { useMemo, useState } from 'react';
import {
  FaGoogle,
  FaFacebook,
  FaApple,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';
import { auth } from '../../firebase/firebase.ts';
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  sendEmailVerification, // keep user signed in; redirect via next
} from 'firebase/auth';
import { ensureUserDoc } from './ensureUserDoc';
import {
  signInWithGoogle,
  signInWithFacebook,
  signInWithApple,
} from './socialAuth';

import phone from '../../assets/images/phone.png';
import logocomplet from '../../assets/images/logocomplet.png';
import { useNavigate } from 'react-router-dom';
import Loader from '../loading/logo_loader.tsx';

/** Basic email pattern for UI-level validation (Firebase also validates server-side) */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Sanitize e-mail: remove invisible unicode (RTL/zero-width), whitespace, normalize & lowercase */
const sanitizeEmail = (raw: string) =>
  raw
    .normalize('NFKC')
    .replace(/[\u200B-\u200D\u2060\uFEFF\u061C\u200E\u200F]/g, '')
    .replace(/\s+/g, '')
    .toLowerCase();

/**
 * SignupPage
 * - Email/password sign up with live password requirements
 * - Social sign up (Google, Facebook, Apple)
 * - Creates Firestore user doc; writes `status` only on first creation
 * - Password visibility toggle
 * - Email verification flow: keep user signed in; go to /verify-email?next=/
 */
const SignupPage = () => {
  // --- Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Account status (French options)
  const [status, setStatus] = useState<'acheteur' | 'vendeur'>('acheteur');

  // --- Checkboxes (consents/preferences)
  const [termsChecked, setTermsChecked] = useState(false);
  const [riskChecked, setRiskChecked] = useState(false);
  const [newsChecked, setNewsChecked] = useState(false);

  // --- UI state
  const [formError, setFormError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [pwFocused, setPwFocused] = useState(false);
  const [showPw, setShowPw] = useState(false); // Toggle password visibility

  const navigate = useNavigate();

  // --- Password live checks (computed)
  const checks = useMemo(() => {
    return {
      minLen: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /\d/.test(password),
      symbol: /[^A-Za-z0-9]/.test(password),
    };
  }, [password]);

  const allPasswordValid = useMemo(
    () => Object.values(checks).every(Boolean),
    [checks]
  );

  const inputBorderForPassword = useMemo(() => {
    if (password.length === 0 && !pwFocused) {
      return 'border-gray-300 focus:ring-[#a052e0]';
    }
    return allPasswordValid
      ? 'border-green-500 focus:ring-[#a052e0]'
      : 'border-fraction-light-600 focus:ring-[#a052e0]';
  }, [password.length, allPasswordValid, pwFocused]);

  // --- Social handlers: ensure user doc so `status` is captured on first creation
  async function onGoogle() {
    try {
      setLoading(true);
      await signInWithGoogle(auth, newsChecked);
      if (auth.currentUser) {
        await ensureUserDoc(auth.currentUser, {
          marketingOptIn: newsChecked,
          status,
        });
      }
      navigate('/');
    } catch (e: any) {
      setFormError(e?.message ?? 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  }
  async function onFacebook() {
    try {
      setLoading(true);
      await signInWithFacebook(auth, newsChecked);
      if (auth.currentUser) {
        await ensureUserDoc(auth.currentUser, {
          marketingOptIn: newsChecked,
          status,
        });
      }
      navigate('/');
    } catch (e: any) {
      setFormError(e?.message ?? 'Facebook sign-in failed');
    } finally {
      setLoading(false);
    }
  }
  async function onApple() {
    try {
      setLoading(true);
      await signInWithApple(auth, newsChecked);
      if (auth.currentUser) {
        await ensureUserDoc(auth.currentUser, {
          marketingOptIn: newsChecked,
          status,
        });
      }
      navigate('/');
    } catch (e: any) {
      setFormError(e?.message ?? 'Apple sign-in failed');
    } finally {
      setLoading(false);
    }
  }

  // --- Email/password submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');

    // Mandatory consents
    if (!termsChecked || !riskChecked) {
      setFormError('Please agree to the mandatory terms before signing up.');
      return;
    }

    // Password requirements
    if (!allPasswordValid) {
      setFormError('Please meet all password requirements.');
      return;
    }

    // Sanitize + basic email validation
    const cleanedEmail = sanitizeEmail(email);
    if (!cleanedEmail || !emailRegex.test(cleanedEmail)) {
      setFormError('Enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      // Create Firebase user
      const { user } = await createUserWithEmailAndPassword(
        auth,
        cleanedEmail,
        password
      );

      // Create/merge Firestore user profile (includes status + marketing flag)
      await ensureUserDoc(user, { marketingOptIn: newsChecked, status });

      // Send verification e-mail that redirects back to /verify-email with next=/
      await sendEmailVerification(user, {
        url: `${window.location.origin}/verify-email?next=/`,
        handleCodeInApp: false,
      });

      // Keep user signed in; take them to verify page (auto-redirect to / after success)
      navigate('/verify-email?next=/', { replace: true });

      // Reset form state (optional)
      setEmail('');
      setPassword('');
      setTermsChecked(false);
      setRiskChecked(false);
      setNewsChecked(false);
      setStatus('acheteur');
    } catch (error: any) {
      const code = error?.code as string | undefined;
      const providerLabel = (pid: string) =>
        pid === 'google.com'
          ? 'Google'
          : pid === 'facebook.com'
          ? 'Facebook'
          : pid === 'apple.com'
          ? 'Apple'
          : pid === 'password'
          ? 'Email/Password'
          : pid ?? 'provider';

      switch (code) {
        case 'auth/email-already-in-use': {
          try {
            const methods = await fetchSignInMethodsForEmail(
              auth,
              cleanedEmail
            );
            if (methods && methods.length > 0) {
              const hasPassword = methods.includes('password');
              const otherProviders = methods
                .filter((m) => m !== 'password')
                .map(providerLabel);

              if (hasPassword) {
                setFormError(
                  'This email is already registered. Please log in instead.'
                );
              } else if (otherProviders.length) {
                setFormError(
                  `This email is already registered with ${otherProviders.join(
                    ' / '
                  )}. Please use that to log in.`
                );
              } else {
                setFormError(
                  'This email is already registered. Try logging in or reset your password.'
                );
              }
            } else {
              setFormError(
                'This email is already registered. Try logging in or reset your password.'
              );
            }
          } catch {
            setFormError(
              'This email is already registered. Try logging in or reset your password.'
            );
          }
          break;
        }
        case 'auth/invalid-email':
          setFormError('Enter a valid email address.');
          break;
        case 'auth/weak-password':
          setFormError(
            'Password is too weak. Please meet the requirements below.'
          );
          break;
        case 'auth/network-request-failed':
          setFormError(
            'Network error. Please check your connection and try again.'
          );
          break;
        case 'auth/too-many-requests':
          setFormError('Too many attempts. Please try again later.');
          break;
        default:
          setFormError(
            error?.message ?? 'Something went wrong. Please try again.'
          );
      }
    } finally {
      setLoading(false);
    }
  };

  // --- Render
  return (
    <div
      className="min-h-[100svh] md:min-h-[100vh] w-full flex items-center justify-center px-4 md:px-8 py-8 sm:py-12 md:py-16 lg:py-20"
      style={{
        background: 'linear-gradient(135deg, #E4E5FF, #F3BBCE9D, #FF99A54D)',
        paddingTop: 'max(env(safe-area-inset-top), 1.5rem)',
        paddingBottom: 'max(env(safe-area-inset-bottom), 1.5rem)',
      }}
    >
      <div className="flex flex-col md:flex-row w-full max-w-[1600px] justify-between items-center">
        {/* Left - Form Card */}
        <div
          className="w-full md:w-6/12 bg-white rounded-3xl shadow-2xl flex flex-col justify-center p-6 md:p-12 mb-10 md:mb-0
+                 h-auto md:min-h-[790px] md:max-h-[calc(100svh-8rem)] md:overflow-y-auto pb-6"
        >
          {/* Logo + Title */}
          <div className="mb-6 text-center">
            <img
              src={logocomplet}
              alt="logo fraction"
              className="w-[200px] md:w-[299px] h-auto mx-auto"
            />
            <p className="text-[#FF99A5] text-2xl md:text-[32px] font-bold mt-2">
              Sign up
            </p>
          </div>

          {/* Social Login (icons only) */}
          <div className="mb-4 flex flex-col">
            <div className="flex justify-center gap-4">
              <button
                onClick={onGoogle}
                className="flex items-center justify-center transition-colors rounded-lg p-2 hover:bg-gray-100 disabled:opacity-50"
                disabled={loading}
                aria-label="Sign up with Google"
              >
                <FaGoogle size={40} />
              </button>
              <button
                onClick={onFacebook}
                className="flex items-center justify-center transition-colors rounded-lg p-2 hover:bg-gray-100 disabled:opacity-50"
                disabled={loading}
                aria-label="Sign up with Facebook"
              >
                <FaFacebook size={40} />
              </button>
              <button
                onClick={onApple}
                className="flex items-center justify-center transition-colors rounded-lg p-2 hover:bg-gray-100 disabled:opacity-50"
                disabled={loading}
                aria-label="Sign up with Apple"
              >
                <FaApple size={40} />
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <hr className="flex-1 border-transparent" />
            <span className="text-[#FF99A5] text-xl md:text-[32px] font-semibold">
              or
            </span>
            <hr className="flex-1 border-transparent" />
          </div>

          {/* Email + Password form */}
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
            noValidate
          >
            {/* Email input */}
            <input
              type="email"
              placeholder="Enter e-mail here ..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a052e0] placeholder-gray-400"
              required
              inputMode="email"
              autoComplete="email"
            />

            {/* Password input + eye icon + live requirements */}
            <div className="space-y-2">
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Password ..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPwFocused(true)}
                  onBlur={() => setPwFocused(false)}
                  className={`w-full h-12 p-3 pr-11 border rounded-lg focus:outline-none focus:ring-2 placeholder-gray-400 ${inputBorderForPassword}`}
                  minLength={8}
                  required
                  aria-describedby="pw-reqs"
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                  disabled={loading}
                >
                  {showPw ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {(pwFocused || password.length > 0) && (
                <ul
                  id="pw-reqs"
                  className="text-sm space-y-1"
                  aria-live="polite"
                  role="list"
                >
                  <li
                    className={`flex items-center gap-2 ${
                      checks.minLen
                        ? 'text-green-600'
                        : 'text-fraction-light-600'
                    }`}
                  >
                    {checks.minLen ? <FaCheckCircle /> : <FaTimesCircle />}
                    <span>Use at least 8 characters</span>
                  </li>
                  <li
                    className={`flex items-center gap-2 ${
                      checks.upper
                        ? 'text-green-600'
                        : 'text-fraction-light-600'
                    }`}
                  >
                    {checks.upper ? <FaCheckCircle /> : <FaTimesCircle />}
                    <span>Add at least one uppercase letter</span>
                  </li>
                  <li
                    className={`flex items-center gap-2 ${
                      checks.lower
                        ? 'text-green-600'
                        : 'text-fraction-light-600'
                    }`}
                  >
                    {checks.lower ? <FaCheckCircle /> : <FaTimesCircle />}
                    <span>Add at least one lowercase letter</span>
                  </li>
                  <li
                    className={`flex items-center gap-2 ${
                      checks.number
                        ? 'text-green-600'
                        : 'text-fraction-light-600'
                    }`}
                  >
                    {checks.number ? <FaCheckCircle /> : <FaTimesCircle />}
                    <span>Add at least one number</span>
                  </li>
                  <li
                    className={`flex items-center gap-2 ${
                      checks.symbol
                        ? 'text-green-600'
                        : 'text-fraction-light-600'
                    }`}
                  >
                    {checks.symbol ? <FaCheckCircle /> : <FaTimesCircle />}
                    <span>Add at least one symbol</span>
                  </li>
                </ul>
              )}
            </div>

            {/* Account status (French) */}
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-gray-700">
                Statut du compte
              </legend>
              <div className="flex items-center gap-6">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="acheteur"
                    checked={status === 'acheteur'}
                    onChange={() => setStatus('acheteur')}
                    className="w-4 h-4 accent-[#3A3178]"
                  />
                  <span>Acheteur</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="vendeur"
                    checked={status === 'vendeur'}
                    onChange={() => setStatus('vendeur')}
                    className="w-4 h-4 accent-[#3A3178]"
                  />
                  <span>Vendeur</span>
                </label>
              </div>
            </fieldset>

            {/* Consents / Preferences */}
            <div className="flex flex-col gap-2 mt-2">
              <label className="flex items-center gap-2 text-gray-700 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsChecked}
                  onChange={() => setTermsChecked(!termsChecked)}
                  className="w-4 h-4 accent-[#3A3178]"
                  required
                />
                I have read and I agree with the terms of confidentiality
              </label>

              <label className="flex items-center gap-2 text-gray-700 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={riskChecked}
                  onChange={() => setRiskChecked(!riskChecked)}
                  className="w-4 h-4 accent-[#3A3178]"
                  required
                />
                I’m conscious of the risk of investments
              </label>

              <label className="flex items-center gap-2 text-gray-700 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={newsChecked}
                  onChange={() => setNewsChecked(!newsChecked)}
                  className="w-4 h-4 accent-[#3A3178]"
                />
                I want to receive news about fractions
              </label>
            </div>

            {/* Form-level error */}
            {formError && (
              <p className="text-xs text-red-600" aria-live="polite">
                {formError}
              </p>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={
                loading || !termsChecked || !riskChecked || !allPasswordValid
              }
              className={`w-full md:w-[230px] bg-[#3A3178] text-white py-3 rounded-[21.5px] mx-auto mt-3 transition flex justify-center items-center ${
                loading || !termsChecked || !riskChecked || !allPasswordValid
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:opacity-90'
              }`}
            >
              {loading ? <Loader /> : 'Sign up'}
            </button>

            {/* Link to login */}
            <p className="text-center text-sm text-gray-600 mt-2">
              Go to{' '}
              <a
                href="/login"
                className="text-[#3b3b64] font-medium hover:underline"
              >
                Login
              </a>
            </p>
          </form>
        </div>

        {/* Right - Phone mockup with floating rectangles */}
        <div className="hidden md:flex w-full md:w-5/12 items-center justify-end relative">
          <div className="relative">
            <img
              src={phone}
              alt="Phone Mockup"
              className="relative z-10 w-[300px] md:w-[458px] h-auto mr-4 md:mr-12"
            />
          </div>
          <div className="absolute top-[60%] right-[60%] w-[138px] h-[82px] rounded-lg border border-white/60 backdrop-blur-[2px] bg-white/60 shadow-lg z-50" />
          <div className="absolute top-[16%] right-[15%] w-[98px] h-[56px] rounded-lg border border-white/60 backdrop-blur-[2px] bg-white/70 shadow-lg z-20" />
          <div className="absolute top-[18%] right-[25%] w-16 h-12 rounded-lg border border-white/60 backdrop-blur-[2px] bg-white/60 shadow-lg" />
          <div className="absolute top-[12%] left-[38%] w-[26px] h-[21px] rounded-[5px] border border-white/60 backdrop-blur-[2px] bg-white/60 shadow-lg z-40" />
          <div className="absolute top-[15%] left-[33%] w-[47px] h-[39px] rounded-lg border border-white/60 backdrop-blur-[2px] bg-white/60 shadow-lg z-30" />
          <div className="absolute top-[19%] left-[36%] w-[60px] h-[40px] rounded-[5px] border border-white/60 backdrop-blur-[2px] bg-white/60 shadow-lg z-0" />
          <div className="absolute bottom-[33%] right-[76%] w-[86px] h-[74px] rounded-[10px] border border-white/60 backdrop-blur-[2px] bg-white/60 shadow-lg z-50" />
          <div className="absolute top-[10%] right-[12%] w-[56px] h-[40px] rounded-lg border border-white/60 backdrop-blur-[2px] bg-white/60 shadow-lg z-30" />
          <div className="absolute top-[5%] right-[18%] w-[40px] h-[40px] rounded-lg border border-white/60 backdrop-blur-[2px] bg-white/60 shadow-lg z-50" />
          <div className="absolute top-[55%] right-[57%] w-[40px] h-[40px] rounded-lg border border-white/60 backdrop-blur-[2px] bg-white/60 shadow-lg z-20" />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
