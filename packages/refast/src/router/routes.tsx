import { generatePreservedRoutes, generateRegularRoutes } from '@generouted/react-router/core';
import React, { Suspense } from 'react';
import { Fragment, useEffect, useState } from 'react';
import {
  Await,
  Outlet,
  RouterProvider,
  createBrowserRouter,
  createHashRouter,
  defer,
  useLoaderData,
} from 'react-router-dom';
import type { ActionFunction, LoaderFunction, RouteObject } from 'react-router-dom';

type Element = () => React.JSX.Element;

type Module = {
  default: Element;
  Loader?: LoaderFunction;
  Action?: ActionFunction;
  Loading?: Element;
  Catch?: Element;
  errorElement?: React.ReactNode | null;
};

type ModuleRouter = () => Promise<Partial<Module>>;

export type PagePreservedModule = Module;
export type PageRoutesModule = Module;

export type DOMRouterOpts = Parameters<typeof createBrowserRouter>[1];

export interface RoutesOption {
  page_AppName?: string;
  page_404Name?: string;
  page_LoadingName?: string;
  pagePreservedFiles: Record<string, any>;
  pageRoutesFiles: Record<string, any>;
  pageRootPath: string;
  routerType?: 'hash' | 'history';
  routerOpts?: DOMRouterOpts;
  keepCurrentPageLoading?: boolean;
}

export interface RoutesReturns {
  routes: RouteObject[];
  Routes: Element;
}

const getLoader = (m: Partial<Module> | undefined) => {
  return (args: any) => {
    if (m && m.Loader) {
      return defer({
        data: m.Loader(args),
      });
    }
    return null;
  };
};

const getComponent = (
  m: Partial<Module> | undefined,
  Element: Element | any,
  Loading: Element | undefined,
) => {
  return () => {
    const fallback = m?.Loading ? <m.Loading /> : Loading ? <Loading /> : undefined;
    if (m && m.Loader) {
      const { data } = useLoaderData() as any;
      return (
        <Suspense fallback={fallback}>
          <Await resolve={data}>
            <Element />
          </Await>
        </Suspense>
      );
    }
    return (
      <Suspense fallback={fallback}>
        <Element />
      </Suspense>
    );
  };
};

const getRoutes = async (options: RoutesOption): Promise<RoutesReturns> => {
  const pageOption = options || {};

  let PRESERVED: Record<string, any>;
  let ROUTES: Record<string, any>;
  let pageRootPath: string;
  const pageAppName = pageOption.page_AppName || '_app';
  const page404Name = pageOption.page_404Name || '_404';
  const pageLoadingName = pageOption.page_LoadingName || '_loading';
  let routerType = 'history';
  if (pageOption) {
    pageRootPath = pageOption.pageRootPath;
    PRESERVED = pageOption.pagePreservedFiles;
    ROUTES = pageOption.pageRoutesFiles;
    if (pageOption.routerType) {
      routerType = pageOption.routerType;
    }
  } else {
    throw new Error('pages is undefined');
  }
  const preservedRoutes = generatePreservedRoutes<Omit<PagePreservedModule, 'Action'>>(PRESERVED);
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
    const index: { index: boolean } =
      /index\.(jsx|tsx)$/.test(key) && !key.includes(`${pageRootPath}/index`)
        ? { index: true }
        : { index: false };
    return {
      ...index,
      lazy: async () => {
        const m = await module();
        const Element = m?.default || Fragment;
        return {
          Component: getComponent(m, Element, Loading),
          ErrorBoundary: m?.Catch,
          loader: getLoader(m),
          action: m?.Action,
        };
      },
    };
  });

  let pageApp: Omit<PagePreservedModule, 'Action'> | undefined = undefined;
  let page404: Omit<PagePreservedModule, 'Action'> | undefined = undefined;

  if (_404) {
    page404 = await _404();
  }

  const app = async () => {
    if (_app) {
      pageApp = await _app();
    }
    const AppElement = pageApp?.default || (Outlet as Element);
    const App = () => <AppElement />;
    return {
      Component: getComponent(pageApp, App, Loading),
      ErrorBoundary: pageApp?.Catch,
      loader: getLoader(pageApp),
    };
  };
  const fallback = { path: '*', Component: page404?.default || Fragment };

  const routes: RouteObject[] = [{ lazy: app, children: [...regularRoutes, fallback] }];
  const routerOpts: DOMRouterOpts = {
    ...pageOption.routerOpts,
  };
  const router =
    routerType === 'history'
      ? createBrowserRouter(routes, routerOpts)
      : createHashRouter(routes, routerOpts);
  const Routes = () => {
    return (
      <RouterProvider
        router={router}
        fallbackElement={Loading && <Loading />}
        future={{ v7_startTransition: true }}
      />
    );
  };
  return {
    routes,
    Routes,
  };
};

export const useRoutes = (options: RoutesOption) => {
  const [routes, setRoutes] = useState<RoutesReturns>();
  useEffect(() => {
    (async () => {
      const routes = await getRoutes(options);
      setRoutes(routes);
    })();
  }, []);
  return routes;
};
