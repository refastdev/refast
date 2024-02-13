import loglevel from 'loglevel';
import type { LogLevelDesc } from 'loglevel';

const isDevelopment = import.meta.env.DEV;
const defaultLevel: LogLevelDesc = isDevelopment ? 'debug' : 'INFO';
let currentLevel: LogLevelDesc | undefined = undefined;

const log = {
  getLevel: () => {
    return currentLevel || loglevel.getLevel();
  },
  setLevel: (level?: LogLevelDesc) => {
    window.console.log = loglevel.log;
    window.console.warn = loglevel.warn;
    window.console.info = loglevel.info;
    window.console.debug = loglevel.debug;
    window.console.error = loglevel.error;
    window.console.trace = loglevel.trace;
    currentLevel = level || defaultLevel;
    loglevel.setLevel(currentLevel);
  },
};

export { log };
