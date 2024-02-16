import { createContext } from 'react';

import { I18nManager, i18n } from '.';

export interface I18nContextData {
  i18n: I18nManager;
  locale: string;
}

export const contextData: I18nContextData = {
  i18n,
  locale: '',
};

export const I18nContext = createContext<I18nContextData>(contextData);
