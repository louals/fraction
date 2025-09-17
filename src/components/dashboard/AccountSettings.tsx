// src/components/settings/AccountSettings.tsx
import type React from 'react';
import type { SVGProps } from 'react';

export default function AccountSettings(): React.ReactNode {
  return (
    <div className='space-y-10'>
      {/* En-tête profil */}
      <div className='flex items-center gap-5'>
        <AvatarEditable />
        <div>
          <h2 className='text-2xl font-semibold text-[var(--color-fraction-violet-500)]'>
            Image de Profil
          </h2>
          <p className='text-sm text-gray-500'>your_name@gmail.com</p>
        </div>
      </div>

      {/* Name */}
      <section>
        <h3 className='text-xl font-semibold text-gray-900'>Name</h3>
        <div className='mt-2 grid gap-4 md:grid-cols-2'>
          <LabeledInput label='First name' defaultValue='Jane' />
          <LabeledInput label='Last name' defaultValue='Doe' />
        </div>
      </section>

      {/* Email */}
      <section>
        <h3 className='text-xl font-semibold text-gray-900'>Contact email</h3>
        <div className='mt-2 max-w-md'>
          <LabeledInput
            label='Email'
            type='email'
            defaultValue='janedoe@fraction.com'
            icon={<MailIcon className='size-4 text-gray-400' />}
          />
        </div>
      </section>

      {/* Phone */}
      <section>
        <h3 className='text-xl font-semibold text-gray-900'>Phone number</h3>
        <div className='mt-2 max-w-md'>
          <LabeledInput
            label='Phone'
            type='tel'
            defaultValue='+1 000-000-0000'
            icon={<PhoneIcon className='size-4 text-gray-400' />}
          />
        </div>
      </section>
    </div>
  );
}

/* ------------------------------- UI locaux ------------------------------- */

function AvatarEditable(): React.ReactNode {
  return (
    <div className='relative'>
      <div className='grid size-24 place-items-center rounded-full bg-gradient-to-tr from-violet-200 to-violet-500'>
        <UserIcon className='size-12 text-white' />
      </div>
      <button
        type='button'
        className='absolute bottom-0 right-0 grid size-7 place-items-center rounded-full border border-white bg-pink-500 text-white shadow'
        aria-label='Change profile picture'
      >
        <PencilIcon className='size-4' />
      </button>
    </div>
  );
}

type LabeledInputProps = {
  label: string;
  type?: string;
  defaultValue?: string;
  icon?: React.ReactNode;
};
function LabeledInput({
  label,
  type = 'text',
  defaultValue,
  icon,
}: LabeledInputProps): React.ReactNode {
  return (
    <label className='block text-sm'>
      <span className='text-violet-700'>{label}</span>
      <div className='relative mt-1'>
        {icon && (
          <span className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2'>
            {icon}
          </span>
        )}
        <input
          type={type}
          defaultValue={defaultValue}
          className={[
            'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm outline-none',
            icon ? 'pl-9' : '',
            'focus:border-violet-500 focus:ring-2 focus:ring-violet-200',
          ].join(' ')}
        />
        <button
          type='button'
          className='absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-gray-600'
          aria-label='Edit'
        >
          <PencilIcon className='size-4' />
        </button>
      </div>
    </label>
  );
}

/* -------------------------------- Icônes -------------------------------- */
function UserIcon(props: SVGProps<SVGSVGElement>): React.ReactNode {
  return (
    <svg viewBox='0 0 24 24' fill='currentColor' {...props}>
      <path d='M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z' />
    </svg>
  );
}
function MailIcon(props: SVGProps<SVGSVGElement>): React.ReactNode {
  return (
    <svg viewBox='0 0 24 24' fill='currentColor' {...props}>
      <path d='M4 6h16a2 2 0 0 1 2 2v.2l-10 6-10-6V8a2 2 0 0 1 2-2Zm16 12H4a2 2 0 0 1-2-2V9l10 6 10-6v7a2 2 0 0 1-2 2Z' />
    </svg>
  );
}
function PhoneIcon(props: SVGProps<SVGSVGElement>): React.ReactNode {
  return (
    <svg viewBox='0 0 24 24' fill='currentColor' {...props}>
      <path d='M6.62 10.79a15.1 15.1 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24 11.36 11.36 0 0 0 3.57.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 7a1 1 0 0 1 1-1h2.5a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.57 1 1 0 0 1-.24 1.01l-1.21 1.21Z' />
    </svg>
  );
}
function PencilIcon(props: SVGProps<SVGSVGElement>): React.ReactNode {
  return (
    <svg viewBox='0 0 20 20' fill='currentColor' {...props}>
      <path d='M17.41 2.59a2 2 0 0 0-2.83 0l-9.9 9.9L3 17l4.51-1.68 9.9-9.9a2 2 0 0 0 0-2.83ZM7.59 15.09l-2.68.99.99-2.68L14 5.3l1.7 1.7-8.11 8.09Z' />
    </svg>
  );
}
