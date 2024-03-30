import type { PagePreservedModule, PageRoutesModule, RoutesOption } from '../../src/router';

export const routes: RoutesOption = {
  pageRootPath: 'src/pages',
  pagePreservedFiles: import.meta.glob<PagePreservedModule>('/src/pages/(_app|_404).{jsx,tsx}'),
  pageRoutesFiles: import.meta.glob<PageRoutesModule>([
    '/src/pages/**/[\\w[-]*.{jsx,tsx}',
    '!**/(_app|_404).*',
  ]),
};
