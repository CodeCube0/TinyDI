import { Container, createToken } from 'tinydi';

/**
 * The minimum you need to understand TinyDI: define a service interface,
 * create a token for it, register an instance, and resolve it.
 */
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

// `greeter` is inferred as `IGreeter` — no explicit generic needed.
const greeter = container.resolve(GreeterToken);

console.log(greeter.greet('TinyDI'));
