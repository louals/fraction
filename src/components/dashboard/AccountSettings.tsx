import type React from 'react';
// ⬇️ Icônes importées via SVGR (?react)
import AccountIcon from '../../assets/icons/account.svg?react';
import MailIcon from '../../assets/icons/mail.svg?react';
import PhoneIcon from '../../assets/icons/phone.svg?react';
import PenIcon from '../../assets/icons/pen.svg?react';
import ProfilEditableIcon from '../../assets/icons/profilEditable.svg?react';

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
    <div className='relative w-[108px] h-[108px]'>
      {/* Avatar : prend tout l'espace du conteneur */}
      <AccountIcon className='inset-0 w-full h-full' />
      {/* Crayon : chevauche en bas-droite */}
      <ProfilEditableIcon className='absolute right-[18px] bottom-[18px] w-6 h-6' />
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
          <PenIcon className='size-4' />
        </button>
      </div>
    </label>
  );
}
