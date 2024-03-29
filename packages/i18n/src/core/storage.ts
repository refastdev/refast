import { defaultOptions } from './options';

type StorageOptionType = typeof defaultOptions.storage;

type InitStorageReturnType = {
  saveLocale: string | undefined;
  onChangeLocale: ((locale: string) => void) | undefined;
  deleteSaveLocale: (() => void) | undefined;
};

const getLocalStorageItem = (key: string) => {
  return window.localStorage.getItem(key);
};

const setLocalStorageItem = (key: string, value: string) => {
  return window.localStorage.setItem(key, value);
};

const removeLocalStorageItem = (key: string) => {
  return window.localStorage.removeItem(key);
};

export const initStorage = (storage: StorageOptionType): InitStorageReturnType => {
  storage = storage || defaultOptions.storage!;
  let saveLocale: string | undefined = undefined;
  let onChangeLocale: ((locale: string) => void) | undefined;
  let deleteSaveLocale: (() => void) | undefined;
  if (storage.type !== undefined) {
    const localeKey = storage.saveLocaleKey || '___save_locale';
    let getItem: (key: string) => string | undefined | null;
    let setItem: (key: string, value: string) => void;
    let removeItem: (key: string) => void;
    if (storage.type === 'localStorage') {
      getItem = getLocalStorageItem;
      setItem = setLocalStorageItem;
      removeItem = removeLocalStorageItem;
    } else if (storage.type === 'custom') {
      if (storage.customSaveLoader === undefined) {
        throw new Error('customSaveLoader is undefined');
      }
      getItem = storage.customSaveLoader.getData;
      setItem = storage.customSaveLoader.setData;
      removeItem = storage.customSaveLoader.deleteData;
    } else {
      throw new Error(`unknown storage type: ${storage.type}`);
    }
    const locale = getItem(localeKey);
    if (locale != null) {
      saveLocale = locale;
    }
    onChangeLocale = (locale: string) => {
      setItem(localeKey, locale);
    };
    deleteSaveLocale = () => {
      removeItem(localeKey);
    };
  }
  return {
    saveLocale,
    onChangeLocale,
    deleteSaveLocale,
  };
};
