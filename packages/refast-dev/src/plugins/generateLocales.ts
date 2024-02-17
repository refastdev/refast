import fs from 'fs';
import path from 'path';
import { merge } from 'ts-deepmerge';
import { Plugin } from 'vite';

export interface GenerateLocalesOptions {
  /**
   * default: 'src/locales/langs'
   */
  localesPath: string;
  /**
   * default: 'src/locales/index.ts'
   */
  generatePath: string;
}

const defaultOptions: GenerateLocalesOptions = {
  localesPath: 'src/locales/langs',
  generatePath: 'src/locales/index.ts',
};

const generate = (options: GenerateLocalesOptions) => {
  const lowPath = options.generatePath.trim().toLocaleLowerCase();
  if (lowPath.endsWith('.ts')) {
    const localesStr = `import type { I18nOptions } from '@refastdev/refast';

const localesPath = '${options.localesPath}';
const locales = import.meta.glob<any>(['/${options.localesPath}/**/[\\\\w[-]*.{json,js}']);

const getFileName = (filePath: string) => {
  return filePath
    .split(/[\\\\/]/)
    .pop()!
    .replace(/\\.[^.]+$/, '');
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
  console.warn(\`notfound locale files: \${localesPath}\`);
}

export { i18n };
`;
    const tsPath = path.resolve(process.cwd(), options.generatePath);
    const dirname = path.dirname(tsPath);
    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
    }
    fs.writeFileSync(tsPath, localesStr, { encoding: 'utf8' });
  } else if (lowPath.endsWith('.js')) {
    const localesStr = `var localesPath = "${options.localesPath}";
var locales = import.meta.glob(["/${options.localesPath}/**/[\\\\w[-]*.{json,js}"]);
var getFileName = (filePath) => {
  return filePath.split(/[\\\\/]/).pop().replace(/\\.[^.]+$/, "");
};
var i18n = {
  locales: Object.keys(locales).filter((k) => locales[k] !== void 0).map((k) => ({
    key: getFileName(k),
    moduleKey: k,
    loadModule: locales[k]
  })),
  defaultLocale: "en-US"
};
var navigatorLanguage = navigator?.language;
if (i18n.locales.findIndex((locale) => locale.key === navigatorLanguage) >= 0) {
  i18n.defaultLocale = navigatorLanguage;
}
if (i18n.locales.length === 0) {
  console.warn(\`notfound locale files: \${localesPath}\`);
}
export {
  i18n
};
`;
    const localesTypeStr = `import { I18nOptions } from '@refastdev/refast';

declare const i18n: I18nOptions;
export { i18n };
`;
    const jsPath = path.resolve(process.cwd(), options.generatePath);
    const name = path.basename(options.generatePath, '.js');
    const dirname = path.dirname(jsPath);
    const localesTypePath = path.resolve(dirname, `${name}.d.ts`);
    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
    }
    fs.writeFileSync(jsPath, localesStr, { encoding: 'utf8' });
    fs.writeFileSync(localesTypePath, localesTypeStr, { encoding: 'utf8' });
  } else {
    throw new Error(`generatePath parse error: ${options.generatePath}`);
  }
};

export function GenerateLocales(options?: Partial<GenerateLocalesOptions>): Plugin {
  const resolvedOptions = merge(defaultOptions, options || {}) as GenerateLocalesOptions;
  return {
    name: '@refastdev/refast-generate-locales',
    enforce: 'pre',
    configureServer(server) {},
    buildStart() {
      generate(resolvedOptions);
    },
  };
}
