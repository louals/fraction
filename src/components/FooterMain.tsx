import type { ReactElement, ReactNode } from 'react';

export default function FooterMain(): ReactElement {
  return (
    <footer className="col-span-full grid grid-cols-subgrid bg-fraction-dark-500 text-white">
      <div className="col-start-2 col-end-3  py-12">
        {/* Top grid */}
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:grid-cols-4">
          {/* Company */}
          <nav aria-label="Company" className="space-y-4">
            <h3 className="text-base font-semibold tracking-wide">Company</h3>
            <ul className="space-y-2 text-[13px] leading-6 text-white/80">
              <li>
                <a className="transition hover:text-white" href="#">
                  About us
                </a>
              </li>
              <li>
                <a className="transition hover:text-white" href="#">
                  Careers
                </a>
              </li>
              <li>
                <a className="transition hover:text-white" href="#">
                  Press
                </a>
              </li>
            </ul>
          </nav>

          {/* Resources */}
          <nav aria-label="Resources" className="space-y-4">
            <h3 className="text-base font-semibold tracking-wide">Resources</h3>
            <ul className="space-y-2 text-[13px] leading-6 text-white/80">
              <li>
                <a className="transition hover:text-white" href="#">
                  Contact us
                </a>
              </li>
              <li>
                <a className="transition hover:text-white" href="#">
                  How it works
                </a>
              </li>
              <li>
                <a className="transition hover:text-white" href="#">
                  FAQ
                </a>
              </li>
              <li>
                <a className="transition hover:text-white" href="#">
                  Confidentiality terms
                </a>
              </li>
            </ul>
          </nav>

          {/* Invest */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold tracking-wide">Invest</h3>
          </div>

          {/* Social */}
          <div className="space-y-4 sm:col-span-2 md:col-span-1 sm:justify-self-end">
            <h3 className="text-base font-semibold tracking-wide">Follow us</h3>
            <div className="flex items-center gap-4">
              <SocialIcon label="Instagram" href="#">
                <svg
                  viewBox="0 0 24 24"
                  role="img"
                  aria-label="Instagram"
                  className="h-5 w-5"
                >
                  <path
                    d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle cx="17.5" cy="6.5" r="1.5" />
                </svg>
              </SocialIcon>

              <SocialIcon label="LinkedIn" href="#">
                <svg
                  viewBox="0 0 24 24"
                  role="img"
                  aria-label="LinkedIn"
                  className="h-5 w-5"
                >
                  <path
                    d="M4 10h3v10H4zM5.5 4a1.75 1.75 0 1 1 0 3.5A1.75 1.75 0 0 1 5.5 4ZM10 10h3v1.6c.6-1 1.7-1.9 3.4-1.9 2.4 0 4.6 1.6 4.6 5.1V20h-3v-4.4c0-1.6-.6-2.7-2.1-2.7-1.1 0-1.8.7-2.1 1.5-.1.2-.1.6-.1.9V20h-3V10z"
                    fill="currentColor"
                  />
                </svg>
              </SocialIcon>

              <SocialIcon label="Facebook" href="#">
                <svg
                  viewBox="0 0 24 24"
                  role="img"
                  aria-label="Facebook"
                  className="h-5 w-5"
                >
                  <path
                    d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v3H8v3h3v6h3v-6h2.5l.5-3H14V9c0-.6.4-1 1-1Z"
                    fill="currentColor"
                  />
                </svg>
              </SocialIcon>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 h-px w-full bg-white/10" />

        {/* Bottom bar as grid */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 items-center">
          {/* Logo + Brand  */}
          <div className="col-start-1 flex items-center gap-3 font-semibold">
            <img
              src="/assets/img/logo-fraction-footer.png"
              alt="Fraction logo"
              className="max-w-[150px] object-contain"
            />
          </div>

          {/* Address */}
          <address className="col-start-2 not-italic text-sm text-white/80 self-end">
            Street , city, country, post adress
          </address>
        </div>
      </div>
    </footer>
  );
}

interface SocialIconProps {
  label: string;
  href: string;
  children: ReactNode;
}

function SocialIcon({ label, href, children }: SocialIconProps): ReactElement {
  return (
    <a
      href={href}
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#221c49] shadow-sm ring-1 ring-white/90 transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
    >
      {children}
    </a>
  );
}
