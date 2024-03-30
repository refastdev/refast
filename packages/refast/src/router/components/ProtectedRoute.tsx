import { ReactNode } from 'react';

import { useAuth } from '../hooks';
import { Navigate } from './Navigate';

interface ProtectedRouteProps {
  children?: ReactNode;
  isAuth?: (token: any) => boolean;
  notAuthPath?: string;
}

export const ProtectedRoute = ({ children, isAuth, notAuthPath }: ProtectedRouteProps) => {
  const { token } = useAuth();
  if (isAuth && notAuthPath && !isAuth(token)) {
    return <Navigate to={notAuthPath} />;
  }
  return children;
};
