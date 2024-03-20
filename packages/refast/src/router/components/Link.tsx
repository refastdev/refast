import { components } from '@generouted/react-router/client';
import { CSSProperties, ReactNode } from 'react';
import type { LinkProps as ReactLinkProps } from 'react-router-dom';

import type { RouterParamsType, RouterPathType } from '../hooks';

const comps = components<RouterPathType, RouterParamsType>();

interface LinkProps extends ReactLinkProps {
  children?: ReactNode;
  style?: CSSProperties | undefined;
  className?: string | undefined;
  params?: RouterParamsType;
  to: RouterPathType;
}
export function Link(props: LinkProps) {
  return (
    <comps.Link { ...props } style={props.style} className={props.className} params={props.params} to={props.to} >
      {props.children}
    </comps.Link>
  );
}
