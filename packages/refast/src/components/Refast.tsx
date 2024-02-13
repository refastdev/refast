import React from 'React';

import { useRoutes } from '../router';
import type { RoutesOption } from '../router/';

export interface RefastProps {
  routerOption?: RoutesOption;
}

export const Refast: React.FC<RefastProps> = ({ routerOption }) => {
  const data = useRoutes(routerOption || {});
  return data ? <data.Routes /> : <div></div>;
};
