import type { I18nOptions } from '@refastdev/refast';

const localesPath = 'custom-path/src/locales/langs';
const locales = import.meta.glob<any>(['/custom-path/src/locales/langs/**/[\\w[-]*.{json,js}']);

const getFileName = (filePath: string) => {
  return filePath
    .split(/[\\/]/)
    .pop()!
    .replace(/\.[^.]+$/, '');
};

const i18n: I18nOptions = {
  locales: Object.keys(locales)
    .filter((k) => locales[k] !== undefined)
    .map((k) => ({
      key: getFileName(k),
      moduleKey: k,
      loadModule: locales[k]!,
    })),
  defaultLocale: 'en-US',
};

// If navigator.language exists, it is set to defaultLocale
const navigatorLanguage = navigator?.language;
if (i18n.locales.findIndex((locale) => locale.key === navigatorLanguage) >= 0) {
  i18n.defaultLocale = navigatorLanguage;
}

if (i18n.locales.length === 0) {
  console.warn(`notfound locale files: ${localesPath}`);
}

export { i18n };
