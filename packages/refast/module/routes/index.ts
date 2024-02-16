import type {
  PageModalsModule,
  PagePreservedModule,
  PageRoutesModule,
  RoutesOption,
} from '../../src/router';

export const routes: RoutesOption = {
  pageRootPath: 'src/pages',
  pagePreservedFiles: import.meta.glob<PagePreservedModule>('/src/pages/(_app|_404).{jsx,tsx}'),
  pageModalsFiles: import.meta.glob<PageModalsModule>('/src/pages/**/[+]*.{jsx,tsx}'),
  pageRoutesFiles: import.meta.glob<PageRoutesModule>([
    '/src/pages/**/[\\w[-]*.{jsx,tsx}',
    '!**/(_app|_404).*',
  ]),
};
