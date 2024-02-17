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

  console.log(i18n.tk('custom-key'));
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
        <div>Locale Text: {i18n.tk('custom-key')}</div>
        <SelectorLocale />
      </div>
      <div>
        <div>Content:</div>
        <Outlet />
      </div>
    </div>
  );
}
