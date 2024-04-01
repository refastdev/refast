import { ReactNode } from 'react';

import { useAuth } from '../hooks';
import { Navigate } from './Navigate';

interface ProtectedRouteProps {
  children: ReactNode;
  isAuth?: (token: any) => boolean;
}

export const ProtectedRoute = ({ children, isAuth }: ProtectedRouteProps) => {
  const { token, notAuthPath } = useAuth();
  if (isAuth && notAuthPath && !isAuth(token)) {
    return <Navigate to={notAuthPath} />;
  }
  return <>{children}</>;
};
