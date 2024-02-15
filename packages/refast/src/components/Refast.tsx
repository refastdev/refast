import { I18n, I18nOptions } from '@refastdev/i18n';
import React from 'React';

import type { RoutesOption } from '../router';
import { useRoutes } from '../router';

export interface RefastProps {
  routes?: RoutesOption;
  i18n?: I18nOptions;
  children?: React.JSX.Element;
  className?: string | undefined;
  style?: React.CSSProperties | undefined;
}

export const Refast: React.FC<RefastProps> = ({ children, className, i18n, routes, style }) => {
  let childrenElement: React.JSX.Element | undefined;
  if (routes) {
    const data = useRoutes(routes || {});
    if (i18n) {
      childrenElement = <I18n i18n={i18n}>{data ? <data.Routes /> : children}</I18n>;
    } else {
      childrenElement = data ? <data.Routes /> : children;
    }
  } else {
    if (i18n) {
      childrenElement = <I18n i18n={i18n}>{children}</I18n>;
    } else {
      childrenElement = children;
    }
  }
  return (
    <div id="refast-root" style={style} className={className}>
      {childrenElement}
    </div>
  );
};
