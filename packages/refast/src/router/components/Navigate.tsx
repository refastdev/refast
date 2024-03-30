import { components } from '@generouted/react-router/client';
import { CSSProperties, ReactNode } from 'react';
import type { NavigateProps as NavigatePropsProps } from 'react-router-dom';

import type { RouterParamsType, RouterPathType } from '../hooks';

const { Navigate: _Navigate } = components<RouterPathType, RouterParamsType>();

interface NavigateProps extends NavigatePropsProps {
  children?: ReactNode;
  style?: CSSProperties | undefined;
  className?: string | undefined;
  params?: RouterParamsType;
  to: RouterPathType;
}
export function Navigate(props: NavigateProps) {
  return (
    <_Navigate
      {...props}
      style={props.style}
      className={props.className}
      params={props.params}
      to={props.to}
    >
      {props.children}
    </_Navigate>
  );
}
