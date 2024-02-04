import { Outlet, state } from '@refastdev/refast'

const store = state.proxy({
  text: 'text'
})

export default function App() {
  const data = state.useSnapshot(store)
  return (
    <div>
      App
      <div>
        <input type="text" value={data.text} onChange={e => (store.text = e.target.value)} />
      </div>
      <div>
        <button onClick={() => (store.text = 'click')}>Click Change Input Text</button>
      </div>
      <div>
        <div>Content:</div>
        <Outlet />
      </div>
    </div>
  )
}
