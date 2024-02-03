import { CSSProperties, ReactNode } from 'react'

import type { RouterParamsType, RouterPathType } from '../hooks'
import { useNavigate } from '../hooks'

interface LinkProps {
  children?: ReactNode
  style?: CSSProperties | undefined
  className?: string | undefined
  params?: RouterParamsType
  to: RouterPathType
}

export function Link(props: LinkProps) {
  const navigate = useNavigate()
  const onClick = () => {
    navigate.to(props.to, props.params)
  }
  return (
    <a style={props.style} className={props.className} onClick={onClick}>
      {props.children}
    </a>
  )
}
