import type { ChunkSplitOptions, ChunkSplitOptionsCustomChunk } from './types';

const isRoutes = (file: string) => {
  return (
    /node_modules\/@refastdev\/refast\/dist\/module\/routes/.test(file) ||
    /packages\/refast\/dist\/module\/routes/.test(file)
  );
};

const isLocale = (file: string) => {
  return (
    /node_modules\/@refastdev\/refast\/dist\/module\/locale/.test(file) ||
    /packages\/refast\/dist\/module\/locale/.test(file)
  );
};

const isRefast = (file: string) => {
  return (
    !isRoutes(file) &&
    !isLocale(file) &&
    (/node_modules\/@refastdev/.test(file) || /packages\/refast/.test(file))
  );
};

let customChunkFunc: ChunkSplitOptionsCustomChunk | undefined = undefined;

export const setCustomChunkFunc = (f: ChunkSplitOptionsCustomChunk | undefined = undefined) => {
  customChunkFunc = f;
};

export const chunkSplitOptions: ChunkSplitOptions = {
  strategy: 'single-vendor',
  customChunk: (args) => {
    if (customChunkFunc) {
      const r = customChunkFunc(args);
      if (r) {
        return r;
      }
    }
    const { file, id, moduleId, root } = args;
    if (isLocale(file)) {
      return 'refast-chunk';
    }
    if (isRoutes(file)) {
      return 'refast-chunk';
    }
    if (isRefast(file)) {
      return 'refast';
    }
    return null;
  },
  customSplitting: {
    __commonjsHelpers__: [/some unreachable check/],
    react: [/react/, /react-dom/],
    lodash: [/lodash/],
  },
};
