import type { Timestamp } from 'firebase/firestore';

export type ProvinceCA =
  | 'AB'
  | 'BC'
  | 'MB'
  | 'NB'
  | 'NL'
  | 'NS'
  | 'NT'
  | 'NU'
  | 'ON'
  | 'PE'
  | 'QC'
  | 'SK'
  | 'YT';

export type PropertyStatus = 'draft' | 'submitted' | 'published';

export type PropertyDoc = {
  id?: string;
  ownerId: string; // uid firebase
  status: PropertyStatus;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;

  // Étape 1 — infos de base
  title: string;
  description: string;
  priceCAD: number | null;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: ProvinceCA;
  postalCode: string; // format canadien
  bedrooms?: number | null;
  bathrooms?: number | null;
  sizeSqft?: number | null;

  photoPaths: string[]; // chemins Storage (ex: users/{uid}/properties/{propId}/photos/...)
  coverPhotoPath?: string; // optionnel

  // Étape 2 — plans
  planPaths: string[]; // images ou PDF

  // Étape 3 — docs légaux
  legalDocPaths: string[]; // PDF
};

export const PROVINCES_CA: { code: ProvinceCA; label: string }[] = [
  { code: 'AB', label: 'Alberta' },
  { code: 'BC', label: 'British Columbia' },
  { code: 'MB', label: 'Manitoba' },
  { code: 'NB', label: 'New Brunswick' },
  { code: 'NL', label: 'Newfoundland and Labrador' },
  { code: 'NS', label: 'Nova Scotia' },
  { code: 'NT', label: 'Northwest Territories' },
  { code: 'NU', label: 'Nunavut' },
  { code: 'ON', label: 'Ontario' },
  { code: 'PE', label: 'Prince Edward Island' },
  { code: 'QC', label: 'Québec' },
  { code: 'SK', label: 'Saskatchewan' },
  { code: 'YT', label: 'Yukon' },
];

export const CA_POSTAL_REGEX =
  /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i;
