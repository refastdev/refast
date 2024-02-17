import { formatString, generateTextId } from '../utils';
import { codes } from './localeCodes';
import type { CodeType } from './localeCodes';
import { I18nLocaleType, I18nOptions, defaultOptions } from './options';
import { initStorage } from './storage';

interface I18nLocaleTypeLoaded extends I18nLocaleType {
  module: { [key: string]: string };
}

let localeList: Array<I18nLocaleType> = [];
let currentLocale: I18nLocaleTypeLoaded | undefined = undefined;
let defaultLocaleKey: string;
let changeEvents: Array<(locale: string) => void> = [];

export const localeEvent = {
  addChangeEvent: (event: (locale: string) => void) => {
    changeEvents.push(event);
  },
  removeChangeEvent: (event: (locale: string) => void) => {
    for (let i = changeEvents.length - 1; i >= 0; i--) {
      const e = changeEvents[i];
      if (e === event) {
        changeEvents.splice(i, 1);
      }
    }
  },
  clearChangeEvent: () => {
    changeEvents = [];
  },
  sendChangeEvent: (locale: string) => {
    if (changeEvents) {
      for (let i = 0; i < changeEvents.length; i++) {
        const e = changeEvents[i];
        if (e) {
          e(locale);
        }
      }
    }
  },
};

export const loadLocale = async (locale: string) => {
  if (locale !== defaultLocaleKey && !existsLocale(locale)) {
    console.warn(`notfound locale: ${locale}, use default locale: ${defaultLocaleKey}`);
    locale = defaultLocaleKey;
  }
  if (!currentLocale || currentLocale.key != locale) {
    const item = localeList.find((item) => item.key === locale);
    if (!item) {
      throw new Error(`notfound locale: ${locale}`);
    }
    const localeModule = await item.loadModule();
    if (localeModule === undefined || localeModule === null) {
      throw new Error(`notfound locale: ${locale}`);
    }
    currentLocale = {
      ...item,
      module: localeModule.default || localeModule,
    };
    localeEvent.sendChangeEvent(locale);
  }
};

export const getCurrentLocale = () => {
  return currentLocale?.key;
};

export const existsLocale = (locale: string) => {
  return localeList.findIndex((item) => item.key === locale) >= 0;
};

export const initLocale = async (options: I18nOptions) => {
  const mergeOptions = { ...defaultOptions, ...options };
  const { locales, defaultLocale, storage } = mergeOptions;
  const { saveLocale, onChangeLocale } = initStorage(storage);
  if (onChangeLocale) {
    localeEvent.addChangeEvent(onChangeLocale);
  }
  const initLocale = saveLocale || defaultLocale;
  localeList = locales;
  defaultLocaleKey = defaultLocale;
  await loadLocale(initLocale);
};

export const t = (defaultText?: string | undefined, args?: any, customKey?: string) => {
  const key: string | undefined = customKey
    ? customKey
    : defaultText
      ? generateTextId(defaultText)
      : undefined;
  if (key === undefined) return '';
  if (currentLocale === undefined) {
    return formatString(defaultText, args);
  }
  return formatString(currentLocale.module[key], args);
};

export const tk = (customKey: string, args?: any, defaultValue?: string) => {
  return t(defaultValue, args, customKey);
};

export { codes };

export const getLocaleCode = (locale: string) => {
  return codes[locale];
};

export type I18nLocaleCodeType = {
  key: string;
  code: CodeType;
};

export const getLocales = (): Array<I18nLocaleCodeType> => {
  return localeList.map((locale) => {
    let code: CodeType | undefined = getLocaleCode(locale.key);
    if (code == null) {
      console.error(`notfound locale: ${locale}`);
      code = {
        native: locale.key,
        english: locale.key,
      };
    }
    return {
      key: locale.key,
      code,
    };
  });
};
