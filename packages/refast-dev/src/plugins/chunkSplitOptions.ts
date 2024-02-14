import { ChunkSplitOptions } from './types';

const isRoutes = (file: string) => {
  return (
    /node_modules\/@refastdev\/refast\/dist\/module\/routes/.test(file) ||
    /packages\/refast\/dist\/module\/routes/.test(file)
  );
};

const isRefast = (file: string) => {
  return (
    !isRoutes(file) && (/node_modules\/@refastdev/.test(file) || /packages\/refast/.test(file))
  );
};

export const chunkSplitOptions: ChunkSplitOptions = {
  strategy: 'single-vendor',
  customChunk: (args) => {
    const { file, id, moduleId, root } = args;
    if (isRoutes(file)) {
      return 'refast-routes';
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
