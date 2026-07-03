export type AppStatus = "idle" | "selecting" | "scanning" | "ready" | "error";
export type TabType = "chat" | "files" | "extensions" | "settings";

export interface Message {
  id: string;
  sender: "user" | "assistant";
  content: string;
  aiLabel?: string;
  codeBlock?: {
    language: string;
    code: string;
  };
  bottomContent?: string;
}

export interface ChatConversation {
  id: string;
  title: string;
  folder: string;
  messages: Message[];
}
