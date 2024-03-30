import { generatePreservedRoutes, generateRegularRoutes } from '@generouted/react-router/core';
import React from 'react';
import { Fragment, LazyExoticComponent, Suspense, lazy, memo, useEffect, useState } from 'react';
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
import AuthProvider from './provider/AuthProvider';

type Element = () => React.JSX.Element;

type Module = {
  default: Element;
  Loader?: LoaderFunction;
  Action?: ActionFunction;
  Catch?: Element;
  IsAuth?: (token: any) => boolean;
  errorElement?: React.ReactNode | null;
};

type ModuleRouter = () => Promise<Partial<Module>>;

export type PagePreservedModule = Module;
export type PageRoutesModule = Module;

export type DOMRouterOpts = Parameters<typeof createBrowserRouter>[1];

export interface AuthOption {
  getToken: () => any;
  setToken: (token: any) => void;
  notAuthPath: string;
}

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
  auth?: AuthOption;
}

export interface RoutesReturns {
  routes: RouteObject[];
  Routes: Element;
}

const getLoader = (module: ModuleRouter | undefined) => {
  return async (args: any) => {
    if (module) {
      const m = await module();
      if (m && m.Loader) {
        return defer({
          data: m.Loader(args),
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
    return () => {
      const ErrorBoundary = lazy(async () => ({
        default: (await module()).Catch || Fragment,
      }));
      return (
        <Suspense>
          <ErrorBoundary />
        </Suspense>
      );
    };
  }
};

const getComponent = (
  module: ModuleRouter | undefined,
  GlobalLoading: Element | undefined,
  auth?: AuthOption,
) => {
  const LazyComponent = (props: any) => {
    if (module) {
      const fallback = GlobalLoading ? <GlobalLoading /> : undefined;
      const ComponentContainer = lazy(async () => {
        const m = await module();
        let Component: React.ComponentType<any> | undefined = undefined;
        if (m && m.Loader) {
          Component = (props) => {
            const { data } = useLoaderData() as any;
            const Element = m.default || Fragment;
            return (
              <ProtectedRoute isAuth={m.IsAuth} notAuthPath={auth?.notAuthPath}>
                <Await resolve={data}>
                  <Element {...props} />
                </Await>
              </ProtectedRoute>
            );
          };
        } else {
          Component = (props) => {
            const Element = m.default || Fragment;
            return (
              <ProtectedRoute isAuth={m.IsAuth} notAuthPath={auth?.notAuthPath}>
                <Element {...props} />
              </ProtectedRoute>
            );
          };
        }
        return {
          default: Component || Fragment,
        };
      });
      return (
        <Suspense fallback={fallback}>
          {ComponentContainer && <ComponentContainer {...props} />}
        </Suspense>
      );
    }
    return undefined;
  };
  return LazyComponent;
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

  const Loading = _loading && (await _loading())?.default;
  const regularRoutes = generateRegularRoutes<RouteObject, ModuleRouter>(ROUTES, (module, key) => {
    const index =
      /index\.(jsx|tsx)$/.test(key) && !key.includes(`${pageRootPath}/index`) ? true : false;
    return {
      index,
      Component: getComponent(module, Loading, options.auth),
      ErrorBoundary: getErrorBoundary(module),
      loader: getLoader(module),
      action: getAction(module),
    };
  });

  let page404: Omit<PagePreservedModule, 'Action'> | undefined = undefined;
  if (_404) {
    page404 = await _404();
  }

  const App: RouteObject = {
    loader: getLoader(_app),
    Component: getComponent(_app, Loading, options.auth),
    ErrorBoundary: getErrorBoundary(_app),
    action: getAction(_app),
  };

  const fallback = { path: '*', Component: page404?.default || Fragment };

  const routes: RouteObject[] = [{ ...App, children: [...regularRoutes, fallback] }];
  const routerOpts: DOMRouterOpts = {
    ...pageOption.routerOpts,
  };
  const router =
    routerType === 'history'
      ? createBrowserRouter(routes, routerOpts)
      : createHashRouter(routes, routerOpts);

  const Routes = () => {
    return (
      <AuthProvider getToken={options.auth?.getToken} setToken={options.auth?.setToken}>
        <RouterProvider router={router} fallbackElement={Loading && <Loading />} />
      </AuthProvider>
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
