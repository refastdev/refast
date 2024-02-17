import type { I18nOptions } from '@refastdev/refast';

const locales = import.meta.glob<any>(['/custom-path/src/locales/langs/**/[\\w[-]*.{json,js}']);

const getFileName = (filePath: string) => {
  return filePath
    .split(/[\\/]/)
    .pop()!
    .replace(/\.[^.]+$/, '');
};

export const i18n: I18nOptions = {
  locales: Object.keys(locales)
    .filter((k) => locales[k] !== undefined)
    .map((k) => ({
      key: getFileName(k),
      moduleKey: k,
      loadModule: locales[k]!,
    })),
  defaultLocale: 'en-US',
};

