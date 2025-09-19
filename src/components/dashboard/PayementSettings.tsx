// src/components/dashboard/PaymentSettings.tsx
import { useMemo, useState } from 'react';
import type React from 'react';
import CardPaymentIcon from '../../assets/icons/cardpayement.svg?react'; // chemin à ajuster si besoin

type SavedCard = {
  brand: 'Visa' | 'Mastercard' | 'Amex' | 'Other';
  name: string;
  last4: string;
};

export default function PaymentSettings(): React.ReactNode {
  // Carte “active” (existant)
  const [card] = useState<SavedCard>({
    brand: 'Visa',
    name: 'Card Name',
    last4: '0000',
  });

  // Form state (démo)
  const [cardNumber, setCardNumber] = useState('');
  const [expMonth, setExpMonth] = useState('');
  const [expYear, setExpYear] = useState('');
  const [cardName, setCardName] = useState('');

  const years = useMemo(
    () => Array.from({ length: 12 }, (_, i) => new Date().getFullYear() + i),
    []
  );

  return (
    <div className='space-y-6'>
      <h2 className='text-3xl text-[var(--color-fraction-violet-500)]'>
        Payement
      </h2>

      <div className='flex flex-row gap-x-10'>
        {/* ------------------ Colonne gauche : cartes ------------------ */}
        <div className='space-y-4'>
          <div className='rounded-3xl border border-gray-200 bg-white px-6 py-4 shadow-sm'>
            <div className='grid grid-cols-[auto_1fr] items-center gap-6'>
              <div className='text-[var(--color-fraction-violet-700,#3a2f85)]'>
                <CardPaymentIcon className='w-[96px] h-auto' />
              </div>

              <div>
                <p className='text-2xl text-[var(--color-fraction-violet-700,#3a2f85)]'>
                  {card.name}
                </p>
                <p className='mt-2 text-[15px] leading-snug text-[var(--color-fraction-light-700,#7b739f)]'>
                  {card.name} will ending with{' '}
                  <span className='tracking-wider'>**** {card.last4}</span>
                </p>
              </div>
            </div>
          </div>

          <button
            type='button'
            className='w-full rounded-3xl border-2 border-dashed border-gray-300 bg-white px- py-6 text-left transition hover:border-gray-400'
          >
            <div className='flex items-center gap-6 text-[var(--color-fraction-light-700,#9b94a6)]'>
              <span className='grid size-14 place-items-center rounded-full border-2 border-current'>
                <span className='text-3xl leading-none'>＋</span>
              </span>
              <span className='text-2xl'>Add a card</span>
            </div>
          </button>
        </div>

        {/* ------------------ Colonne droite : formulaire ------------------ */}
        <div>
          <h3 className='mb-4 border-b border-gray-200 pb-3 text-2xl text-[var(--color-fraction-violet-700,#3a2f85)]'>
            Add a new payment methods
          </h3>

          <div className='flex flex-row'>
            <div className='space-y-4'>
              {/* Card Number */}
              <label className='block text-sm'>
                <span className='text-[var(--color-fraction-violet-600,#5b49b3)]'>
                  Card Number
                </span>
                <input
                  type='text'
                  placeholder='Card Number'
                  value={cardNumber}
                  inputMode='numeric'
                  pattern='[0-9]*'
                  onChange={(e) =>
                    setCardNumber(e.target.value.replace(/\D/g, ''))
                  }
                  className='mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200'
                />
              </label>
              {/* Expiration date */}
              <div>
                <span className='block text-sm text-[var(--color-fraction-violet-600,#5b49b3)]'>
                  Expiration date (MM/YYYY)
                </span>
                <div className='mt-1 flex items-center gap-3'>
                  <select
                    value={expMonth}
                    onChange={(e) => setExpMonth(e.target.value)}
                    className='rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200'
                  >
                    <option value=''>MM</option>
                    {Array.from({ length: 12 }, (_, i) =>
                      String(i + 1).padStart(2, '0')
                    ).map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <select
                    value={expYear}
                    onChange={(e) => setExpYear(e.target.value)}
                    className='rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200'
                  >
                    <option value=''>YYYY</option>
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Card Name */}
              <label className='block text-sm'>
                <span className='text-[var(--color-fraction-violet-600,#5b49b3)]'>
                  Card Name
                </span>
                <input
                  type='text'
                  placeholder='Card Name'
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className='mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200'
                />
              </label>
              {/* Actions */}
              <div className='pt-2'>
                <button
                  type='button'
                  className='inline-flex items-center rounded-md bg-[var(--color-fraction-violet-700,#2c1f74)] px-4 py-2 text-sm font-medium text-white shadow-sm hover:brightness-110'
                  onClick={() => {
                    // test
                    console.log({ cardNumber, expMonth, expYear, cardName });
                  }}
                >
                  Add a new card
                </button>
              </div>
            </div>
            <div className='flex'>
              <span className='max-w-[10ch]'>
                We accepte Master Card, Visa Card and American Express.
              </span>
              <div className='flex flex-wrap'>
                <img
                  className='max-w-[36px] h-max
'
                  src='/assets/img/Mastercard-logo.png'
                  alt='Mastercard credit card image'
                />
                <img
                  className='max-w-[36px] h-max'
                  src='/assets/img/Visa_logo.png'
                  alt='Visa credit card image'
                />
                <img
                  className='max-w-[36px] h-max'
                  src='/assets/img/American_Express_logo.png'
                  alt='American Express credit card image'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
