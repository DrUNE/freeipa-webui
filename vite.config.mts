import { defineConfig } from "vitest/config";
import license from "rollup-plugin-license";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  base: "/ipa/modern-ui",
  build: {
    sourcemap: true,
  },
  plugins: [
    // Use SWC for development, Babel for production (due to s390x and ppc64)
    react(),
    license({
      thirdParty: {
        output: path.join(dirname, "dist", "COPYING"),
        includePrivate: true, // Default is false.
      },
    }),
  ],
  resolve: {
    alias: {
      src: "/src",
    },
  },
  server: {
    host: "0.0.0.0",
    origin: "http://localhost:5173",
    cors: {
      origin: "https://webui.ipa.test",
    },
  },
  test: {
    environment: "jsdom",
    server: {
      deps: {
        inline: [/@patternfly\/.*/],
      },
    },
    setupFiles: ["./src/setupTests.ts"],
  },
});
