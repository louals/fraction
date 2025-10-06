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
  // Hooks toujours au top-level (pas d'early-return)
  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState<number>(0);
  const [authUser, setAuthUser] = React.useState<User | null>(auth.currentUser);
  const nav = useNavigate();

  // ---- état centralisé (mémoire uniquement) ----
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

  // Auth réactive (évite user null au premier rendu)
  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setAuthUser(u));
    return () => unsub();
  }, []);

  // ---- validation globale (utilisée au submit) ----
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

  // ---- SUBMIT FINAL : upload fichiers puis création du doc ----
  async function handleSubmitFinal() {
    // Re-lecture locale pour TS (authUser peut être nul)
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
      // 1) id local réservé (pas d’écriture)
      const id = reservePropertyId();

      // 2) chemin Storage lié au user (rules plus strictes)
      const base = `users/${u.uid}/properties/${id}`;

      // 3) uploads (on upload maintenant seulement)
      const photoRes = await uploadFiles(photos, `${base}/photos`, (p) =>
        setProgress(p)
      );
      const planRes = plans.length
        ? await uploadFiles(plans, `${base}/plans`, (p) => setProgress(p))
        : [];
      const legalRes = legal.length
        ? await uploadFiles(legal, `${base}/legal`, (p) => setProgress(p))
        : [];

      // 4) payload final strictement typé (aucun undefined côté Firestore grâce à la couche I/O)
      const payload: PropertyDoc = {
        ownerId: u.uid,
        status: 'submitted',
        createdAt: null,
        updatedAt: null,

        title: basic.title.trim(),
        description: basic.description.trim(),
        priceCAD: Number(basic.priceCAD),
        addressLine1: basic.addressLine1.trim(),
        addressLine2: basic.addressLine2.trim() || undefined, // filtré dans createProperty()
        city: basic.city.trim(),
        province: basic.province,
        postalCode: basic.postalCode.toUpperCase(),
        bedrooms: basic.bedrooms ? Number(basic.bedrooms) : null,
        bathrooms: basic.bathrooms ? Number(basic.bathrooms) : null,
        sizeSqft: basic.sizeSqft ? Number(basic.sizeSqft) : null,

        photoPaths: photoRes.map((r) => r.path),
        planPaths: planRes.map((r) => r.path),
        legalDocPaths: legalRes.map((r) => r.path),
        // coverPhotoPath: (omettre si pas choisi)
      };

      // 5) écriture unique (création) en base
      await createProperty(id, payload);

      // 6) redirection / succès
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
    <section className='mx-auto max-w-[104ch] p-6'>
      <StepCircles current={step} />

      <div className='mt-6 rounded-3xl border bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,.08)]'>
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
    </section>
  );
}
