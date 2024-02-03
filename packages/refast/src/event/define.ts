class EventMgr {
  private events: any
  public constructor() {
    this.events = {}
  }
  private _removeItem(arr: any[], item: any) {
    const index = arr.indexOf(item)
    if (index >= 0) {
      arr.splice(index, 1)
      return true
    }
    return false
  }
  private _send(eventName: string, ...args: any[]) {
    if (this.events[eventName] == null) return
    const funcs = this.events[eventName]
    for (let i = funcs.length - 1; i >= 0; i--) {
      const func = funcs[i]
      if (func == null) continue
      func(eventName, ...args)
    }
  }
  public on(eventName: string, func: (eventName: string, ...args: any[]) => void) {
    if (this.events[eventName] == null) {
      this.events[eventName] = []
    }
    this.events[eventName].push(func)
  }
  public clear(eventName: string) {
    if (this.events[eventName] == null) return
    this.events[eventName] = null
  }
  public off(eventName: string, func: (eventName: string, ...args: any[]) => void): boolean {
    if (this.events[eventName] == null) return false
    return this._removeItem(this.events[eventName], func)
  }
  public send(eventName: string, ...args: any[]) {
    this._send(eventName, ...args)
  }
}

export { EventMgr }
