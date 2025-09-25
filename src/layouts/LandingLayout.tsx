import NavMain from '../components/NavMain';
import FooterMain from '../components/FooterMain';
import React from 'react';
import phone from '../assets/images/phone.png';

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='relative h-screen'>
      {/* Background image */}
      <img
        src='/assets/img/brand-fraction-img-top.png'
        alt='background'
        className='absolute inset-0 -z-10 w-full object-cover pointer-events-none [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]
               [mask-repeat:no-repeat] [mask-size:100%_100%]'
      />

      {/* Grid layout */}
      <div className='grid grid-rows-[auto_auto_1fr_auto] gap-y-6 row-gap-[1rem] grid-cols-[minmax(16px,1fr)_minmax(0,1200px)_minmax(16px,1fr)] h-full'>
        <div
          className='mt-14 col-start-2 col-end-3 flex justify-between items-center
'
        >
          <div className='max-w-[45ch]'>
            <h1 className='text-4xl italic leading-[1.3]'>
              Start investing in Real estate from just 100$
            </h1>
            <p className='mt-4'>
              Fractional real estate investing allows you to own a share of
              high-value properties with a small investment.
            </p>
            <form className='mt-10'>
              <input
                className='bg-white border border-transparent border-0 focus:outline-none rounded-[5px_0_0_5px] p-2'
                type='email'
                name='mail'
                placeholder='Your email'
              />
              <button
                className='bg-[var(--color-fraction-violet-500)] text-white p-2 rounded-[0_5px_5px_0]'
                type='submit'
              >
                Start now
              </button>
            </form>
          </div>

          <img className='w-[480px]' src={phone} alt='photo phone with house' />
        </div>
        <NavMain />
        <div className='col-start-2 col-end-3'>{children}</div>
        <FooterMain />
      </div>
    </div>
  );
};

export default LandingLayout;
