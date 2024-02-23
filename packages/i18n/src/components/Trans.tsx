import type React from 'react';

import { useText } from '../hooks';

interface TextProps {
  text?: string;
  customKey?: string;
  args?: any;
  className?: string;
  style?: React.CSSProperties;
}

export const Trans: React.FC<TextProps> = ({ className, style, args, customKey, text }) => {
  const { i18n } = useText();
  return (
    <span style={style} className={className}>
      {i18n.t(text, args, customKey)}
    </span>
  );
};
