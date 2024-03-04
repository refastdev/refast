import type React from 'react';
import { useState } from 'react';

import type { I18nLocaleCodeType } from '../core/i18n';
import type { CodeType } from '../core/localeCodes';
import { useText } from '../hooks/';

export type SelectorLocaleProps = {
  className?: string;
  style?: React.CSSProperties;
  optionStyle?: React.CSSProperties;
  optionClassName?: string;
  onLocaleChange?: (e: string | undefined) => void;
  render?: (
    items: Array<I18nLocaleCodeType>,
    locale: string | undefined,
    setLocale: (locale: string | undefined) => void,
  ) => React.ReactNode;
  itemRender?: (locale: string, code: CodeType) => React.ReactNode;
};
export const SelectorLocale: React.FC<SelectorLocaleProps> = ({
  className,
  style,
  optionClassName,
  optionStyle,
  onLocaleChange,
  render,
  itemRender,
}) => {
  const { i18n } = useText();
  const locale = i18n.getCurrentLocale();
  const items = i18n.getLocales();
  const [value, setValue] = useState(locale);
  const setLocale = (v: string | undefined) => {
    if (v === undefined) return;
    (async () => {
      await i18n.loadLocale(v);
      const locale = i18n.getCurrentLocale();
      setValue(locale);
      if (onLocaleChange) onLocaleChange(locale);
    })();
  };
  return render ? (
    render(items, value, setLocale)
  ) : (
    <select
      style={style}
      className={className}
      value={value}
      onChange={(e) => setLocale(e.target.value)}
    >
      {items.map((v) => {
        return itemRender ? (
          itemRender(v.key, v.code)
        ) : (
          <option key={v.key} value={v.key} className={optionClassName} style={optionStyle}>
            {v.code.native}
          </option>
        );
      })}
    </select>
  );
};
