import { useMemo, useState } from "react";
import type { ScanProjectResult } from "@codeling/shared";
import type { ChatConversation } from "../types";
import { INITIAL_CONVERSATIONS } from "../data/mockConversations";

interface ProjectContext {
  projectPath: string | null;
  scanResult: ScanProjectResult | null;
  hasApiKey: boolean;
  onMissingConfig: () => void;
}

interface UseChatResult {
  conversations: ChatConversation[];
  activeChatId: string;
  activeConversation: ChatConversation;
  inputText: string;
  isResponding: boolean;
  setActiveChatId: (chatId: string) => void;
  setInputText: (text: string) => void;
  sendMessage: (context: ProjectContext) => void;
  createNewChat: () => void;
}

export function useChat(): UseChatResult {
  const [conversations, setConversations] = useState<ChatConversation[]>(INITIAL_CONVERSATIONS);
  const [activeChatId, setActiveChatId] = useState<string>("processData");
  const [inputText, setInputText] = useState<string>("");
  const [isResponding, setIsResponding] = useState<boolean>(false);

  const activeConversation = useMemo(() => {
    return (
      conversations.find((c) => c.id === activeChatId) ||
      conversations[0] || {
        id: "fallback",
        title: "新对话",
        folder: "默认",
        messages: []
      }
    );
  }, [conversations, activeChatId]);

  function sendMessage({ projectPath, scanResult, hasApiKey, onMissingConfig }: ProjectContext): void {
    if (!inputText.trim()) return;
    if (!hasApiKey) {
      onMissingConfig();
      return;
    }

    const userMsgText = inputText;
    setInputText("");
    const conversationId = activeChatId;
    const conversation = activeConversation;
    const userMessage = {
      id: `u-${Date.now()}`,
      sender: "user" as const,
      content: userMsgText
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            messages: [...c.messages, userMessage]
          };
        }
        return c;
      })
    );

    setIsResponding(true);

    void window.codeling
      .sendChatMessage({
        messages: [...conversation.messages, userMessage].map((message) => ({
          role: message.sender === "assistant" ? "assistant" : "user",
          content: message.content
        })),
        projectContext: projectPath && scanResult ? scanResult : null
      })
      .then((response) => {
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === conversationId) {
              return {
                ...c,
                messages: [
                  ...c.messages,
                  {
                    id: `a-${Date.now()}`,
                    sender: "assistant" as const,
                    aiLabel: "CodeLing AI",
                    content: response.content
                  }
                ]
              };
            }
            return c;
          })
        );
      })
      .catch((error) => {
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === conversationId) {
              return {
                ...c,
                messages: [
                  ...c.messages,
                  {
                    id: `a-${Date.now()}`,
                    sender: "assistant" as const,
                    aiLabel: "CodeLing AI",
                    content: `请求失败：${error instanceof Error ? error.message : "请稍后重试。"}`
                  }
                ]
              };
            }
            return c;
          })
        );
      })
      .finally(() => {
      setIsResponding(false);
      });
  }

  function createNewChat(): void {
    const newId = `chat-${Date.now()}`;
    const newChat: ChatConversation = {
      id: newId,
      title: `新对话 #${conversations.length + 1}`,
      folder: "电商后端优化",
      messages: [
        {
          id: `m-init-${Date.now()}`,
          sender: "assistant",
          aiLabel: "SmartFlow AI",
          content: "你好！我是 SmartFlow AI，有什么我可以帮助您的？"
        }
      ]
    };
    setConversations((prev) => [...prev, newChat]);
    setActiveChatId(newId);
  }

  return {
    conversations,
    activeChatId,
    activeConversation,
    inputText,
    isResponding,
    setActiveChatId,
    setInputText,
    sendMessage,
    createNewChat
  };
}
