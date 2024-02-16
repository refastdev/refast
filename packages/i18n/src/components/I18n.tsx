import type React from 'react';
import { useEffect, useState } from 'react';

import { I18nOptions } from '../core';
import { I18nContext, contextData } from '../core/i18nContext';

interface I18nProps {
  children?: React.JSX.Element;
  i18n: I18nOptions;
}

export const I18n: React.FC<I18nProps> = ({ children, i18n }) => {
  const [locale, setLocale] = useState(i18n.defaultLocale);
  contextData.locale = locale;
  contextData.i18n.localeEvent.addChangeEvent((locale) => {
    contextData.locale = locale;
    setLocale(locale);
  });
  useEffect(() => {
    contextData.i18n.initLocale(i18n);
  }, []);
  return <I18nContext.Provider value={contextData}>{children}</I18nContext.Provider>;
};
