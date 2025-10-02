import type React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './UseAuth'; // ⚠️ vérifie la casse du fichier

type NavState = { from?: { pathname: string } };

/**
 * Empêche l'accès à la page si l'utilisateur est déjà connecté.
 * Redirige vers la page d'origine (state.from.pathname) ou '/'.
 */
export function PublicOnly({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  const { user, loading } = useAuth();
  const location = useLocation();
  const to = (location.state as NavState | null)?.from?.pathname ?? '/';

  if (loading) return null;
  if (user) return <Navigate to={to} replace />;
  return children;
}
