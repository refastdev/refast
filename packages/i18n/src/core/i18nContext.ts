import { createContext } from 'react';

import { I18nManager, i18n } from '.';

export interface I18nContextData {
  i18n: I18nManager;
}

export const contextData: I18nContextData = {
  i18n,
};

export const I18nContext = createContext<I18nContextData>(contextData);
