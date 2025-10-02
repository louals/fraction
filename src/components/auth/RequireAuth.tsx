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

  if (loading) return <div className='p-8'>Loading…</div>; // évite le flash
  if (!user) return <Navigate to='/login' replace state={{ from: location }} />;
  return children;
}
