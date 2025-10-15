import type React from 'react';
import { fakeProjects } from '../data/projects';
import { Card } from '../components/CardProperty';
import { Link } from 'react-router-dom';
import ChevronRightIcon from '../assets/icons/chevron-right.svg?react';
import phoneInvest from '../assets/images/smartphone-invest.jpg';

/**
 * Page d'accueil : affiche une sélection de projets.
 * @returns Un nœud React.
 */
export default function Landing(): React.ReactNode {
  /**
   * Retourne les `n` premiers éléments du tableau.
   */
  const cardsVisible = fakeProjects.slice(0, 3);
  const brand = 'var(--color-fraction-violet-500)';

  return (
    <div>
      <h2 className='text-3xl font-bold italic'>Some projects</h2>
      <p className='italic text-sm font-[var(--color-fraction-light-400)]'>
        Some of your projects
      </p>

      <div className='grid gap-[20px] grid-cols-[repeat(auto-fit,minmax(300px,1fr))] mt-6'>
        {cardsVisible.map((p) => (
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
      <Link
        to='/invest'
        className='mt-4 flex w-max mx-auto gap-2 items-center justify-center rounded-2xl px-6 py-2
             border-2 select-none transition ease-out motion-safe:duration-200
             shadow-sm hover:shadow-lg will-change-[transform,box-shadow]
             motion-safe:hover:scale-[1.03] hover:-translate-y-0.5 active:scale-95
             focus-visible:outline-none focus-visible:ring-2
             text-white bg-[var(--color-fraction-violet-500)] border-transparent
             hover:bg-white hover:text-[var(--color-fraction-violet-500)]
             hover:border-[var(--color-fraction-violet-500)]
             focus-visible:ring-[var(--color-fraction-violet-500)]/60'
      >
        See more
        <ChevronRightIcon />
      </Link>
      {/* === How to invest ======================================= */}
      <section className='mt-16 rounded-3xl border border-violet-100/70 bg-gradient-to-b from-white to-[rgba(124,58,237,0.05)] p-4 md:p-6 shadow-[0_16px_40px_rgba(17,12,46,.08)]'>
        <div className='md:flex md:items-start md:gap-8'>
          {/* image place left side */}
          <figure className='max-w-[542px] overflow-hidden rounded-2xl ring-1 ring-violet-100 '>
            <img
              src={phoneInvest}
              alt='Using a phone to invest'
              className='h-full w-full object-cover transition-all duration-300 hover:scale-110'
            />
          </figure>
          {/* content sise right */}
          <div className=' mt-6 md:mt-0 px-1'>
            <h3 className='mb-4 text-right text-3xl md:text-4xl font-extrabold italic text-[var(--color-fraction-violet-500)]'>
              How to invest
            </h3>

            <ul className='mt-8 flex flex-col gap-6'>
              <li className='rounded-2xl border border-violet-200/80 bg-white/95 p-4 shadow-sm transition duration-500 hover:scale-105'>
                <div className='flex gap-4'>
                  <span
                    className='grid size-10 place-items-center shrink-0 rounded-full text-white font-bold shadow-[0_6px_18px_rgba(124,58,237,.35)]'
                    style={{ backgroundColor: brand }}
                  >
                    1
                  </span>
                  <div className='text-sm leading-relaxed text-zinc-700'>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitat.
                    </p>
                    <p className='mt-3 text-zinc-500'>
                      Ion ullamco laboris nisi ut aliquip ex ea commodo
                      consequat. Duis aute irure dolor in.
                    </p>
                  </div>
                </div>
              </li>

              {/* Steps 2–4 — compact cards */}
              {[
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.',
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.',
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.',
              ].map((txt, i) => (
                <li
                  key={i}
                  className='rounded-2xl border border-violet-200/70 bg-white/90 p-3 shadow-sm max-w-[90%] self-end transition duration-500 hover:scale-105'
                >
                  <div className='flex items-center gap-4'>
                    <span
                      className='grid size-8 place-items-center shrink-0 rounded-full text-white text-[13px] font-semibold shadow-[0_4px_14px_rgba(124,58,237,.30)]'
                      style={{ backgroundColor: brand }}
                    >
                      {i + 2}
                    </span>
                    <p className='text-sm text-zinc-700'>{txt}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      {/* === Why invest ======================================= */}
      <section className='mt-16'>
        <h3 className='mb-4 text-center text-3xl md:text-4xl font-extrabold italic text-[var(--color-fraction-violet-500)]'>
          Why Use Fraction for your investment?
        </h3>
        <p>
          Secure, transparent, and accessible—our platform makes real estate
          investing easy, with expert management and steady returns.
        </p>
        <div className='flex flex-col gap-6 mt-4'>
          <article className='flex relative transition-all duration-300 hover:scale-103'>
            <div className='px-8 pt-6 pb-10 w-[90%] rounded-[24px] border border-zinc-200 bg-white shadow-[0_10px_40px_rgba(17,12,46,.08)]'>
              <h3 className='text-3xl md:text-4xl font-extrabold text-[var(--color-fraction-violet-500)]'>
                Reason 1
              </h3>
              <p className='mt-6 max-w-[62ch] text-[15px] leading-7'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation. Lorem ipsum
                dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                minim veniam, quis nostrud exercitation.
              </p>
            </div>
            <div className='px-8 self-center max-h-max ml-[-10%] rounded-[24px] border bg-[var(--color-fraction-light-300)] border-[var(--color-fraction-blue-400)] p-2 shadow-[0_10px_40px_rgba(17,12,46,.08)]'>
              <img
                className='max-w-[160px]'
                src='/public/assets/img/flower-money.png'
                alt='flower-money'
              />
            </div>
          </article>
          <article className='flex relative transition-all duration-300 hover:scale-103'>
            <div className='px-8 pt-6 pb-10 w-[90%] rounded-[24px] border border-zinc-200 bg-white shadow-[0_10px_40px_rgba(17,12,46,.08)]'>
              <h3 className='text-3xl md:text-4xl font-extrabold text-[var(--color-fraction-violet-500)]'>
                Reason 2
              </h3>
              <p className='mt-6 max-w-[62ch] text-[15px] leading-7'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation. Lorem ipsum
                dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                minim veniam, quis nostrud exercitation.
              </p>
            </div>
            <div className='px-8 self-center max-h-max ml-[-10%] rounded-[24px] border bg-[var(--color-fraction-light-300)] border-[var(--color-fraction-blue-400)] p-2 shadow-[0_10px_40px_rgba(17,12,46,.08)]'>
              <img
                className='max-w-[160px]'
                src='/public/assets/img/people-look-tade.png'
                alt='flower-money'
              />
            </div>
          </article>
          <article className='flex relative transition-all duration-300 hover:scale-103'>
            <div className='px-8 pt-6 pb-10 w-[90%] rounded-[24px] border border-zinc-200 bg-white shadow-[0_10px_40px_rgba(17,12,46,.08)]'>
              <h3 className='text-3xl md:text-4xl font-extrabold text-[var(--color-fraction-violet-500)]'>
                Reason 3
              </h3>
              <p className='mt-6 max-w-[62ch] text-[15px] leading-7'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation. Lorem ipsum
                dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                minim veniam, quis nostrud exercitation. Lorem ipsum dolor sit
                amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                veniam, quis nostrud exercitation. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud exercitation. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation. Lorem ipsum dolor sit amet, consectetur adipiscing
                elit, sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
              </p>
            </div>
            <div className='px-8 self-center max-h-max ml-[-10%] rounded-[24px] border bg-[var(--color-fraction-light-300)] border-[var(--color-fraction-blue-400)] p-2 shadow-[0_10px_40px_rgba(17,12,46,.08)]'>
              <img
                className='max-w-[160px]'
                src='/public/assets/img/lot-of-mails.png'
                alt='flower-money'
              />
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
