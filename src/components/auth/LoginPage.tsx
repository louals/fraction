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

// Regex for validating email addresses
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  // Form state
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string>('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [capsOn, setCapsOn] = useState(false);

  const navigate = useNavigate();

  // Validate email format and required field
  function validateEmail(value: string): string {
    if (!value) return 'Please enter your email.';
    if (!emailRegex.test(value)) return 'Enter a valid email address.';
    return '';
  }

  // Validate password required field
  function validatePassword(value: string): string {
    if (!value) return 'Please enter your password.';
    return '';
  }

  // ----- Email/Password login handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Run client-side validations
    const eErr = validateEmail(email.trim());
    const pErr = validatePassword(password);
    setEmailError(eErr);
    setPasswordError(pErr);
    if (eErr || pErr) return;

    setLoading(true);
    try {
      // Set persistence based on "Remember me"
      await setPersistence(
        auth,
        remember ? browserLocalPersistence : browserSessionPersistence
      );

      // Attempt Firebase email/password sign-in
      const cred = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      // Ensure Firestore user profile is created/updated
      await ensureUserDoc(cred.user);

      // Redirect to home
      navigate('/');
    } catch (error: any) {
      const code = error?.code as string | undefined;

      // Reset field-specific errors before assigning new ones
      setEmailError('');
      setPasswordError('');

      switch (code) {
        case 'auth/invalid-email':
          setEmailError('Enter a valid email address.');
          break;

        // In new versions, invalid-credential may replace user-not-found/wrong-password
        case 'auth/invalid-credential':
        case 'auth/wrong-password': {
          try {
            // Check what sign-in methods exist for this email
            const methods = await fetchSignInMethodsForEmail(
              auth,
              email.trim()
            );

            if (!methods || methods.length === 0) {
              // No account exists for this email
              setEmailError('No account found for this email.');
            } else {
              // Email exists, so password is likely incorrect
              setPasswordError('Incorrect password.');
            }
          } catch {
            // Fallback generic error if method check fails
            setFormError('Login failed. Please try again.');
          }
          break;
        }

        case 'auth/user-not-found':
          setEmailError('No account found for this email.');
          break;

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

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 md:px-8"
      style={{
        background: 'linear-gradient(135deg, #E4E5FF, #F3BBCE9D, #FF99A54D)',
      }}
    >
      <div className="flex flex-col md:flex-row w-full max-w-[1600px] justify-between items-center">
        {/* Left - Login form card */}
        <div className="w-full md:w-6/12 bg-white rounded-3xl shadow-2xl flex flex-col justify-center p-6 md:p-12 mb-10 md:mb-0 h-auto md:h-[790px]">
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
