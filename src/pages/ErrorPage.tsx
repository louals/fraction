import * as React from 'react';
import { Link } from 'react-router-dom';
import phone from '../assets/images/phone.png';
import ChevronLeftIcon from '../assets/icons/chevron-left.svg?react';
import ChevronRightIcon from '../assets/icons/chevron-right.svg?react';

export default function ErrorPage(): React.ReactNode {
  return (
    <div className='flex justify-between'>
      <div className='flex flex-col gap-6'>
        <h1 className='text-2xl font-semibold'>Error 404</h1>
        <h2 className='text-4xl italic'>
          The page you're looking for can't be found
        </h2>
        <p>
          If there is any problem finding the page you’re looking for please
          contact support.
        </p>
        <ul>
          <li>
            <Link className='underline font-semibold' to='/'>
              FAQ
            </Link>
          </li>
          <li>
            <Link className='underline font-semibold' to='/'>
              Contact support
            </Link>
          </li>
        </ul>
        <Link
          className='text-xl font-semibold text-[var(--color-fraction-lilac-500)] flex items-center gap-2'
          to='/'
        >
          <ChevronLeftIcon />
          Go back to home page
        </Link>
      </div>
      <div className='relative'>
        <img className='w-[480px]' src={phone} alt='photo phone with house' />
        <Link
          className='font-semibold max-w-max px-12 py-3 border-[2px] border-transparent bg-[var(--color-fraction-violet-500)] rounded-xl text-white px-4 py-2 hover:bg-white hover:border-[var(--color-fraction-violet-500)] hover:text-[var(--color-fraction-violet-500)] transition duration-300 absolute bottom-30 right-15 flex items-center gap-2'
          to='/invest'
        >
          Start investing
          <ChevronRightIcon />
        </Link>
      </div>
    </div>
  );
}
