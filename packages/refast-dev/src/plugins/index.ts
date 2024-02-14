import preact from '@preact/preset-vite';
import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { merge } from 'ts-deepmerge';
import { PluginOption } from 'vite';
import { chunkSplitPlugin } from 'vite-plugin-chunk-split';
import viteCompression from 'vite-plugin-compression';
import { viteVConsole } from 'vite-plugin-vconsole';

import { GenerateRoutes } from './generateRoutes';
import { defaultOptions } from './options';
import type { RefastPluginOptions } from './types';

export type { RefastPluginOptions };
export const refastPlugin = (options?: Partial<RefastPluginOptions>): PluginOption[] => {
  const resolvedOptions = merge(defaultOptions, options || {}) as RefastPluginOptions;
  const isProduction = resolvedOptions.isProduction;
  const plugins: PluginOption[] = [];

  if (resolvedOptions.generateRoutes.open) {
    plugins.push(GenerateRoutes(resolvedOptions.generateRoutes.options));
  }
  if (resolvedOptions.appType === 'react') {
    plugins.push(...react(resolvedOptions.reactOptions));
  } else if (resolvedOptions.appType === 'preact') {
    plugins.push(...preact(resolvedOptions.preactOptions));
  }
  if (resolvedOptions.vconsole.open) {
    plugins.push(viteVConsole(resolvedOptions.vconsole.options));
  }
  if (isProduction && resolvedOptions.legacy.open) {
    plugins.push(...legacy(resolvedOptions.legacy.options));
  }
  if (isProduction && resolvedOptions.compression.open) {
    plugins.push(viteCompression(resolvedOptions.compression.options));
  }
  if (isProduction && resolvedOptions.visualizer.open) {
    plugins.push(visualizer(resolvedOptions.visualizer.options));
  }
  if (isProduction && resolvedOptions.chunkSplit.open) {
    plugins.push(chunkSplitPlugin(resolvedOptions.chunkSplit.options));
  }
  return plugins;
};
