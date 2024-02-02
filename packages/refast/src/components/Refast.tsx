import React from 'React'

import { useRoutes } from '../router'
import type { RoutesOption } from '../router/'

export interface RefastProps {
  routerOption?: RoutesOption
}

export const Refast: React.FC<RefastProps> = ({ routerOption }) => {
  const { Routes } = useRoutes(routerOption || {})
  return <Routes />
}
