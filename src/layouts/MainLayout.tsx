import NavMain from '../components/NavMain';
import FooterMain from '../components/FooterMain';
import React from 'react';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
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
      <div className='grid grid-rows-[auto_1fr_auto] gap-y-6 row-gap-[1rem] grid-cols-[minmax(16px,1fr)_minmax(0,1200px)_minmax(16px,1fr)] h-full'>
        <NavMain />
        <div className='col-start-2 col-end-3'>{children}</div>
        <FooterMain />
      </div>
    </div>
  );
};

export default MainLayout;
