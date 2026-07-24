import { createToken } from 'tinydi-container';

export interface IGreeter {
  greet(name: string): string;
}

export class EnglishGreeter implements IGreeter {
  greet(name: string): string {
    return `Hello, ${name}! This greeting was resolved from a TinyDI container.`;
  }
}

export const GreeterToken = createToken<IGreeter>('Greeter');
