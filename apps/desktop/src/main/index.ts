import { app, BrowserWindow, dialog, ipcMain } from "electron";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  createDefaultAiConfig,
  normalizeAiConfig,
  scanProject,
  sendChatMessage
} from "@codeling/core";
import type { AiApiConfig, SendChatRequest } from "@codeling/shared";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);
const aiConfigFileName = "ai-config.json";

function createMainWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1120,
    height: 760,
    minWidth: 900,
    minHeight: 620,
    title: "CodeLing",
    show: false,
    webPreferences: {
      preload: getPreloadPath(),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  if (process.env.ELECTRON_RENDERER_URL) {
    void mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    void mainWindow.loadFile(path.join(currentDirectory, "../renderer/index.html"));
  }
}

ipcMain.handle("project:select-directory", async () => {
  const result = await dialog.showOpenDialog({
    title: "选择项目目录",
    properties: ["openDirectory", "createDirectory"]
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  return result.filePaths[0] ?? null;
});

ipcMain.handle("project:scan", async (_event, projectPath: unknown) => {
  if (typeof projectPath !== "string" || projectPath.trim().length === 0) {
    throw new Error("A valid project path is required.");
  }

  return scanProject(projectPath);
});

ipcMain.handle("ai:get-config", async () => {
  return readAiConfig();
});

ipcMain.handle("ai:save-config", async (_event, config: unknown) => {
  const normalizedConfig = normalizeAiConfig(validateAiConfig(config));
  await saveAiConfig(normalizedConfig);
  return normalizedConfig;
});

ipcMain.handle("ai:chat", async (_event, request: unknown) => {
  const config = await readAiConfig();
  return sendChatMessage(config, validateSendChatRequest(request));
});

void app.whenReady().then(() => {
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

async function readAiConfig(): Promise<AiApiConfig> {
  try {
    const rawConfig = await readFile(getAiConfigPath(), "utf8");
    return normalizeAiConfig(JSON.parse(rawConfig) as Partial<AiApiConfig>);
  } catch {
    return createDefaultAiConfig();
  }
}

async function saveAiConfig(config: AiApiConfig): Promise<void> {
  const configPath = getAiConfigPath();
  await mkdir(path.dirname(configPath), { recursive: true });
  await writeFile(configPath, JSON.stringify(config, null, 2), "utf8");
}

function getAiConfigPath(): string {
  return path.join(app.getPath("userData"), aiConfigFileName);
}

function getPreloadPath(): string {
  const esmPreloadPath = path.join(currentDirectory, "../preload/index.mjs");
  if (existsSync(esmPreloadPath)) {
    return esmPreloadPath;
  }

  return path.join(currentDirectory, "../preload/index.js");
}

function validateAiConfig(config: unknown): AiApiConfig {
  if (!config || typeof config !== "object") {
    throw new Error("API 配置无效。");
  }

  const rawConfig = config as Partial<Record<keyof AiApiConfig, unknown>>;

  return {
    baseUrl: typeof rawConfig.baseUrl === "string" ? rawConfig.baseUrl : "",
    apiKey: typeof rawConfig.apiKey === "string" ? rawConfig.apiKey : "",
    model: typeof rawConfig.model === "string" ? rawConfig.model : ""
  };
}

function validateSendChatRequest(request: unknown): SendChatRequest {
  if (!request || typeof request !== "object") {
    throw new Error("聊天请求无效。");
  }

  const rawRequest = request as SendChatRequest;

  if (!Array.isArray(rawRequest.messages)) {
    throw new Error("聊天消息不能为空。");
  }

  return {
    messages: rawRequest.messages,
    projectContext: rawRequest.projectContext ?? null
  };
}
