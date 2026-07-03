import type { ReactElement } from "react";
import type { ChatConversation } from "../../types";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";

interface ChatPanelProps {
  conversation: ChatConversation;
  isResponding: boolean;
  inputText: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  showToast: (text: string) => void;
}

export function ChatPanel({
  conversation,
  isResponding,
  inputText,
  onInputChange,
  onSend,
  showToast
}: ChatPanelProps): ReactElement {
  function handleCopyCode(code: string): void {
    void navigator.clipboard.writeText(code);
    showToast("代码已成功复制到剪贴板");
  }

  function handleApplyChanges(): void {
    showToast("更改已应用并成功合并到本地文件");
  }

  return (
    <main className="chat-main-area">
      <ChatMessages
        conversation={conversation}
        isResponding={isResponding}
        onApplyChanges={handleApplyChanges}
        onCopyCode={handleCopyCode}
      />

      <ChatInput
        value={inputText}
        onChange={onInputChange}
        onSend={onSend}
        disabled={!inputText.trim() || isResponding}
      />
    </main>
  );
}
