import type { ReactElement } from "react";
import { MicrophoneIcon, PaperclipIcon, SendIcon } from "../icons";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled: boolean;
}

export function ChatInput({ value, onChange, onSend, disabled }: ChatInputProps): ReactElement {
  return (
    <div className="chat-input-section">
      <div className="input-box-wrapper">
        <textarea
          className="input-box-textarea"
          placeholder="给 AI 发送消息..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
        />
        <div className="input-controls-row">
          <div className="input-left-tools">
            <button className="input-tool-btn" title="上传附件">
              <PaperclipIcon />
            </button>
            <button className="input-tool-btn" title="语音输入">
              <MicrophoneIcon />
            </button>
          </div>
          <button className="btn-send" onClick={onSend} disabled={disabled}>
            <span>发送</span>
            <SendIcon />
          </button>
        </div>
      </div>
      <div className="disclaimer-text">AI 可能会产生不准确的信息，请核实重要内容</div>
    </div>
  );
}
