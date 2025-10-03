import { db, storage } from '../firebase/firebase';
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  type UploadTask,
} from 'firebase/storage';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import type { PropertyDoc } from '../types/realestate';

export type UploadResult = { path: string; downloadURL: string };

function safeUUID(): string {
  if (typeof crypto !== 'undefined' && crypto?.randomUUID)
    return crypto.randomUUID();
  return `${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

/** Upload de plusieurs fichiers vers Storage (progress au besoin) */
export async function uploadFiles(
  files: File[],
  basePath: string,
  onProgress?: (percent: number) => void
): Promise<UploadResult[]> {
  const results: UploadResult[] = [];

  for (const file of files) {
    const fileRef = ref(storage, `${basePath}/${safeUUID()}_${file.name}`);
    const task: UploadTask = uploadBytesResumable(fileRef, file, {
      contentType: file.type,
    });

    await new Promise<void>((resolve, reject) => {
      task.on(
        'state_changed',
        (snap) => {
          if (onProgress) {
            const percent = Math.round(
              (snap.bytesTransferred / snap.totalBytes) * 100
            );
            onProgress(percent);
          }
        },
        reject,
        () => resolve()
      );
    });

    const downloadURL = await getDownloadURL(task.snapshot.ref);
    results.push({ path: task.snapshot.ref.fullPath, downloadURL });
  }

  return results;
}

/** Crée un brouillon lié à l'utilisateur (ownerId) et renvoie l'id du doc */
export async function createDraftProperty(ownerId: string): Promise<string> {
  const col = collection(db, 'properties');

  const payload: PropertyDoc = {
    ownerId,
    status: 'draft',
    createdAt: null,
    updatedAt: null,
    title: '',
    description: '',
    priceCAD: null,
    addressLine1: '',
    city: '',
    province: 'QC',
    postalCode: '',
    bedrooms: null,
    bathrooms: null,
    sizeSqft: null,
    photoPaths: [],
    planPaths: [],
    legalDocPaths: [],
    coverPhotoPath: undefined,
  };

  const refDoc = await addDoc(col, payload as any);

  // ⬇️ best-effort: on ne bloque pas le retour d'ID si les rules refusent l'update
  updateDoc(refDoc, {
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  } as any).catch((e) => {
    console.warn('Timestamp update failed (non-blocking):', e?.message ?? e);
  });

  return refDoc.id;
}

/** Patch partiel d'une propriété (avec mise à jour updatedAt) */
export async function patchProperty(
  id: string,
  partial: Partial<PropertyDoc>
): Promise<void> {
  const refDoc = doc(db, 'properties', id);
  await updateDoc(refDoc, {
    ...partial,
    updatedAt: serverTimestamp(),
  } as any);
}

/** Lecture d'une propriété par id (ou null) */
export async function getProperty(id: string): Promise<PropertyDoc | null> {
  const refDoc = doc(db, 'properties', id);
  const snap = await getDoc(refDoc);
  return snap.exists()
    ? ({ id: snap.id, ...snap.data() } as PropertyDoc)
    : null;
}

/** Set/merge complet si tu préfères gérer tout l'objet à la fois */
export async function setProperty(
  id: string,
  payload: PropertyDoc
): Promise<void> {
  const refDoc = doc(db, 'properties', id);
  await setDoc(refDoc, { ...payload, updatedAt: serverTimestamp() } as any, {
    merge: true,
  });
}
