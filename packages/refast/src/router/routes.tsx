import { generatePreservedRoutes, generateRegularRoutes } from '@generouted/react-router/core';
//@ts-ignore
import loadable from '@loadable/component';
import React from 'react';
import { Fragment, useEffect, useMemo } from 'react';
import {
  Await,
  RouterProvider,
  createBrowserRouter,
  createHashRouter,
  defer,
  useLoaderData,
} from 'react-router-dom';
import type { ActionFunction, LoaderFunction, RouteObject } from 'react-router-dom';

import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './provider';
import { TricklingInstance, TricklingOptions, createLoading } from './utils/loading';

type Element = () => React.JSX.Element;

type Module = {
  default: Element;
  Loader?: LoaderFunction;
  Action?: ActionFunction;
  Catch?: Element;
  IsAuth?: (token: any) => boolean;
};

type ModuleRouter = () => Promise<Partial<Module>>;

export type PagePreservedModule = Module;
export type PageRoutesModule = Module;

export type DOMRouterOpts = Parameters<typeof createBrowserRouter>[1];

export interface RoutesAuthOption {
  getToken: () => any;
  setToken: (token: any) => void;
  notAuthPath: string;
}

export interface RoutesLoadingOption {
  notKeepCurrentPage?: boolean;
  Loading?: Element;
  onStart?: () => void;
  onStop?: () => void;
  defaultLoadingDisable?: boolean;
  defaultLoadingOptions?: TricklingOptions;
}

export interface RoutesOption {
  pageName_App?: string;
  pageName_404?: string;

  pagePreservedFiles: Record<string, any>;
  pageRoutesFiles: Record<string, any>;
  pageRootPath: string;

  routerType?: 'hash' | 'history';
  routerOpts?: DOMRouterOpts;

  auth?: RoutesAuthOption;
  loading?: RoutesLoadingOption;
}

export interface RoutesReturns {
  routes: RouteObject[];
  Routes: Element;
}

const getLoader = (
  module: ModuleRouter | undefined,
  loadingOpt?: RoutesLoadingOption,
  defaultLoading?: TricklingInstance,
) => {
  return async (args: any) => {
    if (module) {
      if (defaultLoading) {
        defaultLoading.start();
        defaultLoading.set(0);
      }
      if (loadingOpt && loadingOpt.onStart) {
        loadingOpt.onStart();
      }
      const m = await module();
      if (m && m.Loader) {
        if (!loadingOpt?.notKeepCurrentPage) {
          return await m.Loader(args);
        }
        return defer({
          data: m.Loader(args),
          __deferDataFlag: true,
        });
      }
    }
    return null;
  };
};

const getAction = (module: ModuleRouter | undefined) => {
  return async (args: any) => {
    if (module) {
      const m = await module();
      if (m && m.Action) {
        return await m.Action(args);
      }
    }
    return null;
  };
};

const getErrorBoundary = (module: ModuleRouter | undefined) => {
  if (module) {
    const ErrorBoundary = loadable(async () => ({ default: (await module()).Catch || Fragment }));
    return () => {
      return <ErrorBoundary />;
    };
  }
};

const getComponent = (
  module: ModuleRouter | undefined,
  loadingOpt?: RoutesLoadingOption,
  defaultLoading?: TricklingInstance,
) => {
  const keepCurrentPage = !loadingOpt?.notKeepCurrentPage;
  const fallback = !keepCurrentPage && loadingOpt?.Loading ? <loadingOpt.Loading /> : undefined;
  if (module) {
    let m: Partial<Module> | undefined = undefined;
    const Component = {
      default: (props: any) => {
        const Element = m?.default || Fragment;
        useEffect(() => {
          defaultLoading?.done();
          if (loadingOpt?.onStop) {
            loadingOpt.onStop();
          }
        }, []);
        if (m?.Loader && !keepCurrentPage) {
          const data = useLoaderData() as any;
          return (
            <ProtectedRoute isAuth={m?.IsAuth}>
              <Await resolve={data.data}>
                <Element {...props} />
              </Await>
            </ProtectedRoute>
          );
        }
        return (
          <ProtectedRoute isAuth={m?.IsAuth}>
            <Element {...props} />
          </ProtectedRoute>
        );
      },
    };
    const LazyComponent = loadable(
      async () => {
        m = await module();
        return Component;
      },
      {
        fallback,
      },
    );
    return (props: any) => {
      return <LazyComponent {...props} />;
    };
  }
  return undefined;
};

export const useRoutes = (options: RoutesOption) => {
  options = options || {};

  const loading: TricklingInstance | undefined =
    options.loading === undefined || !options.loading.defaultLoadingDisable
      ? createLoading(options.loading?.defaultLoadingOptions)
      : undefined;

  let PRESERVED: Record<string, any>;
  let ROUTES: Record<string, any>;
  let pageRootPath: string;
  const pageAppName = options.pageName_App || '_app';
  const page404Name = options.pageName_404 || '_404';
  let routerType = 'history';
  if (options) {
    pageRootPath = options.pageRootPath;
    PRESERVED = options.pagePreservedFiles;
    ROUTES = options.pageRoutesFiles;
    if (options.routerType) {
      routerType = options.routerType;
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

  const regularRoutes = generateRegularRoutes<RouteObject, ModuleRouter>(ROUTES, (module, key) => {
    const index =
      /index\.(jsx|tsx)$/.test(key) && !key.includes(`${pageRootPath}/index`) ? true : false;

    return {
      index,
      Component: getComponent(module, options.loading, loading),
      ErrorBoundary: getErrorBoundary(module),
      loader: getLoader(module, options.loading, loading),
      action: getAction(module),
    };
  });

  const App: RouteObject = {
    loader: getLoader(_app, options.loading, loading),
    Component: getComponent(_app, options.loading, loading),
    ErrorBoundary: getErrorBoundary(_app),
    action: getAction(_app),
  };

  const fallback: RouteObject = {
    path: '*',
    Component: getComponent(_404, options.loading, loading),
  };

  const routes: RouteObject[] = [{ ...App, children: [...regularRoutes, fallback] }];
  const routerOpts: DOMRouterOpts = {
    ...options.routerOpts,
  };
  const router =
    routerType === 'history'
      ? createBrowserRouter(routes, routerOpts)
      : createHashRouter(routes, routerOpts);

  const keepCurrentPage = !options.loading?.notKeepCurrentPage;
  const loadingFallback = options.loading?.Loading ? <options.loading.Loading /> : undefined;

  const Routes = useMemo(() => {
    return (
      <>
        <AuthProvider auth={options.auth}>
          <RouterProvider
            fallbackElement={!keepCurrentPage ? loadingFallback : undefined}
            router={router}
          />
        </AuthProvider>
        {keepCurrentPage ? loadingFallback : undefined}
      </>
    );
  }, []);
  return Routes;
};
