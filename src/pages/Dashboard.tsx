import { useState } from 'react';
import type React from 'react';
import GearIcon from '../assets/icons/gear.svg?react';
import CardIcon from '../assets/icons/card.svg?react';
import LockIcon from '../assets/icons/lock.svg?react';
import UserIcon from '../assets/icons/user.svg?react';
import BellIcon from '../assets/icons/bell.svg?react';
import HelpIcon from '../assets/icons/help.svg?react';
import AccountSettings from '../components/dashboard/AccountSettings';
import PayementSettings from '../components/dashboard/PayementSettings';
import PasswordSecuritySettings from '../components/dashboard/PasswordSecuritySettings';
import HelpCenterSettings from '../components/dashboard/HelpCenterSettings';

type TabKey =
  | 'account'
  | 'payment'
  | 'security'
  | 'personal'
  | 'notification'
  | 'help';
type NavItem = { key: TabKey; label: string; icon: React.ReactNode };

function Placeholder({ title }: { title: string }): React.ReactNode {
  return (
    <div className='rounded-xl border border-dashed border-gray-300 bg-white p-8 text-gray-600'>
      <p className='text-lg'>
        <span className='font-semibold'>{title}</span> — contenu à définir.
      </p>
    </div>
  );
}

export function Dashboard(): React.ReactNode {
  // changement onglet actif
  const [active, setActive] = useState<TabKey>('account');

  // navigation aside
  const nav: NavItem[] = [
    {
      key: 'account',
      label: 'Account setting',
      icon: <GearIcon className='size-4' />,
    },
    { key: 'payment', label: 'Payment', icon: <CardIcon className='size-4' /> },
    {
      key: 'security',
      label: 'Password & security',
      icon: <LockIcon className='size-4' />,
    },
    {
      key: 'personal',
      label: 'Personal Information',
      icon: <UserIcon className='size-4' />,
    },
    {
      key: 'notification',
      label: 'Notification',
      icon: <BellIcon className='size-4' />,
    },
    {
      key: 'help',
      label: 'Help Center',
      icon: <HelpIcon className='size-4' />,
    },
  ];

  return (
    <div>
      <h1 className='text-4xl font-bold text-[var(--color-fraction-violet-500)]'>
        Settings
      </h1>

      <div className='flex flex-row mt-20 gap-12'>
        {/* Nav à gauche */}
        <aside className='space-y-3 border-r-[2px] pr-12 border-[var(--color-fraction-light-500)]'>
          {nav.map((item) => {
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                type='button'
                onClick={() => setActive(item.key)}
                className={[
                  'w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition text-[var(--color-fraction-light-500)]',
                  'flex items-center gap-3',
                  isActive
                    ? 'bg-[var(--color-fraction-violet-500)] text-white border-violet-700 shadow-sm'
                    : 'bg-white border-gray-200 hover:bg-gray-50',
                ].join(' ')}
              >
                <span
                  className={[
                    'grid size-6 place-items-center rounded-md',
                    isActive ? 'bg-white/20' : 'bg-gray-100',
                  ].join(' ')}
                >
                  {item.icon}
                </span>
                {item.label}
              </button>
            );
          })}
        </aside>

        {/* Contenu à droite */}
        <section className='relative grow'>
          <div className=''>
            {active === 'account' && <AccountSettings />}
            {active === 'payment' && <PayementSettings />}
            {active === 'security' && <PasswordSecuritySettings />}
            {active === 'personal' && (
              <Placeholder title='Personal Information' />
            )}
            {active === 'notification' && <Placeholder title='Notification' />}
            {active === 'help' && <HelpCenterSettings />}
          </div>
        </section>
      </div>
    </div>
  );
}
