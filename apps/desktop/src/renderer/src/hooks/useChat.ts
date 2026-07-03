import { useMemo, useState } from "react";
import type { ScanProjectResult } from "@codeling/shared";
import type { ChatConversation } from "../types";
import { INITIAL_CONVERSATIONS } from "../data/mockConversations";

interface ProjectContext {
  projectPath: string | null;
  scanResult: ScanProjectResult | null;
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

  function sendMessage({ projectPath, scanResult }: ProjectContext): void {
    if (!inputText.trim()) return;
    const userMsgText = inputText;
    setInputText("");

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeChatId) {
          return {
            ...c,
            messages: [
              ...c.messages,
              {
                id: `u-${Date.now()}`,
                sender: "user" as const,
                content: userMsgText
              }
            ]
          };
        }
        return c;
      })
    );

    setIsResponding(true);

    setTimeout(() => {
      setIsResponding(false);
      let replyText = "我已经理解了您的问题。我会为您查找相关资料并提供具体方案。";

      if (projectPath && scanResult && scanResult.files.length > 0) {
        if (userMsgText.toLowerCase().includes("file") || userMsgText.includes("文件") || userMsgText.includes("项目")) {
          replyText = `我分析了您加载的项目：\`${projectPath}\`，该项目当前包含 ${scanResult.files.length} 个代码文件。我可以帮助您浏览其结构、进行重构或诊断其中某些文件的代码性能问题。`;
        }
      }

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeChatId) {
            return {
              ...c,
              messages: [
                ...c.messages,
                {
                  id: `a-${Date.now()}`,
                  sender: "assistant" as const,
                  aiLabel: "SmartFlow AI",
                  content: replyText
                }
              ]
            };
          }
          return c;
        })
      );
    }, 1500);
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
