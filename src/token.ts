/**
 * A type-safe identifier for a service registered in a {@link Container}.
 *
 * Tokens carry their service type `T` as a phantom type (`__type`): the
 * property is declared for the type checker only and is never assigned or
 * read at runtime, so it costs nothing at runtime while letting
 * `container.resolve(token)` infer `T` automatically, without the caller
 * having to specify a generic explicitly.
 *
 * Identity is based on the underlying `symbol`, not on `description` — two
 * tokens created with the same description are distinct registrations.
 */
export interface Token<T> {
  /** Unique runtime identity of this token. Never two tokens share a symbol. */
  readonly symbol: symbol;
  /** Human-readable label used in error messages and debugging. */
  readonly description: string;
  /** Type-only marker carrying `T`. Never present at runtime. */
  readonly __type?: T;
}

/**
 * Creates a new, type-safe {@link Token} identifying a service of type `T`.
 *
 * @param description - A human-readable label for the token, used in error
 * messages (e.g. "No registration found for token ..."). It does not need to
 * be unique: uniqueness is guaranteed by the underlying `symbol`.
 * @returns A token that can be used with {@link Container.registerInstance},
 * {@link Container.registerFactory} and {@link Container.resolve}.
 *
 * @example
 * ```ts
 * interface IMailService {
 *   send(to: string, body: string): Promise<void>;
 * }
 *
 * const MailServiceToken = createToken<IMailService>('MailService');
 *
 * container.registerFactory(MailServiceToken, () => new SmtpMailService());
 *
 * // `mailService` is inferred as `IMailService`, no explicit generic needed.
 * const mailService = container.resolve(MailServiceToken);
 * ```
 *
 * @example
 * Two tokens with the same description are still distinct registrations:
 * ```ts
 * const a = createToken<string>('name');
 * const b = createToken<string>('name');
 * a.symbol !== b.symbol; // true
 * ```
 */
export function createToken<T>(description: string): Token<T> {
  return {
    symbol: Symbol(description),
    description,
  };
}
