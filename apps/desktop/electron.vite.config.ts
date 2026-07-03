import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";

export default defineConfig({
  main: {
    plugins: [
      externalizeDepsPlugin({
        exclude: ["@codeling/core", "@codeling/shared"]
      })
    ]
  },
  preload: {
    plugins: [
      externalizeDepsPlugin({
        exclude: ["@codeling/shared"]
      })
    ]
  },
  renderer: {
    root: resolve("src/renderer"),
    plugins: [react()]
  }
});
