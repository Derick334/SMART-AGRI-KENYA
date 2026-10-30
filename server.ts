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

// If pre-bundled server.js is missing, build it on the fly
if (!fs.existsSync(bundledServer)) {
  try {
    const { execSync } = await import('node:child_process');
    execSync('npx esbuild server-backend.ts --bundle --platform=node --format=esm --packages=external --outfile=server.js', { stdio: 'inherit' });
  } catch (bundleErr) {
    console.error('Failed to bundle server-backend.ts:', bundleErr);
  }
}

// In production or whenever bundled server exists, load compiled bundle
if (fs.existsSync(bundledServer)) {
  await import('./server.js');
} else {
  // Fallback to direct execution for development
  await import('./server-backend.ts');
}
