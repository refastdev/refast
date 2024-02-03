import { state } from '@refastdev/refast'

// const store = state.proxy({
//   text: 'text'
// })

console.log(state)

export default function App() {
  // const data = state.useSnapshot(store)
  return (
    <div>
      APP
      {/* App {data.text} */}
      {/* <button onClick={() => (store.text = 'click')}>Click</button> */}
    </div>
  )
}
