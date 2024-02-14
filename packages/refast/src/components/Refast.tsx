import React from 'React';

import type { RoutesOption } from '../router';
import { useRoutes } from '../router';

export interface RefastProps {
  routesOption?: RoutesOption;
  children?: React.JSX.Element;
}

export const Refast: React.FC<RefastProps> = ({ routesOption, children }) => {
  if (routesOption) {
    const data = useRoutes(routesOption || {});
    return data ? <data.Routes /> : <div>{children}</div>;
  }
  return <div>{children}</div>;
};
