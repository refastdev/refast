import { useRoutes } from '@refastdev/refast-router';
import type { RoutesOption } from '@refastdev/refast-router';
import React from 'React';

export interface RefastProps {
  routerOption?: RoutesOption;
}

export const Refast: React.FC<RefastProps> = ({ routerOption }) => {
  const data = useRoutes(routerOption || {});
  return data ? <data.Routes /> : <div></div>;
};
