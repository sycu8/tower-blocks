import { defineConfig } from 'vite';
import { readFileSync } from 'fs';
import { resolve } from 'path';

function codePenTsPlugin() {
  return {
    name: 'codepen-ts-transform',
    enforce: 'pre',
    resolveId(source, importer) {
      if (source.endsWith('script.ts') || source === './script.ts') {
        return resolve('/workspace/script.ts') + '?codepen';
      }
    },
    load(id) {
      if (id.endsWith('script.ts?codepen')) {
        const filePath = id.replace('?codepen', '');
        let code = readFileSync(filePath, 'utf-8');

        // CodePen's TS preprocessor allows `const` inside class bodies.
        // Standard TS/JS parsers require class field syntax (no const/let/var keyword).
        const lines = code.split('\n');
        let inClass = 0;
        const transformed = lines.map((line) => {
          if (/^\s*class\s/.test(line)) {
            inClass++;
          }
          if (inClass > 0) {
            const braceOpen = (line.match(/{/g) || []).length;
            const braceClose = (line.match(/}/g) || []).length;
            inClass += braceOpen - braceClose;
            // Replace const inside class body
            if (/^\s*const\s+\w+\s*=/.test(line)) {
              line = line.replace(/^(\s*)const\s+/, '$1');
            }
          }
          return line;
        }).join('\n');

        // Add global imports for THREE and gsap at the top
        const imports = `import * as THREE from 'three';\nimport { TweenLite, Power1 } from 'gsap';\n`;
        return { code: imports + transformed, map: null };
      }
    },
  };
}

export default defineConfig({
  plugins: [codePenTsPlugin()],
  css: {
    preprocessorOptions: {
      scss: {}
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173
  }
});
