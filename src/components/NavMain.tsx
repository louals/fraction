import { Link } from 'react-router-dom';
import ProfilButton from './ProfilButton';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

function NavMain() {
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
            <Link to='/oneProductDetails'>build detail page</Link>
          </div>
        </div>
        <div className='flex items-center space-x-2'>
          <ProfilButton />
          <ChevronDownIcon className='h-5 w-5 text-purple-500' />
        </div>
      </div>
    </nav>
  );
}

export default NavMain;
