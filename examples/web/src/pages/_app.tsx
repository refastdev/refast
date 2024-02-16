import { Outlet, useText } from '@refastdev/refast';
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
  console.log(i18n.t('test'));
  const state = useStore((state) => state);
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
        <button onClick={() => i18n.loadLocale('zh-CN')}>Change Language</button>
      </div>
      <div>
        <div>Content:</div>
        <Outlet />
      </div>
    </div>
  );
}
