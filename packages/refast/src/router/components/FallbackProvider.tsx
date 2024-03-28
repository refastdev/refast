import * as React from 'react';

export type FallbackType = NonNullable<React.ReactNode> | null;

export interface FallbackContextType {
  updateFallback: (fallbackElement: FallbackType) => void;
}

export const FallbackContext = React.createContext<FallbackContextType>({
  updateFallback: () => {},
});

interface FallbackProviderProps {
  children: React.ReactNode | React.ReactElement | null;
  loading: React.ReactNode | React.ReactElement | null;
}

export const FallbackProvider: React.FC<FallbackProviderProps> = ({ children, loading }) => {
  const [fallback, setFallback] = React.useState<FallbackType>(null);

  const updateFallback = React.useCallback((fallbackElement: FallbackType) => {
    setFallback(() => fallbackElement);
  }, []);

  const renderChildren = React.useMemo(() => children, [children]);

  return (
    <FallbackContext.Provider value={{ updateFallback }}>
      <React.Suspense
        fallback={
          <>
            {loading}
            {fallback}
          </>
        }
      >
        {renderChildren}
      </React.Suspense>
    </FallbackContext.Provider>
  );
};
