import { Outlet, SelectorLocale, useText } from '@refastdev/refast';
import { create } from '@refastdev/refast/state';

interface StoreType {
  text: string;
  setText: (text: string) => void;
}

const { useStore } = create<StoreType>((set, setState) => ({
  text: 'test',
  setText: (text: string) => {
    set((state) => {
      state.text = text;
    });
  },
}));

export default function App() {
  const { i18n } = useText();
  const state = useStore((state) => state);

  console.log(i18n.tk('custom-key', undefined, 'custom-value-en-US'));
  return (
    <div>
      App
      <div>
        <input type="text" value={state.text} onChange={(e) => state.setText(e.target.value)} />
      </div>
      <div>
        <button onClick={() => state.setText('click')}>Click Change Input Text</button>
      </div>
      <div>
        <div>Locale Text test: {i18n.t('test-en-US')}</div>
        <div>Locale Text test2: {i18n.t('test2-en-US')}</div>
        <div>Locale Text test3: {i18n.t('test3-en-US', undefined, 'custom-key-test3')}</div>
        <div>Locale Text test4: {i18n.t('test4-{name}-en-US', { name: 'dynamic-name' })}</div>
        <SelectorLocale />
        <button
          onClick={() => {
            i18n.revertLocale();
          }}
        >
          revert locale setting
        </button>
      </div>
      <div>
        <div>Content:</div>
        <Outlet />
      </div>
    </div>
  );
}
