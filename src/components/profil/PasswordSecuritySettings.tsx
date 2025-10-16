// src/components/auth/PasswordSecuritySettings.tsx
import * as React from 'react';
import { useMemo, useState } from 'react';
import {
  signOut,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { useNavigate } from 'react-router-dom';

import LockPasswordIcon from '../../assets/icons/lock-password.svg?react';
import EyeOpenIcon from '../../assets/icons/eye-open.svg?react';
import EyeCloseIcon from '../../assets/icons/eye-close.svg?react';

/** Minimal checklist item type, used for password requirements */
type CheckItem = {
  id: string;
  ok: boolean;
  label: string;
};

export default function PasswordSecuritySettings(): React.ReactNode {
  // ===== Visibility toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ===== Controlled form fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // ===== Focus states to show helper panel only when interacting
  const [isNewFocused, setIsNewFocused] = useState(false);
  const [isConfirmFocused, setIsConfirmFocused] = useState(false);

  // Derived flag: show the requirements when focused or when the user typed something
  const showRequirements =
    isNewFocused ||
    isConfirmFocused ||
    newPassword.length > 0 ||
    confirmNewPassword.length > 0;

  // ===== Change password UI state
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState<string | null>(null);

  // Optional: sign out after successful change
  const [signOutAfterChange, setSignOutAfterChange] = useState(false);

  // ===== Logout UI state
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const navigate = useNavigate();

  /** Map Firebase Auth error codes to friendly messages (same tone as signup) */
  function friendlyError(code: string): string {
    switch (code) {
      case 'auth/wrong-password':
        return 'Current password is incorrect.';
      case 'auth/weak-password':
        return 'New password is too weak. Please meet all requirements below.';
      case 'auth/requires-recent-login':
        return 'For security reasons, please re-login and try again.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please wait a moment and try again.';
      case 'auth/user-mismatch':
        return 'User mismatch. Please re-login and try again.';
      default:
        return 'Unable to update password. Please try again.';
    }
  }

  /**
   * Password rules — mirror your Signup page rules.
   * If your signup uses different labels/length, adjust here.
   */
  const checks: CheckItem[] = useMemo(() => {
    const v = newPassword || '';
    const hasMin = v.length >= 8; // adjust to 10 if your signup requires 10 chars
    const hasUpper = /[A-Z]/.test(v);
    const hasLower = /[a-z]/.test(v);
    const hasNumber = /\d/.test(v);
    const hasSymbol = /[!@#$%^&*()[\]{};:'",.<>/?\\\-_=+|`~]/.test(v);
    const noSpaces = !/\s/.test(v);

    return [
      { id: 'min', ok: hasMin, label: 'At least 8 characters' },
      { id: 'upper', ok: hasUpper, label: 'At least 1 uppercase letter (A–Z)' },
      { id: 'lower', ok: hasLower, label: 'At least 1 lowercase letter (a–z)' },
      { id: 'num', ok: hasNumber, label: 'At least 1 number (0–9)' },
      {
        id: 'sym',
        ok: hasSymbol,
        label: 'At least 1 symbol (e.g., ! @ # $ % …)',
      },
      { id: 'space', ok: noSpaces, label: 'No spaces' },
    ];
  }, [newPassword]);

  const allChecksPass = useMemo(() => checks.every((c) => c.ok), [checks]);

  /**
   * Sign out current user via Firebase Auth.
   */
  async function handleLogout(): Promise<void> {
    try {
      setLogoutError(null);
      setLogoutLoading(true);
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      setLogoutError('Unable to log out. Please try again.');
    } finally {
      setLogoutLoading(false);
    }
  }

  /**
   * Handle password change form submit:
   * 1) Validate fields & rules (same as Signup)
   * 2) Reauthenticate with current password
   * 3) updatePassword(newPassword)
   * 4) Optionally sign out and redirect to /login
   */
  async function passwordSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(null);

    // Client-side validations
    if (!currentPassword) {
      setPwError('Please enter your current password.');
      return;
    }
    if (!newPassword) {
      setPwError('Please enter a new password.');
      return;
    }
    if (!allChecksPass) {
      setPwError('Please meet all password requirements.');
      return;
    }
    if (newPassword === currentPassword) {
      setPwError('New password must be different from the current password.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPwError('New password and confirmation do not match.');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      setPwError('No user session. Please log in and try again.');
      return;
    }

    // Ensure this account supports password auth
    const hasPasswordProvider = user.providerData.some(
      (p) => p.providerId === 'password'
    );
    if (!hasPasswordProvider) {
      setPwError(
        'Your account is linked via a social provider. Please re-login with that provider, then set a password from your account settings.'
      );
      return;
    }

    const email = user.email;
    if (!email) {
      setPwError('Missing email for the current user. Please re-login.');
      return;
    }

    try {
      setPwLoading(true);

      // 1) Reauthenticate with current password
      const credential = EmailAuthProvider.credential(email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // 2) Update password
      await updatePassword(user, newPassword);

      // Reset local fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');

      // 3) Success message
      setPwSuccess('Your password has been updated successfully.');

      // 4) Optionally sign out and redirect
      if (signOutAfterChange) {
        await signOut(auth);
        navigate('/login');
      }
    } catch (err: any) {
      const code = err?.code ?? 'unknown';
      setPwError(friendlyError(code));
    } finally {
      setPwLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-3xl text-[var(--color-fraction-violet-500)]">
        Password & security
      </h2>

      <div className="flex flex-col gap-9 mt-9">
        {/* ====== Change Password */}
        <div className="flex flex-col gap-3">
          <div>
            <h3 className="text-2xl text-[var(--color-fraction-violet-500)]">
              Password
            </h3>
            <p>Change your current password securely.</p>
          </div>

          {/* Requirements helper — same messages as Signup, shown on focus/typing */}
          <div
            className={[
              'rounded-xl border border-[var(--color-fraction-light-400)] bg-white/70 shadow-sm',
              // Animated show/hide
              'transition-all duration-200',
              showRequirements
                ? 'opacity-100 translate-y-0 p-3 mt-0'
                : 'opacity-0 -translate-y-1 pointer-events-none h-0 overflow-hidden p-0 border-0 shadow-none mt-0',
            ].join(' ')}
            aria-hidden={!showRequirements}
          >
            {showRequirements && (
              <>
                <p className="mb-2 font-medium text-[var(--color-fraction-violet-600)]">
                  Password must meet all of the following requirements:
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-[13px]">
                  {checks.map((c) => (
                    <li key={c.id} className="flex items-center gap-2">
                      <span
                        className={c.ok ? 'text-green-600' : 'text-red-600'}
                        aria-hidden="true"
                      >
                        {c.ok ? '✅' : '❌'}
                      </span>
                      <span
                        className={c.ok ? 'text-gray-700' : 'text-gray-600'}
                      >
                        {c.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <form onSubmit={passwordSubmit} noValidate>
            <div className="flex flex-row gap-6 flex-wrap">
              {/* Current password */}
              <div>
                <label htmlFor="currentPassword">Current password</label>
                <div
                  className="flex flex-row gap-2 items-center p-2 border-[2px] border-[var(--color-fraction-light-400)] rounded-lg max-w-max shadow-lg focus-within:border-violet-500
                  focus-within:ring-2 focus-within:ring-violet-200"
                >
                  <div className="flex flex-row gap-3 items-center">
                    <LockPasswordIcon />
                    <input
                      className="border-0 focus:outline-none"
                      type={showCurrentPassword ? 'text' : 'password'}
                      name="currentPassword"
                      id="currentPassword"
                      autoComplete="current-password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      disabled={pwLoading}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((s) => !s)}
                    aria-pressed={showCurrentPassword}
                    aria-label={
                      showCurrentPassword ? 'Hide password' : 'Show password'
                    }
                    disabled={pwLoading}
                  >
                    {showCurrentPassword ? <EyeCloseIcon /> : <EyeOpenIcon />}
                  </button>
                </div>
              </div>

              {/* New password */}
              <div>
                <label htmlFor="newPassword">New password</label>
                <div
                  className="flex flex-row gap-2 items-center p-2 border-[2px] border-[var(--color-fraction-light-400)] rounded-lg max-w-max shadow-lg focus-within:border-violet-500
                  focus-within:ring-2 focus-within:ring-violet-200"
                >
                  <div className="flex flex-row gap-3 items-center">
                    <LockPasswordIcon />
                    <input
                      className="border-0 focus:outline-none"
                      type={showNewPassword ? 'text' : 'password'}
                      name="newPassword"
                      id="newPassword"
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      onFocus={() => setIsNewFocused(true)}
                      onBlur={() => setIsNewFocused(false)}
                      disabled={pwLoading}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((s) => !s)}
                    aria-pressed={showNewPassword}
                    aria-label={
                      showNewPassword ? 'Hide password' : 'Show password'
                    }
                    disabled={pwLoading}
                  >
                    {showNewPassword ? <EyeCloseIcon /> : <EyeOpenIcon />}
                  </button>
                </div>
              </div>

              {/* Confirm new password */}
              <div>
                <label htmlFor="confirmNewPassword">Confirm new password</label>
                <div
                  className="flex flex-row gap-2 items-center p-2 border-[2px] border-[var(--color-fraction-light-400)] rounded-lg max-w-max shadow-lg focus-within:border-violet-500
                  focus-within:ring-2 focus-within:ring-violet-200"
                >
                  <div className="flex flex-row gap-3 items-center">
                    <LockPasswordIcon />
                    <input
                      className="border-0 focus:outline-none"
                      type={showConfirm ? 'text' : 'password'}
                      name="confirmNewPassword"
                      id="confirmNewPassword"
                      autoComplete="new-password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      onFocus={() => setIsConfirmFocused(true)}
                      onBlur={() => setIsConfirmFocused(false)}
                      disabled={pwLoading}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    aria-pressed={showConfirm}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    disabled={pwLoading}
                  >
                    {showConfirm ? <EyeCloseIcon /> : <EyeOpenIcon />}
                  </button>
                </div>
              </div>
            </div>

            {/* Optional: sign out after change */}
            <div className="mt-3 flex items-center gap-2">
              <input
                id="signoutAfter"
                type="checkbox"
                className="h-4 w-4"
                checked={signOutAfterChange}
                onChange={(e) => setSignOutAfterChange(e.target.checked)}
                disabled={pwLoading}
              />
              <label htmlFor="signoutAfter" className="text-sm text-gray-700">
                Sign out after successful change (you will need to log in again)
              </label>
            </div>

            {/* Submit + messages */}
            <button
              type="submit"
              disabled={pwLoading}
              aria-busy={pwLoading}
              className="mt-4 max-w-max border-[2px] border-transparent bg-[var(--color-fraction-violet-500)] rounded-xl text-white px-4 py-2 hover:bg-white hover:border-[var(--color-fraction-violet-500)] hover:text-[var(--color-fraction-violet-500)] transition duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {pwLoading ? 'Saving…' : 'Modify'}
            </button>

            {pwError && (
              <p className="mt-2 text-red-600" role="alert" aria-live="polite">
                {pwError}
              </p>
            )}
            {pwSuccess && (
              <p
                className="mt-2 text-green-600"
                role="status"
                aria-live="polite"
              >
                {pwSuccess}
              </p>
            )}
          </form>
        </div>

        {/* ====== 2FA (placeholder UI) */}
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl text-[var(--color-fraction-violet-500)]">
            Double authentication
          </h3>
          <p className="max-w-[50ch]">
            To enhance the security of your account, enable two-factor
            authentication (2FA), which requires both your password and a unique
            verification code sent to your device.
          </p>
          <button className="max-w-max border-[2px] border-transparent bg-[var(--color-fraction-violet-500)] rounded-xl text-white px-4 py-2 hover:bg-white hover:border-[var(--color-fraction-violet-500)] hover:text-[var(--color-fraction-violet-500)] transition duration-300 cursor-pointer">
            Activate double authentication
          </button>
        </div>

        {/* ====== Account Security */}
        <div>
          <h3 className="text-2xl text-[var(--color-fraction-violet-500)]">
            Account Security
          </h3>
          <div className="flex flex-row gap-x-5 mt-2">
            <button
              onClick={handleLogout}
              disabled={logoutLoading}
              aria-busy={logoutLoading}
              className="max-w-max border-[2px] border-transparent bg-[var(--color-fraction-violet-500)] rounded-xl text-white px-4 py-2 hover:bg-white hover:border-[var(--color-fraction-violet-500)] hover:text-[var(--color-fraction-violet-500)] transition duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {logoutLoading ? 'Logging out…' : 'Log out'}
            </button>

            <button className="max-w-max border-[2px] border-red-500 bg-white rounded-xl text-red-500 px-4 py-2 hover:bg-red-500 hover:border-transparent hover:text-white transition duration-300 cursor-pointer">
              Delete my account
            </button>
          </div>

          {logoutError && (
            <p className="mt-2 text-red-600" role="alert" aria-live="polite">
              {logoutError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
