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
   * default: 'src/router/routes.ts'
   */
  generatePath: string;
}

const defaultOptions: GenerateRoutesOptions = {
  pageRoot: 'src/pages',
  generatePath: 'src/router/routes.ts',
};

const generate = (options: GenerateRoutesOptions) => {
  const lowPath = options.generatePath.trim().toLocaleLowerCase();
  if (lowPath.endsWith('.ts')) {
    const routesStr = `import type { PagePreservedModule, PageRoutesModule, RoutesOption } from '@refastdev/refast';

export const routes: RoutesOption = {
  pageRootPath: '${options.pageRoot}',
  pagePreservedFiles: import.meta.glob<PagePreservedModule>('/${options.pageRoot}/(_app|_404).{jsx,tsx}'),
  pageRoutesFiles: import.meta.glob<PageRoutesModule>([
    '/${options.pageRoot}/**/[\\\\w[-]*.{jsx,tsx}',
    '!**/(_app|_404).*',
  ]),
};
`;
    const routesTsPath = path.resolve(process.cwd(), options.generatePath);
    const dirname = path.dirname(routesTsPath);
    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
    }
    fs.writeFileSync(routesTsPath, routesStr, { encoding: 'utf8' });
  } else if (lowPath.endsWith('.js')) {
    const routesStr = `export const pages = {
  pageRootPath: '${options.pageRoot}',
  pagePreservedFiles: import.meta.glob('/${options.pageRoot}/(_app|_404).{jsx,tsx}'),
  pageRoutesFiles: import.meta.glob([
    '/${options.pageRoot}/**/[\\\\w[-]*.{jsx,tsx}',
    '!**/(_app|_404).*',
  ]),
};
`;
    const routesTypeStr = `declare const routes: {
    pageRootPath: string;
    pagePreservedFiles: Record<string, any>;
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
  } else {
    throw new Error(`generatePath parse error: ${options.generatePath}`);
  }
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
