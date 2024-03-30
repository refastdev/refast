import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';

interface AuthContextProps {
  children: ReactNode;
  getToken?: () => any;
  setToken?: (token: any) => void;
}

export interface AuthContextValue {
  token?: any;
  setToken: (token: any) => void;
}

export const AuthContext = createContext<AuthContextValue>({
  setToken(token) {},
});

const AuthProvider = ({ children, getToken, setToken }: AuthContextProps) => {
  const [token, _setToken] = useState(getToken && getToken());

  // Function to set the authentication token
  const __setToken = (newToken: any) => {
    _setToken(newToken);
  };

  useEffect(() => {
    if (setToken) {
      setToken(token);
    }
  }, [token]);

  // Memoized value of the authentication context
  const contextValue = useMemo(
    () => ({
      token,
      setToken: __setToken,
    }),
    [token],
  );

  // Provide the authentication context to the children components
  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
