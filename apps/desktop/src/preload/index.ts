import { contextBridge, ipcRenderer } from "electron";
import type {
  AiApiConfig,
  CodelingApi,
  ScanProjectResult,
  SendChatRequest,
  SendChatResponse
} from "@codeling/shared";

const codelingApi: CodelingApi = {
  selectProjectDirectory: () => ipcRenderer.invoke("project:select-directory") as Promise<string | null>,
  scanProject: (projectPath: string) =>
    ipcRenderer.invoke("project:scan", projectPath) as Promise<ScanProjectResult>,
  getAiConfig: () => ipcRenderer.invoke("ai:get-config") as Promise<AiApiConfig>,
  saveAiConfig: (config: AiApiConfig) =>
    ipcRenderer.invoke("ai:save-config", config) as Promise<AiApiConfig>,
  sendChatMessage: (request: SendChatRequest) =>
    ipcRenderer.invoke("ai:chat", request) as Promise<SendChatResponse>
};

contextBridge.exposeInMainWorld("codeling", codelingApi);
