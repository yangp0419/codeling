import { useEffect, useRef } from "react";
import type { ReactElement } from "react";
import type { ChatConversation } from "../../types";
import { CompassIcon } from "../icons";
import { MessageBubble } from "./MessageBubble";

interface ChatMessagesProps {
  conversation: ChatConversation;
  isResponding: boolean;
  onApplyChanges: () => void;
  onCopyCode: (code: string) => void;
}

export function ChatMessages({
  conversation,
  isResponding,
  onApplyChanges,
  onCopyCode
}: ChatMessagesProps): ReactElement {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, isResponding]);

  return (
    <>
      <div className="chat-header">
        <div className="chat-title-row">
          <span className="chat-title">{conversation.title}</span>
        </div>
        <div className="chat-meta">
          <CompassIcon />
          <span>适用 GPT-4 Turbo 模型</span>
        </div>
      </div>

      <div className="messages-container">
        {conversation.messages.map((message) => (
          <MessageBubble key={message.id} message={message} onApplyChanges={onApplyChanges} onCopyCode={onCopyCode} />
        ))}

        {isResponding && (
          <div className="message-row assistant">
            <div className="ai-meta-label">SmartFlow AI</div>
            <div className="ai-card" style={{ padding: "16px 20px", display: "inline-block" }}>
              <div className="typing-indicator">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </>
  );
}
