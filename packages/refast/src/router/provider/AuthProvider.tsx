import { ReactNode, createContext, useMemo, useState } from 'react';

interface AuthData {
  getToken?: () => any;
  setToken?: (token: any) => void;
  notAuthPath?: string;
}

interface AuthContextProps {
  children: ReactNode;
  auth?: AuthData;
}

export interface AuthContextValue {
  token?: any;
  setToken: (token: any) => void;
  notAuthPath?: string;
}

export const AuthContext = createContext<AuthContextValue>({
  setToken(token) {},
});

export const AuthProvider = ({ children, auth }: AuthContextProps) => {
  const [token, _setToken] = useState(auth?.getToken && auth.getToken());

  // Function to set the authentication token
  const __setToken = (newToken: any) => {
    _setToken(newToken);
    if (auth?.setToken) {
      auth.setToken(token);
    }
  };

  // Memoized value of the authentication context
  const contextValue = useMemo(
    () => ({
      token,
      notAuthPath: auth?.notAuthPath,
      setToken: __setToken,
    }),
    [token],
  );

  // Provide the authentication context to the children components
  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
