import { beforeEach, describe, expect, it } from 'vitest';
import { Container } from '../src/container.js';
import { RegistrationError, ResolutionError } from '../src/errors.js';
import { ServiceLifetime } from '../src/service-lifetime.js';
import { createToken } from '../src/token.js';

describe('Container', () => {
  let container: Container;

  beforeEach(() => {
    container = new Container();
  });

  describe('registerInstance', () => {
    it('registers an already-created instance and resolves it', () => {
      const token = createToken<{ name: string }>('Config');
      const instance = { name: 'tinydi' };

      container.registerInstance(token, instance);

      expect(container.resolve(token)).toBe(instance);
    });

    it('always returns the exact same instance on every resolve', () => {
      const token = createToken<object>('SharedInstance');
      const instance = {};
      container.registerInstance(token, instance);

      expect(container.resolve(token)).toBe(container.resolve(token));
    });

    it('throws RegistrationError when the token is already registered', () => {
      const token = createToken<string>('Duplicate');
      container.registerInstance(token, 'first');

      expect(() => container.registerInstance(token, 'second')).toThrow(RegistrationError);
    });
  });

  describe('registerFactory', () => {
    it('defaults to Singleton lifetime when none is provided', () => {
      const token = createToken<object>('DefaultLifetime');
      let callCount = 0;
      container.registerFactory(token, () => {
        callCount += 1;
        return {};
      });

      container.resolve(token);
      container.resolve(token);

      expect(callCount).toBe(1);
    });

    it('Singleton: resolve always returns the same instance', () => {
      const token = createToken<object>('Singleton');
      container.registerFactory(token, () => ({}), ServiceLifetime.Singleton);

      const first = container.resolve(token);
      const second = container.resolve(token);

      expect(first).toBe(second);
    });

    it('Transient: resolve creates a new instance every time', () => {
      const token = createToken<object>('Transient');
      container.registerFactory(token, () => ({}), ServiceLifetime.Transient);

      const first = container.resolve(token);
      const second = container.resolve(token);

      expect(first).not.toBe(second);
    });

    it('passes the container to the factory, enabling dependency composition', () => {
      const dependencyToken = createToken<string>('Dependency');
      const dependentToken = createToken<string>('Dependent');
      container.registerInstance(dependencyToken, 'value');
      container.registerFactory(dependentToken, (c) => `wrapped(${c.resolve(dependencyToken)})`);

      expect(container.resolve(dependentToken)).toBe('wrapped(value)');
    });

    it('throws RegistrationError when the token is already registered', () => {
      const token = createToken<object>('DuplicateFactory');
      container.registerFactory(token, () => ({}));

      expect(() => container.registerFactory(token, () => ({}))).toThrow(RegistrationError);
    });

    it('throws RegistrationError when mixing registerInstance and registerFactory on the same token', () => {
      const token = createToken<object>('Mixed');
      container.registerInstance(token, {});

      expect(() => container.registerFactory(token, () => ({}))).toThrow(RegistrationError);
    });
  });

  describe('resolve', () => {
    it('throws ResolutionError for a token that was never registered', () => {
      const token = createToken<string>('Unregistered');

      expect(() => container.resolve(token)).toThrow(ResolutionError);
    });

    it('throws ResolutionError after the token has been removed', () => {
      const token = createToken<string>('RemovedThenResolved');
      container.registerInstance(token, 'value');
      container.remove(token);

      expect(() => container.resolve(token)).toThrow(ResolutionError);
    });

    it('throws ResolutionError after the container has been cleared', () => {
      const token = createToken<string>('ClearedThenResolved');
      container.registerInstance(token, 'value');
      container.clear();

      expect(() => container.resolve(token)).toThrow(ResolutionError);
    });
  });

  describe('has', () => {
    it('returns false for a token that was never registered', () => {
      const token = createToken<string>('Unknown');

      expect(container.has(token)).toBe(false);
    });

    it('returns true after registerInstance', () => {
      const token = createToken<string>('KnownInstance');
      container.registerInstance(token, 'value');

      expect(container.has(token)).toBe(true);
    });

    it('returns true after registerFactory', () => {
      const token = createToken<string>('KnownFactory');
      container.registerFactory(token, () => 'value');

      expect(container.has(token)).toBe(true);
    });

    it('returns false after remove', () => {
      const token = createToken<string>('ToBeRemoved');
      container.registerInstance(token, 'value');
      container.remove(token);

      expect(container.has(token)).toBe(false);
    });
  });

  describe('remove', () => {
    it('is a no-op when the token was never registered', () => {
      const token = createToken<string>('NeverRegistered');

      expect(() => container.remove(token)).not.toThrow();
      expect(container.has(token)).toBe(false);
    });

    it('allows re-registering the same token after removal', () => {
      const token = createToken<string>('Reregistrable');
      container.registerInstance(token, 'first');
      container.remove(token);
      container.registerInstance(token, 'second');

      expect(container.resolve(token)).toBe('second');
    });

    it('only removes the targeted token, leaving others intact', () => {
      const tokenA = createToken<string>('KeepA');
      const tokenB = createToken<string>('RemoveB');
      container.registerInstance(tokenA, 'a');
      container.registerInstance(tokenB, 'b');

      container.remove(tokenB);

      expect(container.has(tokenA)).toBe(true);
      expect(container.has(tokenB)).toBe(false);
    });
  });

  describe('clear', () => {
    it('removes every registration', () => {
      const tokenA = createToken<string>('A');
      const tokenB = createToken<string>('B');
      container.registerInstance(tokenA, 'a');
      container.registerFactory(tokenB, () => 'b');

      container.clear();

      expect(container.has(tokenA)).toBe(false);
      expect(container.has(tokenB)).toBe(false);
    });

    it('is a no-op on an already-empty container', () => {
      expect(() => container.clear()).not.toThrow();
    });

    it('allows registering fresh tokens after clearing', () => {
      const token = createToken<string>('AfterClear');
      container.registerInstance(token, 'stale');
      container.clear();

      expect(() => container.registerInstance(token, 'fresh')).not.toThrow();
      expect(container.resolve(token)).toBe('fresh');
    });
  });
});
