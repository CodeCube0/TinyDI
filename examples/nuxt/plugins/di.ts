import { Container } from 'tinydi';
import { EnglishGreeter, GreeterToken } from '../services/greeter';

/**
 * Composition root: creates the TinyDI container once per app instance and
 * exposes it as `$container` via Nuxt's plugin `provide` mechanism.
 */
export default defineNuxtPlugin(() => {
  const container = new Container();
  container.registerInstance(GreeterToken, new EnglishGreeter());

  return {
    provide: {
      container,
    },
  };
});

declare module '#app' {
  interface NuxtApp {
    $container: Container;
  }
}
