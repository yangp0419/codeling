import type { ReactElement } from "react";
import type { ScanProjectResult } from "@codeling/shared";
import type { ChatConversation, TabType } from "../../types";
import { ChatSidebar } from "../chat/ChatSidebar";
import { FileExplorer } from "../files/FileExplorer";
import { ExtensionsPanel } from "../extensions/ExtensionsPanel";

interface PrimarySidebarProps {
  activeTab: TabType;
  conversations: ChatConversation[];
  activeChatId: string;
  onSelectChat: (chatId: string) => void;
  onCreateNewChat: () => void;
  projectPath: string | null;
  scanResult: ScanProjectResult | null;
  isSelecting: boolean;
  isScanning: boolean;
  errorMessage: string | null;
  onSelectProject: () => void;
  onScanProject: () => void;
  onFileClick: (relativePath: string) => void;
}

export function PrimarySidebar({
  activeTab,
  conversations,
  activeChatId,
  onSelectChat,
  onCreateNewChat,
  projectPath,
  scanResult,
  isSelecting,
  isScanning,
  errorMessage,
  onSelectProject,
  onScanProject,
  onFileClick
}: PrimarySidebarProps): ReactElement {
  return (
    <aside className="primary-sidebar">
      {activeTab === "chat" && (
        <ChatSidebar
          conversations={conversations}
          activeChatId={activeChatId}
          onSelectChat={onSelectChat}
          onCreateNewChat={onCreateNewChat}
        />
      )}

      {activeTab === "files" && (
        <FileExplorer
          projectPath={projectPath}
          scanResult={scanResult}
          isSelecting={isSelecting}
          isScanning={isScanning}
          errorMessage={errorMessage}
          onSelectProject={onSelectProject}
          onScanProject={onScanProject}
          onFileClick={onFileClick}
        />
      )}

      {activeTab === "extensions" && <ExtensionsPanel />}
    </aside>
  );
}
