import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import React from 'React';

import { I18nOptions } from '../options';

interface I18nProps {
  children?: React.JSX.Element;
  options?: I18nOptions;
}

export const I18n: React.FC<I18nProps> = ({ children, options }) => {
  return <I18nProvider i18n={i18n}>{children}</I18nProvider>;
};
