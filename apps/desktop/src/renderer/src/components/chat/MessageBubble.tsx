import type { ReactElement } from "react";
import type { Message } from "../../types";
import { CodeBlock } from "./CodeBlock";

interface MessageBubbleProps {
  message: Message;
  onApplyChanges: () => void;
  onCopyCode: (code: string) => void;
}

export function MessageBubble({ message, onApplyChanges, onCopyCode }: MessageBubbleProps): ReactElement {
  if (message.sender === "user") {
    return (
      <div className="message-row user">
        <div className="user-bubble">{message.content}</div>
      </div>
    );
  }

  return (
    <div className="message-row assistant">
      {message.aiLabel && <div className="ai-meta-label">{message.aiLabel}</div>}
      <div className="ai-card">
        <div className="ai-text">{message.content}</div>

        {message.codeBlock && (
          <CodeBlock
            messageId={message.id}
            language={message.codeBlock.language}
            code={message.codeBlock.code}
            onApply={onApplyChanges}
            onCopy={onCopyCode}
          />
        )}

        {message.bottomContent && <div className="ai-text bottom">{message.bottomContent}</div>}
      </div>
    </div>
  );
}
