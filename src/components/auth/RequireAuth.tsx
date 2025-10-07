// src/components/auth/RequireAuth.tsx
import type React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './UseAuth';

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Avoid flicker while auth state is loading
  if (loading) return <div className="p-8">Loading…</div>;

  // Not signed in → go to login
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Signed in but e-mail not verified → force verification
  // (If your verify page itself is wrapped by RequireAuth, exclude it to avoid loops.)
  if (!user.emailVerified) {
    if (location.pathname !== '/verify-email') {
      return <Navigate to="/verify-email" replace state={{ from: location }} />;
    }
  }

  return children;
}
