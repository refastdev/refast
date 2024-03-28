import {
  generateModalRoutes,
  generatePreservedRoutes,
  generateRegularRoutes,
} from '@generouted/react-router/core';
import React, { useEffect, useState } from 'react';
import { Fragment, ReactNode, Suspense } from 'react';
import {
  Outlet,
  RouterProvider,
  createBrowserRouter,
  createHashRouter,
  useLocation,
} from 'react-router-dom';
import type { ActionFunction, LoaderFunction, RouteObject } from 'react-router-dom';

import { Redirect } from './components';

type Element = () => React.JSX.Element;
type ContainerElement = ({ children }: { children: ReactNode }) => React.JSX.Element;

type Module = {
  default: Element;
  Loader?: LoaderFunction;
  Action?: ActionFunction;
  Catch?: Element;
  Pending?: Element;
  Loading?: ContainerElement;
  IsRedirect?: () => string | undefined;
};

type ModuleRouter = () => Promise<Partial<Module>>;

export type PagePreservedModule = Module;
export type PageModalsModule = Pick<Module, 'default'>;
export type PageRoutesModule = Module;

export type DOMRouterOpts = Parameters<typeof createBrowserRouter>[1];

export interface RoutesOption {
  pagePreservedFiles: Record<string, any>;
  pageModalsFiles: Record<string, any>;
  pageRoutesFiles: Record<string, any>;
  pageRootPath: string;
  routerType?: 'hash' | 'history';
  routerOpts?: DOMRouterOpts;
}

export interface RoutesReturns {
  routes: RouteObject[];
  Routes: Element;
  Modals: Element;
}

const getRoutes = async (options: RoutesOption): Promise<RoutesReturns> => {
  const pageOption = options || {};

  let PRESERVED: Record<string, any>;
  let MODALS: Record<string, any>;
  let ROUTES: Record<string, any>;
  let pageRootPath: string;
  const pageAppName = '_app';
  const page404Name = '_404';
  let routerType = 'history';
  if (pageOption) {
    pageRootPath = pageOption.pageRootPath;
    PRESERVED = pageOption.pagePreservedFiles;
    MODALS = pageOption.pageModalsFiles;
    ROUTES = pageOption.pageRoutesFiles;
    if (pageOption.routerType) {
      routerType = pageOption.routerType;
    }
  } else {
    throw new Error('pages is undefined');
    // pageRootPath = 'src/pages';
    // PRESERVED = import.meta.glob<PagePreservedModule>('/src/pages/(_app|_404).{jsx,tsx}');
    // MODALS = import.meta.glob<PageModalsModule>('/src/pages/**/[+]*.{jsx,tsx}');
    // ROUTES = import.meta.glob<PageRoutesModule>([
    //   '/src/pages/**/[\\w[-]*.{jsx,tsx}',
    //   '!**/(_app|_404).*',
    // ]);
  }
  const preservedRoutes = generatePreservedRoutes<Omit<PagePreservedModule, 'Action'>>(PRESERVED);
  const modalRoutes = generateModalRoutes<Element>(MODALS);
  const _app: (() => Promise<Omit<PagePreservedModule, 'Action'>>) | undefined = (
    preservedRoutes as any
  )?.[pageAppName];
  const _404: (() => Promise<Omit<PagePreservedModule, 'Action'>>) | undefined = (
    preservedRoutes as any
  )?.[page404Name];

  const regularRoutes = generateRegularRoutes<RouteObject, ModuleRouter>(ROUTES, (module, key) => {
    const index =
      /index\.(jsx|tsx)$/.test(key) && !key.includes(`${pageRootPath}/index`)
        ? { index: true }
        : {};
    return {
      ...index,
      lazy: async () => {
        const Element = (await module())?.default || Fragment;
        const Pending = (await module())?.Pending;
        const Loading = (await module())?.Loading;
        const IsRedirect = (await module())?.IsRedirect;
        let redirect: string | undefined = undefined;
        if (IsRedirect) {
          redirect = IsRedirect();
        }
        const Page = () => {
          return redirect ? (
            <Redirect to={redirect} />
          ) : Loading ? (
            <Loading>
              {Pending ? <Suspense fallback={<Pending />} children={<Element />} /> : <Element />}
            </Loading>
          ) : Pending ? (
            <Suspense fallback={<Pending />} children={<Element />} />
          ) : (
            <Element />
          );
        };
        return {
          Component: Page,
          ErrorBoundary: (await module())?.Catch,
          loader: async (args) => {
            const Loader = (await module())?.Loader;
            if (Loader) {
              const result = await Loader(args);
              return result;
            }
            return null;
          },
          action: (await module())?.Action,
        };
      },
    };
  });

  let pageApp: Omit<PagePreservedModule, 'Action'> | undefined = undefined;
  let page404: Omit<PagePreservedModule, 'Action'> | undefined = undefined;
  if (_app) {
    pageApp = await _app();
  }
  if (_404) {
    page404 = await _404();
  }

  const AppElement = pageApp?.default || Fragment;
  const App = () =>
    pageApp?.Pending ? (
      <Suspense fallback={<pageApp.Pending />} children={<AppElement />} />
    ) : (
      <AppElement />
    );

  const app = {
    Component: pageApp?.default ? App : Outlet,
    ErrorBoundary: pageApp?.Catch,
    loader: pageApp?.Loader,
  };
  const fallback = { path: '*', Component: page404?.default || Fragment };

  const routes: RouteObject[] = [{ ...app, children: [...regularRoutes, fallback] }];
  const router =
    routerType === 'history'
      ? createBrowserRouter(routes, pageOption.routerOpts)
      : createHashRouter(routes, pageOption.routerOpts);
  const Routes = () => <RouterProvider router={router} />;

  const Modals = () => {
    const Modal = modalRoutes[useLocation().state?.modal] || Fragment;
    return <Modal />;
  };
  return {
    routes,
    Routes,
    Modals,
  };
};

export const useRoutes = (options: RoutesOption) => {
  const [data, setData] = useState<RoutesReturns>();
  useEffect(() => {
    (async () => {
      const routes = await getRoutes(options);
      setData(routes);
    })();
  }, []);
  return data;
};
