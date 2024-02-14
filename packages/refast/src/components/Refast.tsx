import React from 'React';

import { I18n } from '../i18n/components';
import { I18nOptions } from '../i18n/options';
import type { RoutesOption } from '../router';
import { useRoutes } from '../router';

export interface RefastProps {
  routesOption?: RoutesOption;
  i18nOptions?: I18nOptions;
  children?: React.JSX.Element;
}

export const Refast: React.FC<RefastProps> = ({ routesOption, i18nOptions, children }) => {
  if (routesOption) {
    const data = useRoutes(routesOption || {});
    return <I18n options={i18nOptions}>{data ? <data.Routes /> : children}</I18n>;
  }
  return <I18n options={i18nOptions}>{children}</I18n>;
};
