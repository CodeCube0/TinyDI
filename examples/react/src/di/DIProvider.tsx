import { createContext, useContext, type ReactNode } from 'react';
import type { Container, Token } from 'tinydi';

const ContainerContext = createContext<Container | null>(null);

interface DIProviderProps {
  container: Container;
  children: ReactNode;
}

/**
 * Makes a TinyDI container available to the component tree below it via
 * React context. Composition (`createAppContainer`) happens entirely
 * outside of React, in `container.ts`.
 */
export function DIProvider({ container, children }: DIProviderProps): ReactNode {
  return <ContainerContext.Provider value={container}>{children}</ContainerContext.Provider>;
}

/**
 * Resolves a service from the container made available by `DIProvider`.
 * Must be called from a component rendered under `<DIProvider>`, like any
 * other React hook.
 */
export function useService<T>(token: Token<T>): T {
  const container = useContext(ContainerContext);
  if (!container) {
    throw new Error('No TinyDI container was provided. Did you forget to render <DIProvider>?');
  }
  return container.resolve(token);
}
