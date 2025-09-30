import { Link } from 'react-router-dom';
import ProfilButton from './ProfilButton';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import type { ButtonVars } from '../types/ui';

function NavMain() {
  const violetVars: ButtonVars = {
    '--btn-color': 'var(--color-fraction-violet-500, #7c3aed)',
    '--focus-ring': 'var(--color-fraction-violet-500, #7c3aed)',
  };

  const greenVars: ButtonVars = {
    '--btn-color': 'var(--color-fraction-green-600, #16a34a)',
    '--focus-ring': 'var(--color-fraction-green-600, #16a34a)',
  };

  const redVars: ButtonVars = {
    '--btn-color': 'var(--color-fraction-red-600, #dc2626)',
    '--focus-ring': 'var(--color-fraction-red-600, #dc2626)',
  };
  return (
    <nav className='col-span-full grid grid-cols-subgrid'>
      <div className='col-start-2 col-end-3 flex flex-row justify-between pt-[40px] pb-[16px] border-b-4 border-white'>
        <div className='flex flex-row gap-[40px] items-center'>
          <Link to='/'>
            <img
              src='/assets/img/logo-fraction-nav.png'
              alt='logo Fraction'
              className='max-w-[210px]'
            />
          </Link>
          <div className='flex flex-row gap-[29px]'>
            <Link to='/invest'>Invest</Link>
            <Link to='/'>How it works</Link>
            <Link to='/'>About us</Link>
            <Link to='/'>Learn</Link>
          </div>
        </div>
        <div className='flex flex-row gap-6'>
          <div className='flex flex-wrap items-center gap-3'>
            <Link
              to='/'
              style={violetVars}
              className='
              inline-flex items-center justify-center rounded-3xl px-6 py-2
              border-2 select-none transition ease-out motion-safe:duration-200
              shadow-sm hover:shadow-lg will-change-[transform,box-shadow]
              motion-safe:hover:scale-[1.03] hover:-translate-y-0.5 active:scale-95
              focus-visible:outline-none focus-visible:ring-2
              text-white bg-[color:var(--btn-color)] border-transparent
              hover:bg-white hover:text-[color:var(--btn-color)]
              hover:border-[color:var(--btn-color)]
              focus-visible:ring-[color:var(--focus-ring)]/60'
            >
              Transfer funds
            </Link>
            <Link
              to='/'
              style={greenVars}
              className='
              inline-flex items-center justify-center rounded-3xl px-6 py-2
              border-2 select-none transition ease-out motion-safe:duration-200
              shadow-sm hover:shadow-lg will-change-[transform,box-shadow]
              motion-safe:hover:scale-[1.03] hover:-translate-y-0.5 active:scale-95
              focus-visible:outline-none focus-visible:ring-2
              text-[color:var(--btn-color)] bg-white border-[color:var(--btn-color)]
              hover:bg-[color:var(--btn-color)] hover:text-white hover:border-transparent
              focus-visible:ring-[color:var(--focus-ring)]/60'
            >
              Buy
            </Link>
            <Link
              to='/sell'
              style={redVars}
              className='
              inline-flex items-center justify-center rounded-3xl px-6 py-2
              border-2 select-none transition ease-out motion-safe:duration-200
              shadow-sm hover:shadow-lg will-change-[transform,box-shadow]
              motion-safe:hover:scale-[1.03] hover:-translate-y-0.5 active:scale-95
              focus-visible:outline-none focus-visible:ring-2
              text-[color:var(--btn-color)] bg-white border-[color:var(--btn-color)]
              hover:bg-[color:var(--btn-color)] hover:text-white hover:border-transparent
              focus-visible:ring-[color:var(--focus-ring)]/60'
            >
              Sell
            </Link>
          </div>
          <div className='flex items-center space-x-2'>
            <ProfilButton />
            <ChevronDownIcon className='h-5 w-5 text-purple-500' />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavMain;
