/**
 * SMART-AGRI KENYA - Production Server Entry Point
 * Compatible with "node server.ts" on Node.js 22 and Cloud Run deployment
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const bundledServer = path.resolve(__dirname, 'server.js');

if (process.env.NODE_ENV === 'production' && fs.existsSync(bundledServer)) {
  await import('./server.js');
} else {
  await import('./server-backend.ts');
}
