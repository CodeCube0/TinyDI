import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.js';
import { DIProvider } from './di/DIProvider.js';
import { createAppContainer } from './di/container.js';

const container = createAppContainer();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DIProvider container={container}>
      <App />
    </DIProvider>
  </StrictMode>,
);
