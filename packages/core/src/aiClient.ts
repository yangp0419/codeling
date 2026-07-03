import type {
  AiApiConfig,
  ChatMessage,
  ScanProjectResult,
  SendChatRequest,
  SendChatResponse
} from "@codeling/shared";

interface ChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
}

const DEFAULT_BASE_URL = "https://api.openai.com/v1";
const DEFAULT_MODEL = "gpt-4o-mini";

export function createDefaultAiConfig(): AiApiConfig {
  return {
    baseUrl: DEFAULT_BASE_URL,
    apiKey: "",
    model: DEFAULT_MODEL
  };
}

export function normalizeAiConfig(config: Partial<AiApiConfig>): AiApiConfig {
  return {
    baseUrl: normalizeBaseUrl(config.baseUrl || DEFAULT_BASE_URL),
    apiKey: config.apiKey?.trim() || "",
    model: config.model?.trim() || DEFAULT_MODEL
  };
}

export async function sendChatMessage(
  configInput: AiApiConfig,
  request: SendChatRequest
): Promise<SendChatResponse> {
  const config = normalizeAiConfig(configInput);

  if (!config.apiKey) {
    throw new Error("请先配置 API Key。");
  }

  if (request.messages.length === 0) {
    throw new Error("消息不能为空。");
  }

  const messages = buildMessages(request.messages, request.projectContext);
  const endpoint = `${config.baseUrl}/chat/completions`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      temperature: 0.2
    })
  });

  const payload = (await response.json().catch(() => ({}))) as ChatCompletionResponse;

  if (!response.ok) {
    const message = payload.error?.message || `AI 请求失败：HTTP ${response.status}`;
    throw new Error(message);
  }

  const content = payload.choices?.[0]?.message?.content?.trim();

  if (!content) {
    throw new Error("AI 返回为空。");
  }

  return {
    content,
    model: config.model
  };
}

function buildMessages(messages: ChatMessage[], projectContext?: ScanProjectResult | null): ChatMessage[] {
  const systemMessage: ChatMessage = {
    role: "system",
    content:
      "你是 CodeLing 的 AI 编程助手。请用中文回答，给出具体、可执行的工程建议。涉及代码时优先说明关键文件和改动点。"
  };

  if (!projectContext) {
    return [systemMessage, ...messages];
  }

  return [
    systemMessage,
    {
      role: "system",
      content: formatProjectContext(projectContext)
    },
    ...messages
  ];
}

function formatProjectContext(projectContext: ScanProjectResult): string {
  const visibleFiles = projectContext.files
    .slice(0, 80)
    .map((file) => `- ${file.relativePath} (${file.size} bytes)`)
    .join("\n");
  const suffix =
    projectContext.files.length > 80 ? `\n- ... 另有 ${projectContext.files.length - 80} 个文件未列出` : "";

  return `当前项目路径：${projectContext.projectPath}
代码文件数：${projectContext.files.length}
文件列表：
${visibleFiles}${suffix}`;
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.trim().replace(/\/+$/, "");
}
