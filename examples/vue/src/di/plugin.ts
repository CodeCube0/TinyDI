import { inject, type App, type InjectionKey } from 'vue';
import type { Container, Token } from 'tinydi-container';

const ContainerKey: InjectionKey<Container> = Symbol('tinydi-container');

/**
 * A tiny Vue plugin that makes a TinyDI container available to the whole
 * component tree via `provide`/`inject`, TinyDI's own composition happening
 * entirely outside of Vue (see `container.ts`).
 */
export function createContainerPlugin(container: Container): { install(app: App): void } {
  return {
    install(app: App): void {
      app.provide(ContainerKey, container);
    },
  };
}

/**
 * Resolves a service from the container provided by `createContainerPlugin`.
 * Must be called during component setup, like any other Vue composable.
 */
export function useService<T>(token: Token<T>): T {
  const container = inject(ContainerKey);
  if (!container) {
    throw new Error(
      'No TinyDI container was provided. Did you forget to call app.use(createContainerPlugin(container))?',
    );
  }
  return container.resolve(token);
}
