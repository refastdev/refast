import {
  generateModalRoutes,
  generatePreservedRoutes,
  generateRegularRoutes,
} from '@generouted/react-router/core';
import React, { ExoticComponent, LazyExoticComponent, useEffect, useState } from 'react';
import { Fragment, Suspense, lazy } from 'react';
import {
  Outlet,
  RouterProvider,
  createBrowserRouter,
  createHashRouter,
  useLocation,
} from 'react-router-dom';
import type { ActionFunction, LoaderFunction, RouteObject } from 'react-router-dom';

type Element = () => React.JSX.Element;
// type ContainerElement = ({ children }: { children: ReactNode }) => React.JSX.Element;

type Module = {
  default: Element;
  Loader?: LoaderFunction;
  Action?: ActionFunction;
  Catch?: Element;
};

type ModuleRouter = () => Promise<Partial<Module>>;

export type PagePreservedModule = Module;
export type PageModalsModule = Pick<Module, 'default'>;
export type PageRoutesModule = Module;

export type DOMRouterOpts = Parameters<typeof createBrowserRouter>[1];

export interface RoutesOption {
  page_AppName?: string;
  page_404Name?: string;
  page_LoadingName?: string;
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
  const pageAppName = pageOption.page_AppName || '_app';
  const page404Name = pageOption.page_404Name || '_404';
  const pageLoadingName = pageOption.page_LoadingName || '_loading';
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
  }
  const preservedRoutes = generatePreservedRoutes<Omit<PagePreservedModule, 'Action'>>(PRESERVED);
  const modalRoutes = generateModalRoutes<Element>(MODALS);
  const _app: (() => Promise<Omit<PagePreservedModule, 'Action'>>) | undefined = (
    preservedRoutes as any
  )?.[pageAppName];
  const _404: (() => Promise<Omit<PagePreservedModule, 'Action'>>) | undefined = (
    preservedRoutes as any
  )?.[page404Name];
  const _loading: (() => Promise<Omit<PagePreservedModule, 'Action'>>) | undefined = (
    preservedRoutes as any
  )?.[pageLoadingName];
  let pageLoading: Omit<PagePreservedModule, 'Action'> | undefined = undefined;
  if (_loading) {
    pageLoading = await _loading();
  }
  const Loading = pageLoading?.default;

  const regularRoutes = generateRegularRoutes<RouteObject, ModuleRouter>(ROUTES, (module, key) => {
    const index =
      /index\.(jsx|tsx)$/.test(key) && !key.includes(`${pageRootPath}/index`)
        ? { index: true }
        : {};
    return {
      ...index,
      lazy: async () => {
        let Element: Element | LazyExoticComponent<any> | ExoticComponent;
        if (Loading) {
          Element = lazy(module() as any);
        } else {
          Element = (await module())?.default || Fragment;
        }
        // const Element = (await module())?.default || Fragment;
        const Page = () => {
          return Loading ? <Suspense fallback={<Loading />} children={<Element />} /> : <Element />;
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
  const App = () => <AppElement />;

  const app = {
    Component: pageApp?.default ? App : (Outlet as Element),
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
