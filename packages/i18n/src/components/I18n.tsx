import React from 'React';
import { createContext, useState } from 'react';

import { I18nOptions } from '../options';

interface I18nData {
  data: string;
  setData: React.Dispatch<React.SetStateAction<string>>;
}
const I18nContext = createContext<I18nData | undefined>(undefined);

interface I18nProps {
  children?: React.JSX.Element;
  i18n?: I18nOptions;
}

export const I18n: React.FC<I18nProps> = ({ children, i18n }) => {
  const [data, setData] = useState('some data');
  return <I18nContext.Provider value={undefined}>{children}</I18nContext.Provider>;
};
