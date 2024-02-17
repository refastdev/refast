import preact from '@preact/preset-vite';
import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { chunkSplitPlugin } from 'vite-plugin-chunk-split';
import viteCompression from 'vite-plugin-compression';
import { viteVConsole } from 'vite-plugin-vconsole';

import type { GenerateLocalesOptions } from './generateLocales';
import type { GenerateRoutesOptions } from './generateRoutes';

export type PreactPluginOptions = Parameters<typeof preact>[0];
export type ReactOptions = Parameters<typeof react>[0];
export type ViteVConsoleOptions = Parameters<typeof viteVConsole>[0];
export type VisualizerOptions = Parameters<typeof visualizer>[0];
export type LegacyOptions = Parameters<typeof legacy>[0];
export type ViteCompressionOptions = Parameters<typeof viteCompression>[0];
export type ChunkSplitOptions = Parameters<typeof chunkSplitPlugin>[0];

interface RefastPluginOptions {
  appType: 'react' | 'preact';
  isProduction: boolean;
  isDevelopment: boolean;
  generateRoutes: {
    open: boolean;
    options?: GenerateRoutesOptions;
  };
  generateLocales: {
    open: boolean;
    options?: GenerateLocalesOptions;
  };
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
