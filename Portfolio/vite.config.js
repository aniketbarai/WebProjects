import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const assetDirectory = fileURLToPath(new URL('./Asset/', import.meta.url));

// Vite serves /Asset/* from the project root in development. Emit the same
// paths in production without moving or duplicating the original assets.
function preserveAssetPaths() {
  return {
    name: 'preserve-existing-asset-paths',
    apply: 'build',
    async generateBundle() {
      for (const entry of await readdir(assetDirectory, { withFileTypes: true })) {
        if (entry.isFile()) {
          this.emitFile({
            type: 'asset',
            fileName: `Asset/${entry.name}`,
            source: await readFile(join(assetDirectory, entry.name)),
          });
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), preserveAssetPaths()],
  server: { host: '0.0.0.0', allowedHosts: true },
  preview: { host: '0.0.0.0', allowedHosts: true },
  build: { target: 'es2020' },
});
