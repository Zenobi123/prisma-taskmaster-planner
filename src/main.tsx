
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerSW } from './utils/serviceWorkerRegistration'

// Register service worker for update detection
registerSW();

createRoot(document.getElementById("root")!).render(<App />);
