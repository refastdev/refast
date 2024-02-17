export interface I18nLocaleType {
  key: string;
  moduleKey: string;
  loadModule: () => Promise<any>;
}

export interface I18nOptions {
  locales: Array<I18nLocaleType>;
  defaultLocale: string;
  storage?: {
    type: undefined | 'localStorage' | 'custom';
    saveLocaleKey?: string;
    customSaveLoader?: {
      getData: (key: string) => string | undefined;
      setData: (key: string, value: string) => void;
      deleteData: (key: string) => void;
    };
  };
}

export const defaultOptions: I18nOptions = {
  locales: [],
  defaultLocale: 'en',
  storage: {
    type: 'localStorage',
  },
};
