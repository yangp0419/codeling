export interface ProjectFile {
  absolutePath: string;
  relativePath: string;
  extension: string;
  size: number;
}

export interface ScanProjectResult {
  projectPath: string;
  files: ProjectFile[];
}

export interface AiApiConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface SendChatRequest {
  messages: ChatMessage[];
  projectContext?: ScanProjectResult | null;
}

export interface SendChatResponse {
  content: string;
  model: string;
}

export interface CodelingApi {
  selectProjectDirectory: () => Promise<string | null>;
  scanProject: (projectPath: string) => Promise<ScanProjectResult>;
  getAiConfig: () => Promise<AiApiConfig>;
  saveAiConfig: (config: AiApiConfig) => Promise<AiApiConfig>;
  sendChatMessage: (request: SendChatRequest) => Promise<SendChatResponse>;
}
