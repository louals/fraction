// src/components/auth/LoginPage.tsx
import React, { useState } from 'react';
import {
  FaGoogle,
  FaFacebook,
  FaApple,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  fetchSignInMethodsForEmail,
} from 'firebase/auth';
import { auth } from '../../firebase/firebase.ts';
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

// Basic e-mail pattern used for UI validation (Firebase still validates on server)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Remove invisible unicode (RTL/zero-width), all whitespace and normalize casing.
 * This fixes cases where Firebase returns "invalid-email" although the visible text looks fine.
 */
const sanitizeEmail = (raw: string) =>
  raw
    .normalize('NFKC')
    .replace(/[\u200B-\u200D\u2060\uFEFF\u061C\u200E\u200F]/g, '')
    .replace(/\s+/g, '')
    .toLowerCase();

export default function LoginPage() {
  // ----- Form state
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string>('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  // UI helpers
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [capsOn, setCapsOn] = useState(false);

  const navigate = useNavigate();

  // ----- Simple client-side validators
  function validateEmail(value: string): string {
    if (!value) return 'Please enter your email.';
    if (!emailRegex.test(value)) return 'Enter a valid email address.';
    return '';
  }
  function validatePassword(value: string): string {
    if (!value) return 'Please enter your password.';
    return '';
  }

  // ----- Email/Password login handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Always sanitize before validating/submitting
    const cleanedEmail = sanitizeEmail(email);

    // Client-side validation
    const eErr = validateEmail(cleanedEmail);
    const pErr = validatePassword(password);
    setEmailError(eErr);
    setPasswordError(pErr);
    if (eErr || pErr) return;

    setLoading(true);
    try {
      // Choose persistence by "Remember me"
      await setPersistence(
        auth,
        remember ? browserLocalPersistence : browserSessionPersistence
      );

      // Attempt Firebase email/password sign-in
      const cred = await signInWithEmailAndPassword(
        auth,
        cleanedEmail,
        password
      );

      // Ensure Firestore user profile exists/updated (roles, timestamps, etc.)
      await ensureUserDoc(cred.user);

      // Done → go home
      navigate('/');
    } catch (error: any) {
      const code = error?.code as string | undefined;

      // Clear field-specific errors before setting new ones
      setEmailError('');
      setPasswordError('');
      setFormError('');

      // Helper to print friendly provider names
      const providerLabel = (pid: string) =>
        pid === 'google.com'
          ? 'Google'
          : pid === 'facebook.com'
          ? 'Facebook'
          : pid === 'apple.com'
          ? 'Apple'
          : pid === 'password'
          ? 'Email/Password'
          : pid;

      switch (code) {
        case 'auth/invalid-email':
          // If we still hit this after sanitize/regex → it's truly malformed
          setEmailError('Enter a valid email address.');
          break;

        // New SDKs often return invalid-credential for wrong-password or user-not-found
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found': {
          try {
            // Disambiguate without leaking existence too much
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
                // Account supports password → almost certainly wrong password
                setPasswordError('Incorrect password.');
                setFormError('Email or password is incorrect.');
              } else if (otherProviders.length) {
                // Registered via social only
                setFormError(
                  `This email is registered with ${otherProviders.join(
                    ' / '
                  )}. Please use that to log in.`
                );
              } else {
                // Shouldn't happen often, but stay generic
                setFormError('Email or password is incorrect.');
              }
            } else {
              // Empty methods (can be typos/gmail dot variants/etc.) → generic
              setFormError('Email or password is incorrect.');
            }
          } catch {
            // If the check fails for any reason, fall back to generic
            setFormError('Email or password is incorrect.');
          }
          break;
        }

        case 'auth/user-disabled':
          setFormError('This account has been disabled.');
          break;

        case 'auth/too-many-requests':
          setFormError('Too many attempts. Please wait and try again.');
          break;

        case 'auth/network-request-failed':
          setFormError('Network error. Check your connection and try again.');
          break;

        default:
          setFormError(error?.message ?? 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ----- Social logins
  async function onGoogle() {
    try {
      setLoading(true);
      await signInWithGoogle(auth);
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
      await signInWithFacebook(auth);
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
      await signInWithApple(auth);
      navigate('/');
    } catch (e: any) {
      setFormError(e?.message ?? 'Apple sign-in failed');
    } finally {
      setLoading(false);
    }
  }

  // ----- Render
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
        {/* Left - Login form card */}
        <div className="w-full md:w-6/12 bg-white rounded-3xl shadow-2xl flex flex-col justify-center p-6 md:p-12 mb-10 md:mb-0 h-auto md:h-[790px]">
          {/* Logo + Title */}
          <div className="mb-6 text-center">
            <img
              src={logocomplet}
              alt="logo fraction"
              className="w-[200px] md:w-[299px] h-auto mx-auto"
            />
            <p className="text-[#FF99A5] text-2xl md:text-[32px] font-bold mt-2">
              Log in
            </p>
          </div>

          {/* Social login buttons */}
          <div className="mb-4 flex flex-col">
            <div className="flex justify-center gap-4">
              <button
                onClick={onGoogle}
                disabled={loading}
                className="flex items-center justify-center transition-colors rounded-lg p-2 hover:bg-gray-100 disabled:opacity-50"
                aria-label="Log in with Google"
              >
                <FaGoogle size={40} />
              </button>
              <button
                onClick={onFacebook}
                disabled={loading}
                className="flex items-center justify-center transition-colors rounded-lg p-2 hover:bg-gray-100 disabled:opacity-50"
                aria-label="Log in with Facebook"
              >
                <FaFacebook size={40} />
              </button>
              <button
                onClick={onApple}
                disabled={loading}
                className="flex items-center justify-center transition-colors rounded-lg p-2 hover:bg-gray-100 disabled:opacity-50"
                aria-label="Log in with Apple"
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

          {/* Login form */}
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
            noValidate
          >
            {/* Email input */}
            <div>
              <input
                type="email"
                placeholder="Enter e-mail here ..."
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError('');
                }}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 placeholder-gray-400 ${
                  emailError
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-[#a052e0]'
                }`}
                required
                aria-invalid={!!emailError}
                aria-describedby="login-email-error"
                disabled={loading}
                inputMode="email"
                autoComplete="username"
              />
              {emailError && (
                <p
                  id="login-email-error"
                  className="mt-1 text-xs text-red-600"
                  aria-live="polite"
                >
                  {emailError}
                </p>
              )}
            </div>

            {/* Password input with toggle + CapsLock detection */}
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="Password ..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError('');
                }}
                onKeyUp={(e: any) => {
                  if (typeof e.getModifierState === 'function') {
                    setCapsOn(e.getModifierState('CapsLock'));
                  }
                }}
                className={`w-full p-3 pr-11 border rounded-lg focus:outline-none focus:ring-2 placeholder-gray-400 ${
                  passwordError
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-[#a052e0]'
                }`}
                required
                aria-invalid={!!passwordError}
                aria-describedby="login-password-error"
                disabled={loading}
                autoComplete="current-password"
              />
              {/* Toggle password visibility */}
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100"
                aria-label={showPw ? 'Hide password' : 'Show password'}
                disabled={loading}
              >
                {showPw ? <FaEyeSlash /> : <FaEye />}
              </button>

              {capsOn && (
                <p className="mt-1 text-xs text-amber-600">Caps Lock is on.</p>
              )}
              {passwordError && (
                <p
                  id="login-password-error"
                  className="mt-1 text-xs text-red-600"
                  aria-live="polite"
                >
                  {passwordError}
                </p>
              )}
            </div>

            {/* Remember me + forgot links */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-xs text-gray-700">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember((v) => !v)}
                  className="w-4 h-4 accent-[#3A3178]"
                  disabled={loading}
                />
                Remember me
              </label>
              <div className="flex gap-3">
                <a href="/forgot-email" className="hover:underline">
                  I forgot my e-mail
                </a>
                <a href="/forgot-password" className="hover:underline">
                  I forgot my password
                </a>
              </div>
            </div>

            {/* Global form error */}
            {formError && <p className="text-xs text-red-600">{formError}</p>}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-[230px] bg-[#3A3178] text-white py-3 rounded-[21.5px] mx-auto hover:opacity-90 transition mt-2 flex justify-center items-center disabled:opacity-50"
            >
              {loading ? <Loader /> : 'Log in'}
            </button>
          </form>

          {/* Link to signup */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Go to{' '}
            <a
              href="/signup"
              className="text-[#3b3b64] font-medium hover:underline"
            >
              Sign up
            </a>
          </p>
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
}
