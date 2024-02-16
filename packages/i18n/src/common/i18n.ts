import { createContext } from 'react';

import { generateShortHash } from '../common/utils';

const shortKeyLength = 6;

export interface I18nData {}

export interface I18nContextData {
  i18n: I18nData;
}

export const getKey = (str: string) => {
  return generateShortHash(str, shortKeyLength);
};

export const I18nContext = createContext<I18nContextData | undefined>(undefined);
