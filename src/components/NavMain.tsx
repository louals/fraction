import { useContext } from 'react';
import { Link } from 'react-router-dom';
import ProfilButton from './ProfilButton';
import type { ButtonVars } from '../types/ui';
import { AuthContext } from './auth/AuthContext';

function NavMain() {
  // Read authentication state from context
  const { user, loading } = useContext(AuthContext);

  // Reusable CSS variable sets for button colors (kept inline for Tailwind interop)
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

  // Avoid rendering navigation while auth state is resolving
  if (loading) return null;

  return (
    <nav className="col-span-full grid grid-cols-subgrid">
      {/* Main nav row: logo + primary links on the left, auth/actions on the right */}
      <div className="col-start-2 col-end-3 flex flex-row justify-between pt-[40px] pb-[16px] border-b-4 border-white">
        {/* Left: brand + top-level navigation */}
        <div className="flex flex-row gap-[40px] items-center">
          <Link to="/">
            <img
              src="/assets/img/logo-fraction-nav.png"
              alt="Fraction logo"
              className="max-w-[210px]"
            />
          </Link>

          {/* Primary site links */}
          <div className="flex flex-row gap-[29px]">
            <Link to="/invest">Invest</Link>
            <Link to="/">How it works</Link>
            <Link to="/">About us</Link>
            <Link to="/">Learn</Link>
          </div>
        </div>

        {/* Right: authenticated action buttons or auth entry points */}
        <div className="flex flex-row gap-6">
          {user ? (
            <>
              {/* Authenticated: quick actions */}
              <div className="flex flex-wrap items-center gap-3">
                {/* CTA: Transfer funds (filled style) */}
                <Link
                  to="/transfer"
                  style={violetVars}
                  className="inline-flex items-center justify-center rounded-3xl px-6 py-2
                  border-2 select-none transition ease-out motion-safe:duration-200
                  shadow-sm hover:shadow-lg will-change-[transform,box-shadow]
                  motion-safe:hover:scale-[1.03] hover:-translate-y-0.5 active:scale-95
                  focus-visible:outline-none focus-visible:ring-2
                  text-white bg-[color:var(--btn-color)] border-transparent
                  hover:bg-white hover:text-[color:var(--btn-color)]
                  hover:border-[color:var(--btn-color)]
                  focus-visible:ring-[color:var(--focus-ring)]/60"
                >
                  Transfer funds
                </Link>

                {/* CTA: Buy (outlined → filled on hover) */}
                <Link
                  to="/buy"
                  style={greenVars}
                  className="inline-flex items-center justify-center rounded-3xl px-6 py-2
                  border-2 select-none transition ease-out motion-safe:duration-200
                  shadow-sm hover:shadow-lg will-change-[transform,box-shadow]
                  motion-safe:hover:scale-[1.03] hover:-translate-y-0.5 active:scale-95
                  focus-visible:outline-none focus-visible:ring-2
                  text-[color:var(--btn-color)] bg-white border-[color:var(--btn-color)]
                  hover:bg-[color:var(--btn-color)] hover:text-white hover:border-transparent
                  focus-visible:ring-[color:var(--focus-ring)]/60"
                >
                  Buy
                </Link>

                {/* CTA: Sell (outlined → filled on hover) */}
                <Link
                  to="/sell"
                  style={redVars}
                  className="inline-flex items-center justify-center rounded-3xl px-6 py-2
                  border-2 select-none transition ease-out motion-safe:duration-200
                  shadow-sm hover:shadow-lg will-change-[transform,box-shadow]
                  motion-safe:hover:scale-[1.03] hover:-translate-y-0.5 active:scale-95
                  focus-visible:outline-none focus-visible:ring-2
                  text-[color:var(--btn-color)] bg-white border-[color:var(--btn-color)]
                  hover:bg-[color:var(--btn-color)] hover:text-white hover:border-transparent
                  focus-visible:ring-[color:var(--focus-ring)]/60"
                >
                  Sell
                </Link>
              </div>

              {/* Profile menu (avatar + dropdown) */}
              <div className="flex items-center">
                <ProfilButton />
              </div>
            </>
          ) : (
            // Unauthenticated: entry points to auth
            <div className="flex items-center gap-3">
              {/* Log in (outlined) */}
              <Link
                to="/login"
                style={violetVars}
                className="inline-flex items-center justify-center rounded-3xl px-6 py-2 border-2
                text-[color:var(--btn-color)] bg-white border-[color:var(--btn-color)]
                hover:bg-[color:var(--btn-color)] hover:text-white hover:border-transparent
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)]/60"
              >
                Log in
              </Link>

              {/* Sign up (filled) */}
              <Link
                to="/signup"
                style={violetVars}
                className="inline-flex items-center justify-center rounded-3xl px-6 py-2
                text-white bg-[color:var(--btn-color)] border-2 border-transparent
                hover:bg-white hover:text-[color:var(--btn-color)] hover:border-[color:var(--btn-color)]
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)]/60"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavMain;
