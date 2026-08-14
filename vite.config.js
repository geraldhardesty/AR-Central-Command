import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Served from https://<user>.github.io/AR-Central-Command/ in production,
// so production builds need the repo name as the base path.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "build" ? "/AR-Central-Command/" : "/",
  server: {
    port: 5173,
    open: true,
  },
}));
