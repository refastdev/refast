import type React from 'react';

import { useText } from '../hooks';

interface TextProps {
  children?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function Text({ children, className, style }: TextProps) {
  const { i18n } = useText();
  return (
    <span style={style} className={className}>
      {i18n.t(children)}
    </span>
  );
}
