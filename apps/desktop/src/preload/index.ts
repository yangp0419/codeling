import { contextBridge, ipcRenderer } from "electron";
import type { CodelingApi, ScanProjectResult } from "@codeling/shared";

const codelingApi: CodelingApi = {
  selectProjectDirectory: () => ipcRenderer.invoke("project:select-directory") as Promise<string | null>,
  scanProject: (projectPath: string) =>
    ipcRenderer.invoke("project:scan", projectPath) as Promise<ScanProjectResult>
};

contextBridge.exposeInMainWorld("codeling", codelingApi);

