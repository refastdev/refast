import preact from '@preact/preset-vite';
import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { chunkSplitPlugin } from 'vite-plugin-chunk-split';
import viteCompression from 'vite-plugin-compression';
import { viteVConsole } from 'vite-plugin-vconsole';

type PreactPluginOptions = Parameters<typeof preact>[0];
type ReactOptions = Parameters<typeof react>[0];
type ViteVConsoleOptions = Parameters<typeof viteVConsole>[0];
type VisualizerOptions = Parameters<typeof visualizer>[0];
type LegacyOptions = Parameters<typeof legacy>[0];
type ViteCompressionOptions = Parameters<typeof viteCompression>[0];
type ChunkSplitOptions = Parameters<typeof chunkSplitPlugin>[0];

interface RefastPluginOptions {
  appType: 'react' | 'preact';
  isProduction: boolean;
  isDevelopment: boolean;
  legacy: {
    open: boolean;
    options?: LegacyOptions;
  };
  compression: {
    open: boolean;
    options?: ViteCompressionOptions;
  };
  visualizer: {
    open: boolean;
    options?: VisualizerOptions;
  };
  vconsole: {
    open: boolean;
    options: ViteVConsoleOptions;
  };
  chunkSplit: {
    open: boolean;
    options: ChunkSplitOptions;
  };
  reactOptions: ReactOptions;
  preactOptions: PreactPluginOptions;
}

export type { RefastPluginOptions };
