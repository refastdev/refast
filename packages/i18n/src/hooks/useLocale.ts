import { useContext } from 'react';

import { I18nContext } from '../common/i18n';
import type { I18nContextData } from '../common/i18n';

export function useText(): I18nContextData {
  return useContext(I18nContext)!;
}
