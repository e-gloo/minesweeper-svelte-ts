import path from 'path';
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      "#lib": path.resolve(__dirname, 'src/lib'),
      "#store": path.resolve(__dirname, 'src/store'),
      "#types": path.resolve(__dirname, 'src/types'),
      "#utils": path.resolve(__dirname, 'src/utils'),
    },
  },
});
