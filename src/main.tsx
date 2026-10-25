import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register service worker with auto-refresh and offline capability
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('[SMART-AGRI SW] New content available, reloading...');
  },
  onOfflineReady() {
    console.log('[SMART-AGRI SW] Application is cached and ready to work offline.');
  },
  onRegisterError(error) {
    console.warn('[SMART-AGRI SW] Service worker registration failed:', error);
  },
});

createRoot(document.getElementById('root')!).render(<App />);
