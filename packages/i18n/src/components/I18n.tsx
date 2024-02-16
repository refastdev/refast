import type React from 'react';
import { useEffect, useReducer, useState } from 'react';

import { I18nOptions } from '../core';
import { I18nContext, contextData } from '../core/i18nContext';

interface I18nProps {
  children?: React.JSX.Element;
  i18n: I18nOptions;
}

export const I18n: React.FC<I18nProps> = ({ children, i18n }) => {
  const [key, setKey] = useState('');
  const [initialize, setInitialize] = useState(false);
  useEffect(() => {
    const handleChangeLocale = (newLocale: string) => {
      console.log(`change language: ${newLocale}`);
      setKey(newLocale);
    };
    contextData.i18n.localeEvent.addChangeEvent(handleChangeLocale);

    console.log('effect');

    if (!initialize) {
      (async () => {
        await contextData.i18n.initLocale(i18n);
        setInitialize(true);
      })();
    }

    return () => {
      console.log('remove effect');
      contextData.i18n.localeEvent.removeChangeEvent(handleChangeLocale);
    };
  }, [initialize]);

  return (
    <I18nContext.Provider key={key} value={contextData}>
      {children}
    </I18nContext.Provider>
  );
};
