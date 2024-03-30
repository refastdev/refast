import type { AuthOption } from '@refastdev/refast';

export const auth: AuthOption = {
  getToken: () => false,
  setToken: (token: any) => {},
  notAuthPath: '/login',
};
