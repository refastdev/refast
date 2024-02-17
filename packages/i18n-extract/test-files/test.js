import { Outlet, SelectorLocale, useText } from '@refastdev/refast';

export default function App() {
  const { i18n } = useText();

  const name1 = 'Tony';
  const name2 = 'Tony';
  const name = 'Tony';
  const where = 'Alibaba';

  console.log(i18n.tk('custom-key', undefined, 'custom-key-value'));

  console.log(
    i18n.tk(
      'custom-key2',
      { name: name1, where, name2, name1, test: 'test' },
      'custom-key-value: {name}, {where}',
    ),
  );
  return (
    <div>
      {/*  Basic */}
      <div>{i18n.t('default message')}</div>
      <div>{i18n.t('Default message for basic[2]')}</div>
      <div>{i18n.t('Default message for basic(3)')}</div>
      <div>
        {i18n.t(
          'Default message for basic(4) with 中文 {name}, {where}}',
          { name, where },
          'custom-key3',
        )}
      </div>
      <div>{i18n.t('Default message for basic5 with 中文(5)', undefined, 'custom-key4')}</div>
      <div>{i18n.t('Default message for basic6 with "123(中文)"')}</div>

      {/* New line */}
      {i18n.t('Default message for newline1')}
      {i18n.t('Default message for newline2')}
      {i18n.t('Default message for newline1')}
      {i18n.t('Default message for newline2')}

      {/* Variable */}
      {i18n.t('Hello1, {name}. Welcome to {where}!', { name, where, test: 'test' })}
      {i18n.t('你好2, {name}. 欢迎来到 {where}！', { name, where })}
      {i18n.t('Hello3, {name}. Welcome to {where}!', { name, where })}
      {i18n.t('你好4, {name}. 欢迎来到 {where}！', { name, where })}
      {i18n
        .t(
          'Hello5, {name}. Welcome to {where}!test long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long',
          {
            name,
            where,
          },
        )
        .t()}

      {/* more character */}
      {i18n.t('Expression support: ==,!=,>=,>,<=,<,&&,!,(),+,-,*,/,%')}

      {/* multiple i18in text in a line */}
      {name === 'Tony'
        ? i18n.t('Default message for same_line1')
        : i18n.t('Default message for same_line2')}
    </div>
  );
}
