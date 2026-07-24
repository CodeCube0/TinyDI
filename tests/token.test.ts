import { describe, expect, expectTypeOf, it } from 'vitest';
import { Container } from '../src/container.js';
import { createToken } from '../src/token.js';

interface IMailService {
  send(to: string, body: string): Promise<void>;
}

describe('createToken', () => {
  it('creates a token carrying the given description', () => {
    const token = createToken<string>('Greeting');

    expect(token.description).toBe('Greeting');
    expect(typeof token.symbol).toBe('symbol');
  });

  it('gives every token a unique symbol, even with the same description', () => {
    const a = createToken<string>('Duplicate');
    const b = createToken<string>('Duplicate');

    expect(a.symbol).not.toBe(b.symbol);
    expect(a).not.toBe(b);
  });

  it('does not carry a runtime __type property', () => {
    const token = createToken<string>('NoRuntimeType');

    expect(Object.prototype.hasOwnProperty.call(token, '__type')).toBe(false);
  });

  it('infers the resolved type from the token without an explicit generic', () => {
    const container = new Container();
    const MailServiceToken = createToken<IMailService>('MailService');
    container.registerFactory(MailServiceToken, () => ({
      send: async (): Promise<void> => {
        /* no-op */
      },
    }));

    const resolved = container.resolve(MailServiceToken);

    expectTypeOf(resolved).toEqualTypeOf<IMailService>();
  });

  it('infers primitive types from the token', () => {
    const container = new Container();
    const NumberToken = createToken<number>('Number');
    container.registerInstance(NumberToken, 42);

    const resolved = container.resolve(NumberToken);

    expectTypeOf(resolved).toEqualTypeOf<number>();
    expect(resolved).toBe(42);
  });
});
