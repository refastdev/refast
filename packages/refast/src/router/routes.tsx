import {
  generateModalRoutes,
  generatePreservedRoutes,
  generateRegularRoutes
} from '@generouted/react-router/core'
import React from 'react'
import { Fragment, ReactNode, Suspense } from 'react'
import { Outlet, RouterProvider, createBrowserRouter, useLocation } from 'react-router-dom'
import type { ActionFunction, LoaderFunction, RouteObject } from 'react-router-dom'

import { Redirect } from '../components'

type Element = () => React.JSX.Element
type ContainerElement = ({ children }: { children: ReactNode }) => React.JSX.Element

type Module = {
  default: Element
  Loader?: LoaderFunction
  Action?: ActionFunction
  Catch?: Element
  Pending?: Element
  Loading?: ContainerElement
  IsRedirect?: () => string | undefined
}

type ModuleRouter = () => Promise<Partial<Module>>

export type PagePreservedModule = Module
export type PageModalsModule = Pick<Module, 'default'>
export type PageRoutesModule = Module

export interface PagesOption {
  pagePreservedFiles: Record<string, any>
  pageModalsFiles: Record<string, any>
  pageRoutesFiles: Record<string, any>
  pageRootPath: string
}

export interface RoutesOption {
  customPagesOption?: PagesOption
}

export const useRoutes = (options?: RoutesOption) => {
  options = options || {}
  const pageOption = options.customPagesOption

  let PRESERVED: Record<string, any>
  let MODALS: Record<string, any>
  let ROUTES: Record<string, any>
  let pageRootPath: string
  const pageAppName = '_app'
  const page404Name = '_404'

  if (pageOption) {
    pageRootPath = pageOption.pageRootPath
    PRESERVED = pageOption.pagePreservedFiles
    MODALS = pageOption.pageModalsFiles
    ROUTES = pageOption.pageRoutesFiles
  } else {
    pageRootPath = 'src/pages'

    PRESERVED = import.meta.glob<PagePreservedModule>('/src/pages/(_app|_404).{jsx,tsx}', {
      eager: true
    })
    MODALS = import.meta.glob<PageModalsModule>('/src/pages/**/[+]*.{jsx,tsx}', {
      eager: true
    })
    ROUTES = import.meta.glob<PageRoutesModule>([
      '/src/pages/**/[\\w[-]*.{jsx,tsx}',
      '!**/(_app|_404).*'
    ])
  }
  const preservedRoutes = generatePreservedRoutes<Omit<PagePreservedModule, 'Action'>>(PRESERVED)
  const modalRoutes = generateModalRoutes<Element>(MODALS)
  const _app: Omit<PagePreservedModule, 'Action'> | undefined = (preservedRoutes as any)?.[
    pageAppName
  ]
  const _404: Omit<PagePreservedModule, 'Action'> | undefined = (preservedRoutes as any)?.[
    page404Name
  ]

  const regularRoutes = generateRegularRoutes<RouteObject, ModuleRouter>(ROUTES, (module, key) => {
    const index =
      /index\.(jsx|tsx)$/.test(key) && !key.includes(`${pageRootPath}/index`) ? { index: true } : {}
    return {
      ...index,
      lazy: async () => {
        const Element = (await module())?.default || Fragment
        const Pending = (await module())?.Pending
        const Loading = (await module())?.Loading
        const IsRedirect = (await module())?.IsRedirect
        let redirect: string | undefined = undefined
        if (IsRedirect) {
          redirect = IsRedirect()
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
          )
        }
        return {
          Component: Page,
          ErrorBoundary: (await module())?.Catch,
          loader: async args => {
            const Loader = (await module())?.Loader
            if (Loader) {
              const result = await Loader(args)
              return result
            }
            return undefined
          },
          action: (await module())?.Action
        }
      }
    }
  })

  const AppElement = _app?.default || Fragment
  const App = () =>
    _app?.Pending ? (
      <Suspense fallback={<_app.Pending />} children={<AppElement />} />
    ) : (
      <AppElement />
    )

  const app = {
    Component: _app?.default ? App : Outlet,
    ErrorBoundary: _app?.Catch,
    loader: _app?.Loader
  }
  const fallback = { path: '*', Component: _404?.default || Fragment }

  const routes: RouteObject[] = [{ ...app, children: [...regularRoutes, fallback] }]
  const Routes = () => <RouterProvider router={createBrowserRouter(routes)} />

  const Modals = () => {
    const Modal = modalRoutes[useLocation().state?.modal] || Fragment
    return <Modal />
  }
  return {
    routes,
    Routes,
    Modals
  }
}
