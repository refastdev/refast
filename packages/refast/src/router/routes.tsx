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

export interface RoutesOption {
  pagePath?: string
  pageAppName?: string
  page404Name?: string
}

export const useRoutes = ({ pagePath, pageAppName, page404Name }: RoutesOption) => {
  pagePath = pagePath || 'src/pages'
  pageAppName = pageAppName || '_app'
  page404Name = page404Name || '_404'
  if (pagePath.startsWith('/')) {
    pagePath = pagePath.substring(1)
  }
  if (!pagePath.endsWith('/')) {
    pagePath = `${pagePath}/`
  }
  const PRESERVED = import.meta.glob<Module>(
    `/${pagePath}(${pageAppName}|${page404Name}).{jsx,tsx}`,
    {
      eager: true
    }
  )
  const MODALS = import.meta.glob<Pick<Module, 'default'>>(`${pagePath}**/[+]*.{jsx,tsx}`, {
    eager: true
  })
  const ROUTES = import.meta.glob<Module>([
    `/${pagePath}**/[\\w[-]*.{jsx,tsx}`,
    `!**/(${pageAppName}|${page404Name}).*`
  ])

  const preservedRoutes = generatePreservedRoutes<Omit<Module, 'Action'>>(PRESERVED)
  const modalRoutes = generateModalRoutes<Element>(MODALS)
  const _app: Omit<Module, 'Action'> | undefined = (preservedRoutes as any)?.[pageAppName]
  const _404: Omit<Module, 'Action'> | undefined = (preservedRoutes as any)?.[page404Name]

  const regularRoutes = generateRegularRoutes<RouteObject, ModuleRouter>(ROUTES, (module, key) => {
    const index =
      /index\.(jsx|tsx)$/.test(key) && !key.includes(`${pagePath}index`) ? { index: true } : {}
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
