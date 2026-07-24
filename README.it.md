# TinyDI

Un container di Dependency Injection per TypeScript minimale, type-safe e senza decorator.

[![npm version](https://img.shields.io/npm/v/tinydi-container.svg)](https://www.npmjs.com/package/tinydi-container)
[![npm downloads](https://img.shields.io/npm/dm/tinydi-container.svg)](https://www.npmjs.com/package/tinydi-container)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

📚 **[Documentazione completa](https://codecube0.github.io/TinyDI/it/)**

_[Read this in English](./README.md)_

## Introduzione

TinyDI è un piccolo container di Dependency Injection (DI) per TypeScript, Node.js, Bun, Deno e i browser moderni. Mette a disposizione un `Container` su cui registrare i servizi e da cui risolverli, con inferenza di tipo completa e zero dipendenze a runtime — niente reflection, niente decorator, niente metadata, niente constructor injection automatica.

```ts
import { Container, createToken } from 'tinydi-container';

interface IGreeter {
  greet(name: string): string;
}

class EnglishGreeter implements IGreeter {
  greet(name: string): string {
    return `Hello, ${name}!`;
  }
}

const GreeterToken = createToken<IGreeter>('Greeter');

const container = new Container();
container.registerInstance(GreeterToken, new EnglishGreeter());

const greeter = container.resolve(GreeterToken); // tipizzato come IGreeter, nessun generic necessario
console.log(greeter.greet('TinyDI'));
```

## Perché TinyDI

La maggior parte dei container DI dell'ecosistema TypeScript (TSyringe, InversifyJS, ...) si appoggia a `reflect-metadata` e ai decorator per scoprire e iniettare automaticamente le dipendenze. È un approccio potente, ma ha costi reali: una dipendenza a runtime dalla reflection dei metadata, i flag di compilazione `experimentalDecorators`/`emitDecoratorMetadata` che influenzano l'intero progetto, e un cablaggio che avviene in modo implicito, guidato dai tipi dei parametri del costruttore invece che da codice leggibile dall'inizio alla fine.

TinyDI prende la posizione opposta: ogni registrazione e ogni dipendenza viene scritta a mano, una volta sola, in un composition root. C'è più codice da scrivere all'inizio, ma in cambio si ottiene:

- Zero dipendenze a runtime, zero decorator, zero `reflect-metadata`.
- Nessun flag speciale del compilatore TypeScript — TinyDI funziona con `strict` TypeScript "puro".
- Grafi di dipendenze che puoi seguire con `Cmd+Click`, perché il cablaggio sono semplici chiamate a funzione.
- Un errore di risoluzione o una dipendenza circolare che indica esattamente il token coinvolto, non uno stack trace che attraversa una libreria di reflection dei metadata.

## Filosofia: "Explicit over magic"

TinyDI **non** utilizza:

- `reflect-metadata`
- `experimentalDecorators` / `emitDecoratorMetadata`
- decorator
- reflection a runtime
- constructor injection automatica
- class scanning / dependency discovery automatica

Ogni servizio viene registrato in modo esplicito con `registerInstance` o `registerFactory`, e ogni dipendenza di cui una factory ha bisogno viene risolta in modo esplicito dal `Container` che riceve. Se non riesci a trovare dove qualcosa viene cablato, è perché non è ancora stato cablato — non perché lo ha fatto un decorator da qualche altra parte.

## Installazione

```bash
npm install tinydi-container
```

TinyDI viene distribuito come ESM, tree-shakable, con dichiarazioni di tipo TypeScript complete. Il target sono Node.js, Bun, Deno e i browser moderni, e richiede **TypeScript 6.0 o superiore** se consumi i suoi tipi (il JavaScript compilato non ha questo requisito).

## Quick Start

```ts
import { Container, createToken, ServiceLifetime } from 'tinydi-container';

interface IClock {
  now(): Date;
}

class SystemClock implements IClock {
  now(): Date {
    return new Date();
  }
}

const ClockToken = createToken<IClock>('Clock');

const container = new Container();
container.registerFactory(ClockToken, () => new SystemClock(), ServiceLifetime.Singleton);

const clock = container.resolve(ClockToken);
console.log(clock.now());
```

## Token System

TinyDI identifica i servizi con dei **token**, non con stringhe o classi:

```ts
const MailServiceToken = createToken<IMailService>('MailService');
```

`createToken<T>(description)` restituisce un `Token<T>` la cui identità è un `symbol` univoco — la `description` è solo un'etichetta leggibile usata nei messaggi di errore, non l'identificatore stesso. Due token creati con la stessa `description` restano registrazioni distinte. Poiché `T` è trasportato dal tipo del token, `container.resolve(MailServiceToken)` inferisce automaticamente `IMailService`: non scriverai mai `resolve<IMailService>(...)`.

## Container

`Container` è l'unica classe di cui hai bisogno:

```ts
const container = new Container();
```

Un container possiede un insieme di registrazioni, indicizzate per token. Registri i servizi con `registerInstance` o `registerFactory`, li risolvi con `resolve`, e gestisci l'insieme delle registrazioni con `has`, `remove` e `clear`.

## Singleton

Il lifetime di default. La prima volta che un token viene risolto, la sua factory viene eseguita una volta sola; ogni chiamata successiva a `resolve()` per lo stesso token restituisce la stessa istanza.

```ts
container.registerFactory(ClockToken, () => new SystemClock()); // Singleton di default
container.resolve(ClockToken) === container.resolve(ClockToken); // true
```

`registerInstance` è sempre Singleton, dato che stai passando al container un'istanza già esistente.

## Transient

Viene creata una nuova istanza ad ogni chiamata a `resolve()`.

```ts
container.registerFactory(RequestIdToken, () => crypto.randomUUID(), ServiceLifetime.Transient);
container.resolve(RequestIdToken) === container.resolve(RequestIdToken); // false
```

## API Reference

### `createToken<T>(description: string): Token<T>`

Crea un token type-safe che identifica un servizio di tipo `T`. `description` viene usata nei messaggi di errore; non deve essere univoca.

### `ServiceLifetime`

```ts
enum ServiceLifetime {
  Singleton,
  Transient,
}
```

### `class Container`

| Metodo                                                                                                        | Descrizione                                                                                                                                                                                         |
| ------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `registerInstance<T>(token: Token<T>, instance: T): void`                                                     | Registra un'istanza già creata. Trattata sempre come Singleton.                                                                                                                                     |
| `registerFactory<T>(token: Token<T>, factory: (container: Container) => T, lifetime?: ServiceLifetime): void` | Registra una factory, costruita in modo lazy alla prima risoluzione. `lifetime` di default è `ServiceLifetime.Singleton`. La factory riceve il container, così può risolvere le proprie dipendenze. |
| `resolve<T>(token: Token<T>): T`                                                                              | Risolve il servizio registrato sotto `token`, completamente tipizzato. Lancia `ResolutionError` se non registrato, `CircularDependencyError` se risolverlo richiede di risolvere se stesso.         |
| `has(token: Token<unknown>): boolean`                                                                         | Controlla se un token ha una registrazione.                                                                                                                                                         |
| `remove(token: Token<unknown>): void`                                                                         | Rimuove la registrazione di un token, se presente.                                                                                                                                                  |
| `clear(): void`                                                                                               | Rimuove tutte le registrazioni.                                                                                                                                                                     |

Registrare un token già registrato — con uno qualsiasi dei due metodi, anche mescolati — lancia `RegistrationError`. Chiama prima `remove()` se vuoi sostituire una registrazione.

### Errori

```ts
ContainerError; // classe base astratta; espone il `token` coinvolto
RegistrationError; // registrazione di un token già registrato
ResolutionError; // risoluzione di un token non registrato
CircularDependencyError; // risoluzione di un token che dipende (transitivamente) da se stesso
```

`CircularDependencyError` espone il ciclo completo in `.path` (un array dei token coinvolti) e lo rende nel proprio `.message` come:

```text
Circular dependency detected:

A
 -> B
 -> C
 -> A
```

## Esempi

Esempi eseguibili e autoconsistenti si trovano in [`examples/`](./examples):

- [`examples/basic`](./examples/basic) — il programma più piccolo possibile: registra un'istanza, risolvila.
- [`examples/service`](./examples/service) — `IMailService` / `GraphApiMailService`, a confronto `registerInstance` e `registerFactory`.
- [`examples/repository-pattern`](./examples/repository-pattern) — `IUserRepository` / `UserRepository` / `UserService`, componendo più dipendenze.
- [`examples/vue`](./examples/vue) — utilizzo del container in Vue tramite `provide`/`inject`.
- [`examples/nuxt`](./examples/nuxt) — un plugin Nuxt (`plugins/di.ts`) che espone il container come `$container`.
- [`examples/react`](./examples/react) — un Context Provider React e un hook `useService`.
- [`examples/node-backend`](./examples/node-backend) — un piccolo scenario backend: logger, repository e service layer composti tramite il container.

Ogni esempio ha un proprio README con le istruzioni per l'esecuzione.

## Best Practice

- **Un solo composition root.** Registra i tuoi servizi in un unico punto (es. `container.ts`), vicino al punto di ingresso dell'applicazione. Tutto il resto dovrebbe solo chiamare `resolve()`.
- **Dipendi dalle interfacce, non dalle classi concrete.** Tipizza i tuoi token con un'interfaccia (`Token<IUserRepository>`), e non importare mai l'implementazione concreta dal codice consumer.
- **Preferisci `registerFactory` a `registerInstance` per tutto ciò che ha dipendenze.** Le factory ricevono il container, quindi possono risolvere le proprie dipendenze in modo esplicito, invece di costringerti a costruire a mano un intero grafo prima di registrarlo.
- **Mantieni i lifetime intenzionali.** Usa Singleton di default per servizi stateless e risorse condivise; ricorri a Transient solo quando ogni risoluzione ha davvero bisogno di un'istanza nuova (es. un request id per-operazione).
- **Lascia che `resolve()` lanci un errore.** Una registrazione mancante è un errore di programmazione, non una condizione recuperabile — non avvolgere ogni chiamata a `resolve()` in un `try`/`catch`; correggi invece la registrazione.

## FAQ

**TinyDI supporta la constructor injection automatica?**
No, per scelta di design. Colleghi tu stesso gli argomenti del costruttore dentro una factory (`(c) => new UserService(c.resolve(UserRepositoryToken))`). Questo è il compromesso centrale di TinyDI: più codice esplicito, zero reflection.

**Posso registrare lo stesso token due volte, per sovrascriverlo?**
Non direttamente — una seconda registrazione su un token già registrato lancia `RegistrationError`. Chiama prima `container.remove(token)` (oppure `container.clear()` per azzerare tutto), poi registra di nuovo. È utile per sostituire le implementazioni nei test.

**TinyDI supporta i lifetime scoped (per-request)?**
Non in questa versione — oggi esistono solo `Singleton` e `Transient`. Il design non preclude intenzionalmente l'aggiunta di un lifetime scoped in futuro, ma non fa parte dell'API attuale.

**TinyDI supporta i child container?**
Non in questa versione. Ogni `Container` è completamente autonomo e senza stato globale condiviso, il che lascia aperta la porta a una relazione parent/child in una versione futura, senza richiedere un redesign.

**TinyDI è legato a Node.js?**
No — ha zero dipendenze a runtime e non usa API specifiche di Node, quindi gira senza modifiche su Bun, Deno e nel browser.

## Confronto con TSyringe

|                                | TinyDI                        | TSyringe                                                |
| ------------------------------ | ----------------------------- | ------------------------------------------------------- |
| Scoperta delle dipendenze      | Esplicita, tramite factory    | Automatica, tramite decorator + `reflect-metadata`      |
| Decorator richiesti            | No                            | Sì (`@injectable`, `@inject`, ...)                      |
| Flag del compilatore richiesti | Nessuno                       | `experimentalDecorators`, `emitDecoratorMetadata`       |
| Dipendenze a runtime           | Nessuna                       | `reflect-metadata`                                      |
| Identità dei token             | `Token<T>` basato su `symbol` | Token stringa o classi                                  |
| Lifetime                       | Singleton, Transient          | Singleton, Transient, ResolutionScoped, ContainerScoped |

TSyringe è un'ottima scelta se vuoi la constructor injection automatica e non ti dispiace avere decorator e `reflect-metadata` nel progetto. TinyDI scambia quella comodità con esplicitezza e una superficie più piccola.

## Confronto con InversifyJS

|                                | TinyDI                                  | InversifyJS                                         |
| ------------------------------ | --------------------------------------- | --------------------------------------------------- |
| Scoperta delle dipendenze      | Esplicita, tramite factory              | Automatica, tramite decorator + `reflect-metadata`  |
| Decorator richiesti            | No                                      | Sì (`@injectable`, `@inject`, ...)                  |
| Flag del compilatore richiesti | Nessuno                                 | `experimentalDecorators`, `emitDecoratorMetadata`   |
| Dipendenze a runtime           | Nessuna                                 | `reflect-metadata`                                  |
| Concetti da imparare           | `Token`, `Container`, `ServiceLifetime` | Container, moduli, binding, scope, middleware       |
| Lifetime                       | Singleton, Transient                    | Singleton, Transient, Request, scope personalizzati |

InversifyJS offre un set di funzionalità molto più ampio (moduli, middleware, multi-injection, tagging) al costo di una superficie API più grande e di una dipendenza a runtime dalla reflection. TinyDI copre intenzionalmente una fetta molto più piccola e semplice dello stesso problema.

## Performance

TinyDI non fa reflection, non fa parsing di metadata e non fa class scanning in nessun momento — `resolve()` è una lookup su una `Map` più, per le factory, una semplice chiamata a funzione. Non c'è alcun costo di avvio per "scoprire" il tuo grafo di dipendenze, perché non c'è alcuna scoperta: il grafo sono esattamente le chiamate a factory che hai scritto tu. L'unica contabilità che `resolve()` fa oltre alla lookup è mantenere un piccolo stack interno delle risoluzioni in corso, usato esclusivamente per rilevare le dipendenze circolari.

## Contribuire

Consulta [CONTRIBUTING.md](./CONTRIBUTING.md) per sapere come contribuire.
