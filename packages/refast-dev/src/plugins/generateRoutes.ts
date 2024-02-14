import fs from 'fs';
import path from 'path';
import { merge } from 'ts-deepmerge';
import { Plugin } from 'vite';

export interface GenerateRoutesOptions {
  /**
   * default: 'src/pages', must end in 'src/pages'
   */
  pageRoot: string;
  /**
   * default: 'node_modules/.refast/routes.js'
   */
  generatePath: string;
}

const defaultOptions: GenerateRoutesOptions = {
  pageRoot: 'src/pages',
  generatePath: 'node_modules/.refast/routes.js',
};

const generate = (options: GenerateRoutesOptions) => {
  const routesStr = `export const pages = {
  pageRootPath: '${options.pageRoot}',
  pagePreservedFiles: import.meta.glob('/${options.pageRoot}/(_app|_404).{jsx,tsx}'),
  pageModalsFiles: import.meta.glob('/${options.pageRoot}/**/[+]*.{jsx,tsx}'),
  pageRoutesFiles: import.meta.glob([
    '/${options.pageRoot}/**/[\\w[-]*.{jsx,tsx}',
    '!**/(_app|_404).*',
  ]),
};
`;
  const routesTypeStr = `declare const pages: {
    pageRootPath: string;
    pagePreservedFiles: Record<string, any>;
    pageModalsFiles: Record<string, any>;
    pageRoutesFiles: Record<string, any>;
};

export { pages };
`;
  const routesJsPath = path.resolve(process.cwd(), options.generatePath);
  const name = path.basename(options.generatePath, '.js');
  const dirname = path.dirname(routesJsPath);
  const routesTypePath = path.resolve(dirname, `${name}.d.ts`);

  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
  fs.writeFileSync(routesJsPath, routesStr, { encoding: 'utf8' });
  fs.writeFileSync(routesTypePath, routesTypeStr, { encoding: 'utf8' });
};

export function GenerateRoutes(options?: Partial<GenerateRoutesOptions>): Plugin {
  const resolvedOptions = merge(defaultOptions, options || {}) as GenerateRoutesOptions;
  return {
    name: '@refastdev/refast-generate-routes',
    enforce: 'pre',
    configureServer(server) {
      const listener = (file = '') =>
        file.includes(path.normalize('/src/pages/')) ? generate(resolvedOptions) : null;
      server.watcher.on('add', listener);
      server.watcher.on('change', listener);
      server.watcher.on('unlink', listener);
    },
    buildStart() {
      generate(resolvedOptions);
    },
  };
}
