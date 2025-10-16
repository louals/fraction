import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import StepCircles from '../../components/StepCircles';
import Step1Basic from '../../components/property/sell/Step1Basic';
import Step2Plans from '../../components/property/sell/Step2Plans';
import Step3Legal from '../../components/property/sell/Step3Legal';
import { auth } from '../../firebase/firebase';
import {
  createProperty,
  reservePropertyId,
  uploadFiles,
} from '../../lib/firebase-io';
import {
  CA_POSTAL_REGEX,
  type PropertyDoc,
  type ProvinceCA,
} from '../../types/realestate';
import { onAuthStateChanged, type User } from 'firebase/auth';

type BasicForm = {
  title: string;
  description: string;
  priceCAD: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  province: ProvinceCA;
  postalCode: string;
  bedrooms: string;
  bathrooms: string;
  sizeSqft: string;
};

export default function PropertySellWizard() {
  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState<number>(0);
  const [authUser, setAuthUser] = React.useState<User | null>(auth.currentUser);
  const nav = useNavigate();

  const [basic, setBasic] = React.useState<BasicForm>({
    title: '',
    description: '',
    priceCAD: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    province: 'QC',
    postalCode: '',
    bedrooms: '',
    bathrooms: '',
    sizeSqft: '',
  });
  const [photos, setPhotos] = React.useState<File[]>([]);
  const [plans, setPlans] = React.useState<File[]>([]);
  const [legal, setLegal] = React.useState<File[]>([]);

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setAuthUser(u));
    return () => unsub();
  }, []);

  function validateAll(): string | null {
    if (!basic.title.trim()) return 'Titre requis';
    if (
      !basic.addressLine1.trim() ||
      !basic.city.trim() ||
      !basic.postalCode.trim()
    ) {
      return 'Adresse incomplète';
    }
    if (!CA_POSTAL_REGEX.test(basic.postalCode)) {
      return 'Code postal canadien invalide (ex: H2X 1Y4)';
    }
    const price = Number(basic.priceCAD);
    if (Number.isNaN(price) || price <= 0) return 'Prix invalide';
    if (photos.length === 0) return 'Ajoute au moins une photo';
    return null;
  }

  async function handleSubmitFinal() {
    const u = auth.currentUser;
    if (!u) {
      setError('Veuillez vous reconnecter.');
      return;
    }
    const v = validateAll();
    if (v) {
      setError(v);
      return;
    }
    setError(null);
    setSubmitting(true);

    try {
      const id = reservePropertyId();
      const base = `users/${u.uid}/properties/${id}`;

      const photoRes = await uploadFiles(photos, `${base}/photos`, (p) =>
        setProgress(p)
      );
      const planRes = plans.length
        ? await uploadFiles(plans, `${base}/plans`, (p) => setProgress(p))
        : [];
      const legalRes = legal.length
        ? await uploadFiles(legal, `${base}/legal`, (p) => setProgress(p))
        : [];

      const payload: PropertyDoc = {
        ownerId: u.uid,
        status: 'submitted',
        createdAt: null,
        updatedAt: null,
        title: basic.title.trim(),
        description: basic.description.trim(),
        priceCAD: Number(basic.priceCAD),
        addressLine1: basic.addressLine1.trim(),
        addressLine2: basic.addressLine2.trim() || undefined,
        city: basic.city.trim(),
        province: basic.province,
        postalCode: basic.postalCode.toUpperCase(),
        bedrooms: basic.bedrooms ? Number(basic.bedrooms) : null,
        bathrooms: basic.bathrooms ? Number(basic.bathrooms) : null,
        sizeSqft: basic.sizeSqft ? Number(basic.sizeSqft) : null,
        photoPaths: photoRes.map((r) => r.path),
        planPaths: planRes.map((r) => r.path),
        legalDocPaths: legalRes.map((r) => r.path),
      };

      await createProperty(id, payload);
      nav('/');
    } catch (e: unknown) {
      const msg =
        e instanceof Error ? e.message : 'Erreur lors de la soumission';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className='min-h-[80vh] w-full bg-gradient-to-t from-[var(--color-fraction-blue-50)] to-white'>
      <div className='mx-auto max-w-5xl px-4 py-10 md:py-14'>
        {/* Header */}
        <div className='mb-6 text-center'>
          <h1 className='text-2xl font-semibold text-zinc-900 md:text-3xl'>
            Vendre une propriété
          </h1>
          <p className='mt-1 text-sm text-zinc-500'>
            Complète les informations en 3 étapes claires.
          </p>
        </div>

        {/* Stepper */}
        <div className='mx-auto mb-6 max-w-4xl'>
          <StepCircles current={step} />
        </div>

        {/* Card */}
        <div className='rounded-3xl border border-violet-100/60 bg-white/90 p-6 shadow-[0_20px_60px_rgba(17,12,46,.08),0_8px_24px_rgba(17,12,46,.04)] md:p-8'>
          {!authUser ? (
            <p className='mt-2 text-red-600'>
              Veuillez vous connecter pour vendre une propriété.
            </p>
          ) : (
            <>
              {step === 1 && (
                <Step1Basic
                  value={basic}
                  onChange={setBasic}
                  photos={photos}
                  onPhotosChange={setPhotos}
                  onNext={() => setStep(2)}
                />
              )}

              {step === 2 && (
                <Step2Plans
                  value={plans}
                  onChange={setPlans}
                  onPrev={() => setStep(1)}
                  onNext={() => setStep(3)}
                />
              )}

              {step === 3 && (
                <Step3Legal
                  value={legal}
                  onChange={setLegal}
                  onPrev={() => setStep(2)}
                  onSubmit={handleSubmitFinal}
                  submitting={submitting}
                  progress={progress}
                  error={error}
                />
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
