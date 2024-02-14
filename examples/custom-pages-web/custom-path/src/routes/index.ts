import type {
  PageModalsModule,
  PagePreservedModule,
  PageRoutesModule,
  PagesOption,
} from '@refastdev/refast';

export const pages: PagesOption = {
  pageRootPath: 'custom-path/src/pages',
  pagePreservedFiles: import.meta.glob<PagePreservedModule>(
    '/custom-path/src/pages/(_app|_404).{jsx,tsx}',
  ),
  pageModalsFiles: import.meta.glob<PageModalsModule>('/custom-path/src/pages/**/[+]*.{jsx,tsx}'),
  pageRoutesFiles: import.meta.glob<PageRoutesModule>([
    '/custom-path/src/pages/**/[\\w[-]*.{jsx,tsx}',
    '!**/(_app|_404).*',
  ]),
};
