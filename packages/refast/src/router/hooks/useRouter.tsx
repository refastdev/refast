import { components, hooks, utils } from '@generouted/react-router/client';
import { useLocation } from 'react-router-dom';

export type RouterPathType = string;
export type RouterModalPathType = string;
export type RouterParamsType = any;

// export const { Link, Navigate } = components<RouterPathType, RouterParamsType>()
const h = hooks<RouterPathType, RouterParamsType, RouterModalPathType>();
const u = utils<RouterPathType, RouterParamsType>();

const useParams = h.useParams;
const useModals = h.useModals;
const redirect = u.redirect;

export function useNavigate() {
  const navigate = h.useNavigate();
  const to = (path?: RouterPathType, options?: RouterParamsType) => {
    path = path || '/';
    navigate(path, options);
  };
  return {
    to,
    home: () => to(),
  };
}

export { useParams, useModals, useLocation };
export { redirect };
