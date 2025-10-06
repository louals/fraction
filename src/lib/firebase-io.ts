// src/lib/firebase-io.ts
import { db, storage } from '../firebase/firebase';
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  type UploadTask,
} from 'firebase/storage';
import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import type { PropertyDoc } from '../types/realestate';

export type UploadResult = { path: string; downloadURL: string };

/** Retire toutes les clés = undefined avant d'envoyer à Firestore */
function omitUndefined<T extends Record<string, unknown>>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as Partial<T>;
}

/**
 * Upload d'une liste de fichiers vers Firebase Storage.
 * - basePath ex: `users/${uid}/properties/${propId}/photos`
 * - onProgress: callback 0..100
 */
export async function uploadFiles(
  files: File[],
  basePath: string,
  onProgress?: (percent: number) => void
): Promise<UploadResult[]> {
  const results: UploadResult[] = [];

  for (const file of files) {
    const unique =
      (crypto as any)?.randomUUID?.() ??
      `${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const fileRef = ref(storage, `${basePath}/${unique}_${file.name}`);

    const task: UploadTask = uploadBytesResumable(fileRef, file, {
      contentType: file.type,
    });

    await new Promise<void>((resolve, reject) => {
      task.on(
        'state_changed',
        (s) =>
          onProgress?.(Math.round((s.bytesTransferred / s.totalBytes) * 100)),
        reject,
        () => resolve()
      );
    });

    const downloadURL = await getDownloadURL(task.snapshot.ref);
    results.push({ path: task.snapshot.ref.fullPath, downloadURL });
  }

  return results;
}

/**
 * Réserve un id local pour un document `properties/{id}`.
 *  Ne fait AUCUNE écriture réseau : c'est juste un id.
 */
export function reservePropertyId(): string {
  return doc(collection(db, 'properties')).id;
}

/**
 * Création FINALE de la propriété (écriture unique).
 * - Ajoute createdAt/updatedAt = serverTimestamp()
 * - Filtre les `undefined`
 */
export async function createProperty(
  id: string,
  payload: PropertyDoc
): Promise<void> {
  const clean = omitUndefined({
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  } as any);

  await setDoc(doc(db, 'properties', id), clean as any, { merge: false });
}

/**
 * (Optionnel) Mise à jour partielle après création.
 * - Utilise setDoc(..., {merge:true}) pour éviter les erreurs de champs manquants
 * - Ajoute updatedAt = serverTimestamp()
 */
export async function updateProperty(
  id: string,
  partial: Partial<PropertyDoc>
): Promise<void> {
  const clean = omitUndefined({
    ...partial,
    updatedAt: serverTimestamp(),
  } as any);

  await setDoc(doc(db, 'properties', id), clean as any, { merge: true });
}

/** Lecture typée d'une propriété */
export async function getProperty(id: string): Promise<PropertyDoc | null> {
  const refDoc = doc(db, 'properties', id);
  const snap = await getDoc(refDoc);
  return snap.exists()
    ? ({ id: snap.id, ...snap.data() } as PropertyDoc)
    : null;
}
