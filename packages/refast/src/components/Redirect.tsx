import { useEffect } from 'react'

import { useNavigate } from '../hooks'

interface RedirectProps {
  to: string
}

export function Redirect(props: RedirectProps) {
  const { to } = useNavigate()
  useEffect(() => to(props.to), [props.to])
  return undefined
}
