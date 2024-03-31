import { TricklingInstance, TricklingOptions, createTrickling } from 'trickling';
import 'trickling/lib/style.css';

export const createLoading = (opts?: TricklingOptions): TricklingInstance => {
  return createTrickling(opts);
};

export type { TricklingOptions, TricklingInstance };
