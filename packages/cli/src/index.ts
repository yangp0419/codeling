import { normalizeAiConfig, scanProject, sendChatMessage } from "@codeling/core";
import type { ChatMessage } from "@codeling/shared";

interface ParsedArgs {
  command: "scan" | "chat" | "help";
  positional: string[];
  options: Record<string, string | boolean>;
}

const args = parseArgs(process.argv.slice(2));

if (args.command === "help") {
  printHelp();
} else if (args.command === "chat") {
  await runChat(args);
} else {
  await runScan(args);
}

async function runScan(args: ParsedArgs): Promise<void> {
  const projectPath = getStringOption(args, "project") || args.positional[0] || process.cwd();
  const result = await scanProject(projectPath);
  console.log(JSON.stringify(result, null, 2));
}

async function runChat(args: ParsedArgs): Promise<void> {
  const prompt = args.positional.join(" ").trim();

  if (!prompt) {
    throw new Error("请输入要发送给 AI 的消息，例如：pnpm --filter @codeling/cli tsx src/index.ts chat \"解释这个项目\"");
  }

  const projectPath = getStringOption(args, "project");
  const projectContext = projectPath ? await scanProject(projectPath) : null;
  const messages: ChatMessage[] = [
    {
      role: "user",
      content: prompt
    }
  ];
  const response = await sendChatMessage(
    normalizeAiConfig({
      baseUrl: getStringOption(args, "base-url") || process.env.CODELING_BASE_URL,
      apiKey: getStringOption(args, "api-key") || process.env.CODELING_API_KEY,
      model: getStringOption(args, "model") || process.env.CODELING_MODEL
    }),
    {
      messages,
      projectContext
    }
  );

  console.log(response.content);
}

function parseArgs(rawArgs: string[]): ParsedArgs {
  const [firstArg, ...restArgs] = rawArgs;
  const command = firstArg === "chat" || firstArg === "scan" ? firstArg : firstArg === "help" || firstArg === "--help" ? "help" : "scan";
  const commandArgs = command === "scan" && firstArg && firstArg !== "scan" ? rawArgs : restArgs;
  const positional: string[] = [];
  const options: Record<string, string | boolean> = {};

  for (let index = 0; index < commandArgs.length; index += 1) {
    const arg = commandArgs[index];

    if (!arg) {
      continue;
    }

    if (!arg.startsWith("--")) {
      positional.push(arg);
      continue;
    }

    const [rawKey = "", inlineValue] = arg.slice(2).split("=", 2);
    const key = rawKey.trim();

    if (!key) {
      continue;
    }

    if (inlineValue !== undefined) {
      options[key] = inlineValue;
      continue;
    }

    const nextArg = commandArgs[index + 1];

    if (nextArg && !nextArg.startsWith("--")) {
      options[key] = nextArg;
      index += 1;
    } else {
      options[key] = true;
    }
  }

  return { command, positional, options };
}

function getStringOption(args: ParsedArgs, key: string): string | undefined {
  const value = args.options[key];
  return typeof value === "string" && value.trim() ? value : undefined;
}

function printHelp(): void {
  console.log(`CodeLing CLI

Usage:
  codeling scan [projectPath]
  codeling chat "你的问题" [--project path] [--api-key key] [--model model] [--base-url url]

Environment:
  CODELING_API_KEY    AI 服务 API Key
  CODELING_MODEL      模型名称，默认 gpt-4o-mini
  CODELING_BASE_URL   OpenAI 兼容接口地址，默认 https://api.openai.com/v1`);
}
