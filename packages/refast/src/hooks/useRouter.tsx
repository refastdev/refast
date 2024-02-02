import { components, hooks, utils } from '@generouted/react-router/client'
import { useLocation } from 'react-router-dom'

type PathType = string
type ModalPathType = string
type ParamsType = any

export const { Link, Navigate } = components<PathType, ParamsType>()
const h = hooks<PathType, ParamsType, ModalPathType>()
const u = utils<PathType, ParamsType>()

const useParams = h.useParams
const useModals = h.useModals
const redirect = u.redirect

export function useNavigate() {
  const navigate = h.useNavigate()
  const to = (path?: PathType, options?: ParamsType) => {
    path = path || '/'
    navigate(path, options)
  }
  return {
    to,
    home: () => to()
  }
}

export { useParams, useModals, useLocation }
export { redirect }
