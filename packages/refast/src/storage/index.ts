import { LocalStorageData, SessionStorageData } from './storage';

export * from './storage';

const globalLocalStorage = new LocalStorageData();
const globalSessionStorage = new SessionStorageData();

export { globalLocalStorage, globalSessionStorage };
