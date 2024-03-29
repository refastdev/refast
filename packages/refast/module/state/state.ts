import { produce } from 'immer';
import { create as _create, useStore as _useStore } from 'zustand';
import type { Mutate, StoreApi, StoreMutatorIdentifier, UseBoundStore } from 'zustand';
import { createStore as _createStore } from 'zustand/vanilla';

type ExtractState<S> = S extends {
  getState: () => infer T;
}
  ? T
  : never;

type Get<T, K, F> = K extends keyof T ? T[K] : F;

export type InitializerType<
  T,
  Mis extends [StoreMutatorIdentifier, unknown][] = [],
  Mos extends [StoreMutatorIdentifier, unknown][] = [],
  U = T,
> = ((
  setState: (recipe: (state: ExtractState<Mutate<StoreApi<T>, Mos>>) => void) => void,
  setOriginState: Get<Mutate<StoreApi<T>, Mis>, 'setState', never>,
  getState: Get<Mutate<StoreApi<T>, Mis>, 'getState', never>,
  store: Mutate<StoreApi<T>, Mis>,
) => U) & {
  $$storeMutators?: Mos;
};

export type StoreType<T> = {
  useStore: <U>(selector: (state: T) => U) => U;
  getState: StoreApi<T>['getState'];
  setState: (recipe: (state: T) => void) => void;
  setOriginalState: StoreApi<T>['setState'];
  subscribe: StoreApi<T>['subscribe'];
  getInitialState: StoreApi<T>['getInitialState'];
};

export const create = <T, Mos extends [StoreMutatorIdentifier, unknown][] = []>(
  initializer: InitializerType<T, [], Mos>,
): StoreType<T> => {
  const useOriginStore = _create<T>(
    (setState, getState, store) =>
      initializer(
        (recipe) => setState(produce((state) => recipe(state))),
        setState,
        getState,
        store,
      ),
  );
  const setState = useOriginStore.setState;
  const getState = useOriginStore.getState;
  const subscribe = useOriginStore.subscribe;
  const getInitialState = useOriginStore.getInitialState;

  const useStore = <U>(selector: (state: T) => U): U => {
    return useOriginStore(selector);
  };

  const setProduceState = (recipe: (state: T) => void) =>
    setState(produce((state) => recipe(state)));

  return {
    useStore,
    getState,
    setState: setProduceState,
    setOriginalState: setState,
    subscribe,
    getInitialState,
  };
};

export const createStore = <T, Mos extends [StoreMutatorIdentifier, unknown][] = []>(
  initializer: InitializerType<T, [], Mos>,
): StoreType<T> => {
  const store = _createStore<T>((setState, getState, store) =>
    initializer((recipe) => setState(produce((state) => recipe(state))), setState, getState, store),
  );
  const { getState, setState, subscribe, getInitialState } = store;

  const useStore = <U>(selector: (state: T) => U) =>
    _useStore(store, selector);

  const setProduceState = (recipe: (state: T) => void) =>
    setState(produce((state) => recipe(state)));

  return {
    useStore,
    getState,
    setState: setProduceState,
    setOriginalState: setState,
    subscribe,
    getInitialState,
  };
};
