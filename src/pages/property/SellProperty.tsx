import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import StepCircles from '../../components/StepCircles';
import Step1Basic from '../../components/property/sell/Step1Basic';
import Step2Plans from '../../components/property/sell/Step2Plans';
import Step3Legal from '../../components/property/sell/Step3Legal';
import { createDraftProperty } from '../../lib/firebase-io';
import { auth, db } from '../../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function PropertySellWizard() {
  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const [propId, setPropId] = React.useState<string | null>(null);
  const [creating, setCreating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [authUser, setAuthUser] = React.useState(() => auth.currentUser);
  const [isSeller, setIsSeller] = React.useState<boolean | null>(null);
  const nav = useNavigate();

  // 1) Auth réactive
  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setAuthUser(u));
    return () => unsub();
  }, []);

  // 2) Lis le profil Firestore pour savoir si vendeur (tolère users.{status} ou users.documents.status)
  React.useEffect(() => {
    if (!authUser) {
      setIsSeller(null);
      return;
    }
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'users', authUser.uid));
        const data = snap.data() || {};
        const status = data.status ?? data.documents?.status;
        setIsSeller(status === 'vendeur'); // vendeur peut vendre (et aussi acheter)
      } catch (e: any) {
        console.warn('read user profile failed:', e?.message ?? e);
        setIsSeller(null);
      }
    })();
  }, [authUser?.uid]);

  // 3) Crée le brouillon UNE seule fois quand on a un user vendeur
  React.useEffect(() => {
    if (!authUser || isSeller !== true || propId || creating) return;
    setCreating(true);
    createDraftProperty(authUser.uid)
      .then((id) => setPropId(id))
      .catch((e: any) => setError(e?.message ?? 'Erreur création brouillon'))
      .finally(() => setCreating(false));
  }, [authUser, isSeller, propId, creating]);

  // --- Rendus d'état ---
  if (!authUser)
    return (
      <p className='mt-6 text-red-600'>
        Veuillez vous connecter pour vendre une propriété.
      </p>
    );
  if (isSeller === false) {
    return (
      <div className='mt-6 rounded-xl border p-4'>
        <h2 className='text-lg font-semibold'>Accès restreint</h2>
        <p className='mt-1 text-sm'>
          Ton statut est <b>acheteur</b>. Tu peux acheter 🛒, mais pour publier
          une propriété tu dois passer en <b>vendeur</b>.
        </p>
      </div>
    );
  }
  if (error) {
    return (
      <div className='mt-6 rounded-xl border p-4'>
        <p className='text-red-600 font-medium'>
          Impossible de créer le brouillon.
        </p>
        <pre className='mt-2 text-xs opacity-80'>{String(error)}</pre>
      </div>
    );
  }
  if (!propId || creating || isSeller !== true) {
    return <p className='mt-6'>Initialisation du brouillon…</p>;
  }

  // --- Wizard normal ---
  return (
    <section className='mx-auto max-w-[104ch] p-6'>
      <header className='mb-6'>
        <h1 className='text-2xl font-semibold'>Vendre une propriété</h1>
        <p className='text-sm text-zinc-600'>
          Complète les 3 étapes pour soumettre ton annonce (Canada).
        </p>
      </header>

      <StepCircles current={step} />

      <div className='mt-6 rounded-2xl border p-6'>
        {step === 1 && <Step1Basic propId={propId} onNext={() => setStep(2)} />}
        {step === 2 && (
          <Step2Plans
            propId={propId}
            onPrev={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <Step3Legal
            propId={propId}
            onPrev={() => setStep(2)}
            onFinish={() => nav('/')}
          />
        )}
      </div>

      <div className='mt-4 flex gap-3'>
        <button
          className='inline-flex items-center justify-center rounded-3xl px-6 py-2 border-2 bg-white select-none transition ease-out
                     text-[var(--color-fraction-violet-500)] border-[var(--color-fraction-violet-500)]
                     hover:shadow-lg motion-safe:duration-200 will-change-[transform,box-shadow]
                     motion-safe:hover:scale-[1.03] hover:-translate-y-0.5 active:scale-95'
          onClick={() => setStep((p) => (p > 1 ? ((p - 1) as 1 | 2 | 3) : p))}
        >
          Back
        </button>
        <button
          className='inline-flex items-center justify-center rounded-3xl px-6 py-2 border-2 select-none transition ease-out
                     text-white bg-[var(--color-fraction-violet-500)] border-transparent
                     shadow-sm hover:shadow-lg motion-safe:duration-200 will-change-[transform,box-shadow]
                     motion-safe:hover:scale-[1.03] hover:-translate-y-0.5 active:scale-95
                     hover:bg-white hover:text-[var(--color-fraction-violet-500)] hover:border-[var(--color-fraction-violet-500)]'
          onClick={() => setStep((p) => (p < 3 ? ((p + 1) as 1 | 2 | 3) : p))}
        >
          Next
        </button>
      </div>
    </section>
  );
}
