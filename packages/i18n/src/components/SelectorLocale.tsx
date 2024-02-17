import type React from 'react';
import { useState } from 'react';

import { useText } from '../hooks/';

export type SelectorLocaleProps = {
  className?: string;
  style?: React.CSSProperties;
  optionStyle?: React.CSSProperties;
  optionClassName?: string;
  onLocaleChange?: (e: string | undefined) => void;
};
export const SelectorLocale: React.FC<SelectorLocaleProps> = ({
  className,
  style,
  optionClassName,
  optionStyle,
  onLocaleChange,
}) => {
  const { i18n } = useText();
  const locale = i18n.getCurrentLocale();
  const items = i18n.getLocales();
  const [value, setValue] = useState(locale);
  return (
    <select
      style={style}
      className={className}
      value={value}
      onChange={(e) => {
        (async () => {
          const v = e.target.value;
          await i18n.loadLocale(v);
          const locale = i18n.getCurrentLocale();
          setValue(locale);
          if (onLocaleChange) onLocaleChange(locale);
        })();
      }}
    >
      {items.map((v) => {
        return (
          <option key={v.key} value={v.key} className={optionClassName} style={optionStyle}>
            {v.code.native}
          </option>
        );
      })}
    </select>
  );
};
