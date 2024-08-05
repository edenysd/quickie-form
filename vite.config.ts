import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { vercelPreset } from "@vercel/remix/vite";
import path from "path";

export default defineConfig({
  plugins: [
    remix({
      presets: [vercelPreset()],
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),

    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      "@mui/x-date-pickers/AdapterDayjs": path.resolve(
        __dirname,
        "node_modules/@mui/x-date-pickers/AdapterDayjs/AdapterDayjs.js"
      ),
    },
  },
});
