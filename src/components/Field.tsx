import * as React from 'react';

type FieldProps = {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
};

export default function Field({ label, required, hint, children }: FieldProps) {
  return (
    <label className='grid gap-1'>
      <span className='text-sm font-medium'>
        {label}
        {required && <span className='text-red-500'> *</span>}
      </span>
      {children}
      {hint && <span className='text-xs text-zinc-500'>{hint}</span>}
    </label>
  );
}
