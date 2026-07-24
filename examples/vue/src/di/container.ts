import { Container, createToken } from 'tinydi';
import { EnglishGreeter, type IGreeter } from './greeter.js';

export const GreeterToken = createToken<IGreeter>('Greeter');

export function createAppContainer(): Container {
  const container = new Container();
  container.registerInstance(GreeterToken, new EnglishGreeter());
  return container;
}
