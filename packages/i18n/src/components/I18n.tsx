import React from 'React';

import { I18nContext, I18nContextData } from '../common/i18n';
import { I18nOptions } from '../options';

interface I18nProps {
  children?: React.JSX.Element;
  i18n?: I18nOptions;
}

export const I18n: React.FC<I18nProps> = ({ children, i18n }) => {
  const value: I18nContextData = {
    i18n: {},
  };
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};
