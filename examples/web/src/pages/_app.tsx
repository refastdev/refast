import { Outlet } from '@refastdev/refast';
import { create } from '@refastdev/refast/state';

interface StoreType {
  text: string;
  setText: (text: string) => void;
}

const { useStore } = create<StoreType>((set, setState) => ({
  text: '1',
  setText: (text: string) => {
    set((state) => {
      state.text = text;
    });
  },
}));

export default function App() {
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
        <div>Content:</div>
        <Outlet />
      </div>
    </div>
  );
}
