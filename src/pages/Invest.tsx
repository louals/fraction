import * as React from 'react';
import { fakeProjects } from '../data/projects';
import { Card } from '../components/CardProperty';

/**
 * page invest with grid card property
 * @returns React.Reactnode
 */
export function Invest(): React.ReactNode {
  return (
    <div
      className='flex flex-col items-center gap-[32px]
'
    >
      <div
        className='border border-transparent rounded-[12px] bg-white/60  p-[32px] backdrop-blur-sm max-w-[50ch]
self-start'
      >
        <h2
          className='text-4xl text-[var(--color-fraction-violet-500)]
'
        >
          Invest in Real Estate, One Fraction at a Time.
        </h2>
        <p className='mt-[24px] text-[var(--color-fraction-light-600)]'>
          Join us and take the first step toward smart real estate investing
          with a trusted partner by your side.
        </p>
      </div>
      <div className='border border-transparent rounded-[12px] bg-white/60  p-[24px] backdrop-blur-sm max-w-content flex gap-x-[20px] max-w-max'>
        <p className='text-[var(--color-fraction-light-600)]'>All</p>
        <p className='text-[var(--color-fraction-light-600)]'>
          Family residential
        </p>
        <p className='text-[var(--color-fraction-light-600)]'>
          Vacation rental
        </p>
        <p className='text-[var(--color-fraction-light-600)]'>
          Family residential
        </p>
        <div className='flex flex-row gap-x-[8px]'>
          <p className='text-[var(--color-fraction-light-600)]'>Filter</p>
          <img src='/assets/img/filter-list.svg' alt='icon filter' />
        </div>
      </div>
      <div className='grid gap-[20px] grid-cols-[repeat(auto-fit,minmax(300px,1fr))]'>
        {fakeProjects.map((p) => (
          <Card
            key={p.id}
            id={p.id}
            title={p.title}
            type={p.type}
            size={p.size}
            fundingRequired={p.fundingRequired}
            situated={p.situated}
            status={p.status}
            tag={p.tag}
            image={p.image}
          />
        ))}
      </div>
    </div>
  );
}
