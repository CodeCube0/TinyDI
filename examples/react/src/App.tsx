import type { ReactNode } from 'react';
import { GreeterToken } from './di/container.js';
import { useService } from './di/DIProvider.js';

export function App(): ReactNode {
  const greeter = useService(GreeterToken);

  return (
    <main>
      <h1>TinyDI + React</h1>
      <p>{greeter.greet('React')}</p>
    </main>
  );
}
