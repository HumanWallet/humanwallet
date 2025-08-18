import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'], // Soporte para CommonJS y ESModules
  dts: true, // Genera archivos .d.ts
  sourcemap: true, // Mapea errores al código original
  clean: true, // Limpia dist antes de build
  minify: true, // Minifica el output
  target: 'es2020', // Compatibilidad
});
