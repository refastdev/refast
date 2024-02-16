import { useContext } from 'react';

import { I18nContext, I18nContextData } from '../core/i18nContext';

export function useText(): I18nContextData {
  return useContext(I18nContext)!;
}
