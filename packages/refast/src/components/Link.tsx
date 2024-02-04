import { components } from '@generouted/react-router/client'
import { CSSProperties, ReactNode } from 'react'

import type { RouterParamsType, RouterPathType } from '../hooks'

const comps = components<RouterPathType, RouterParamsType>()

interface LinkProps {
  children?: ReactNode
  style?: CSSProperties | undefined
  className?: string | undefined
  params?: RouterParamsType
  to: RouterPathType
}

export function Link(props: LinkProps) {
  return (
    <comps.Link style={props.style} className={props.className} to={props.to} params={props.params}>
      {props.children}
    </comps.Link>
  )
}
