import type {
  PageModalsModule,
  PagePreservedModule,
  PageRoutesModule,
  PagesOption
} from '@refastdev/refast'

export const customPagesOption: PagesOption = {
  pageRootPath: 'custom-path/src/pages',
  pagePreservedFiles: import.meta.glob<PagePreservedModule>(
    '/custom-path/src/pages/(_app|_404).{jsx,tsx}',
    {
      eager: true
    }
  ),
  pageModalsFiles: import.meta.glob<PageModalsModule>('/custom-path/src/pages/**/[+]*.{jsx,tsx}', {
    eager: true
  }),
  pageRoutesFiles: import.meta.glob<PageRoutesModule>([
    '/custom-path/src/pages/**/[\\w[-]*.{jsx,tsx}',
    '!**/(_app|_404).*'
  ])
}
