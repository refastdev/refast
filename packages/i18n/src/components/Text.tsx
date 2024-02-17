import type React from 'react';

import { useText } from '../hooks';

interface TextProps {
  children?: string;
  className?: string;
  style?: React.CSSProperties;
  args?: any;
  customKey?: string;
}

export const Text: React.FC<TextProps> = ({ children, className, style, args, customKey }) => {
  const { i18n } = useText();
  return (
    <span style={style} className={className}>
      {i18n.t(children, args, customKey)}
    </span>
  );
};
