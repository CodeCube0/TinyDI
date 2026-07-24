import type { Token } from 'tinydi';

/**
 * Resolves a service from the container provided by `plugins/di.ts`. Can be
 * called from any component's `<script setup>`, like any other Nuxt
 * composable.
 */
export function useService<T>(token: Token<T>): T {
  const { $container } = useNuxtApp();
  return $container.resolve(token);
}
