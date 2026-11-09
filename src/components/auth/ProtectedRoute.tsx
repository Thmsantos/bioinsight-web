import { Navigate, Outlet } from 'react-router-dom';
import { storage } from '@/utils/storage';

export function ProtectedRoute() {
  const token = storage.get<string>('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}