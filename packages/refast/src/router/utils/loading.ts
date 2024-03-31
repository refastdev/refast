import { TricklingInstance, TricklingOptions, createTrickling } from 'trickling';
import 'trickling/lib/style.css';

export const createLoading = (opts?: TricklingOptions): TricklingInstance => {
  opts = opts || {};
  if (opts.showSpinner === undefined) {
    opts.showSpinner = false;
  }
  return createTrickling(opts);
};

export type { TricklingOptions, TricklingInstance };
