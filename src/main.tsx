import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/globals.css'

// Filter Three.js r186 THREE.Clock deprecation warning emitted by R3F internal initialization
const origWarn = console.warn;
console.warn = (...args: any[]) => {
  if (typeof args[0] === 'string' && args[0].includes('THREE.Clock: This module has been deprecated')) {
    return;
  }
  origWarn(...args);
};

createRoot(document.getElementById('root')!).render(
  <App />,
)
