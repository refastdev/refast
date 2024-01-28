import type { UserConfig } from 'vite'

export declare const base: UserConfig
export declare const getLib: ({
  libName,
  entry,
  exceptDeps
}: {
  libName: string
  entry: string
  exceptDeps?: Array<string | RegExp> | undefined
}) => UserConfig
