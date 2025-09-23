import * as React from 'react';
import { useState } from 'react';

import LockPasswordIcon from '../../assets/icons/lock-password.svg?react';
import EyeOpenIcon from '../../assets/icons/eye-open.svg?react';
import EyeCloseIcon from '../../assets/icons/eye-close.svg?react';

export default function PasswordSecuritySettings(): React.ReactNode {
  /* afficher ou non le mot de passe en clair */
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [password, setPassword] = useState('test123');

  /**
   * Gère la soumission du formulaire Password
   * @param e - Événement submit du formulaire.
   */
  async function passwordSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
  }

  return (
    <div>
      <h2 className='text-3xl text-[var(--color-fraction-violet-500)]'>
        Password & security
      </h2>
      <div className='flex flex-col gap-9 mt-9'>
        <div className='flex flex-col gap-2'>
          <div>
            <h3 className='text-2xl text-[var(--color-fraction-violet-500)]'>
              Password
            </h3>
            <p>Change current Passwords</p>
          </div>
          <form onSubmit={passwordSubmit}>
            <div className='flex flex-row gap-6'>
              <div>
                <label htmlFor='password'>Current password</label>
                <div
                  className='flex flex-row gap-2 items-center p-2 border-[2px] border-[var(--color-fraction-light-400)] rounded-lg  max-w-max shadow-lg focus-within:border-violet-500
                  focus-within:ring-2 focus-within:ring-violet-200
                  focus-within:ring-offset-0.5'
                >
                  <div className='flex flex-row gap-3 items-center'>
                    <LockPasswordIcon />
                    <input
                      className='border-0 focus:outline-none'
                      type={showCurrentPassword ? 'text' : 'password'}
                      name='password'
                      id='password'
                      value={password}
                    />
                  </div>
                  <button
                    type='button'
                    onClick={() => setShowCurrentPassword((s) => !s)}
                    aria-pressed={showCurrentPassword}
                    aria-label={
                      showCurrentPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    {showCurrentPassword ? <EyeCloseIcon /> : <EyeOpenIcon />}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor='Newpassword'>New password</label>
                <div
                  className='flex flex-row gap-2 items-center p-2 border-[2px] border-[var(--color-fraction-light-400)] rounded-lg  max-w-max shadow-lg focus-within:border-violet-500
                  focus-within:ring-2 focus-within:ring-violet-200
                  focus-within:ring-offset-0.5'
                >
                  <div className='flex flex-row gap-3 items-center'>
                    <LockPasswordIcon />
                    <input
                      className='border-0 focus:outline-none'
                      type={showNewPassword ? 'text' : 'password'}
                      name='Newpassword'
                      id='Newpassword'
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <button
                    type='button'
                    onClick={() => setShowNewPassword((s) => !s)}
                    aria-pressed={showNewPassword}
                    aria-label={
                      showNewPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    {showNewPassword ? <EyeCloseIcon /> : <EyeOpenIcon />}
                  </button>
                </div>
              </div>
            </div>
            <button
              type='submit'
              className='mt-4 max-w-max border-[2px] border-transparent bg-[var(--color-fraction-violet-500)] rounded-xl text-white px-4 py-2 hover:bg-white hover:border-[var(--color-fraction-violet-500)] hover:text-[var(--color-fraction-violet-500)] transition duration-300 cursor-pointer'
            >
              Modify
            </button>
          </form>
        </div>

        <div className='flex flex-col gap-2'>
          <h3 className='text-2xl text-[var(--color-fraction-violet-500)]'>
            Double authentication
          </h3>
          <p className='max-w-[50ch]'>
            To enhance the security of your account, enable two-factor
            authentication (2FA), which requires both your password and a unique
            verification code sent to your device.
          </p>
          <button className='max-w-max border-[2px] border-transparent bg-[var(--color-fraction-violet-500)] rounded-xl text-white px-4 py-2 hover:bg-white hover:border-[var(--color-fraction-violet-500)] hover:text-[var(--color-fraction-violet-500)] transition duration-300 cursor-pointer'>
            Activate double authentication
          </button>
        </div>
        <div>
          <h3 className='text-2xl text-[var(--color-fraction-violet-500)]'>
            Account Security
          </h3>
          <div className='flex flex-row gap-x-5 mt-2'>
            <button className='max-w-max border-[2px] border-transparent bg-[var(--color-fraction-violet-500)] rounded-xl text-white px-4 py-2 hover:bg-white hover:border-[var(--color-fraction-violet-500)] hover:text-[var(--color-fraction-violet-500)] transition duration-300 cursor-pointer'>
              Log out
            </button>
            <button className='max-w-max border-[2px] border-red-500 bg-white rounded-xl text-red-500 px-4 py-2 hover:bg-red-500 bg-red-500 hover:border-transparent hover:text-white transition duration-300 cursor-pointer'>
              Delete my account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
