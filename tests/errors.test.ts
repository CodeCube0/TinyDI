import { describe, expect, it } from 'vitest';
import { Container } from '../src/container.js';
import {
  CircularDependencyError,
  ContainerError,
  RegistrationError,
  ResolutionError,
} from '../src/errors.js';
import { createToken } from '../src/token.js';

describe('error hierarchy', () => {
  it('ResolutionError is a ContainerError and carries the involved token', () => {
    const container = new Container();
    const token = createToken<string>('MissingService');

    try {
      container.resolve(token);
      expect.unreachable('resolve() should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(ContainerError);
      expect(error).toBeInstanceOf(ResolutionError);
      expect(error).toBeInstanceOf(Error);
      const resolutionError = error as ResolutionError;
      expect(resolutionError.name).toBe('ResolutionError');
      expect(resolutionError.token).toBe(token);
      expect(resolutionError.message).toContain('MissingService');
      expect(resolutionError.message).toContain('registerInstance');
      expect(resolutionError.message).toContain('registerFactory');
    }
  });

  it('RegistrationError is a ContainerError and carries the involved token', () => {
    const container = new Container();
    const token = createToken<string>('DuplicateService');
    container.registerInstance(token, 'first');

    try {
      container.registerInstance(token, 'second');
      expect.unreachable('registerInstance() should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(ContainerError);
      expect(error).toBeInstanceOf(RegistrationError);
      const registrationError = error as RegistrationError;
      expect(registrationError.name).toBe('RegistrationError');
      expect(registrationError.token).toBe(token);
      expect(registrationError.message).toContain('DuplicateService');
      expect(registrationError.message).toContain('already registered');
    }
  });

  it('CircularDependencyError is a ContainerError and exposes the full path', () => {
    const container = new Container();
    const aToken = createToken<unknown>('A');
    const bToken = createToken<unknown>('B');

    container.registerFactory(aToken, (c) => ({ b: c.resolve(bToken) }));
    container.registerFactory(bToken, (c) => ({ a: c.resolve(aToken) }));

    try {
      container.resolve(aToken);
      expect.unreachable('resolve() should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(ContainerError);
      expect(error).toBeInstanceOf(CircularDependencyError);
      const circularError = error as CircularDependencyError;
      expect(circularError.name).toBe('CircularDependencyError');
      expect(circularError.path.map((t) => t.description)).toEqual(['A', 'B', 'A']);
      expect(circularError.token).toBe(aToken);
    }
  });

  it('every error type has a distinct, non-generic name', () => {
    const container = new Container();
    const token = createToken<string>('X');
    container.registerInstance(token, 'value');

    let registrationError: RegistrationError | undefined;
    try {
      container.registerInstance(token, 'other');
    } catch (error) {
      registrationError = error as RegistrationError;
    }

    let resolutionError: ResolutionError | undefined;
    try {
      container.resolve(createToken<string>('Unregistered'));
    } catch (error) {
      resolutionError = error as ResolutionError;
    }

    expect(registrationError?.name).not.toBe('Error');
    expect(resolutionError?.name).not.toBe('Error');
    expect(registrationError?.name).not.toBe(resolutionError?.name);
  });
});
