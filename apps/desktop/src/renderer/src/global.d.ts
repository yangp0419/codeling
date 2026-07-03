import type { CodelingApi } from "@codeling/shared";

declare global {
  interface Window {
    codeling: CodelingApi;
  }
}

export {};

