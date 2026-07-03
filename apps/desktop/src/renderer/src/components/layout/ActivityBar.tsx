import type { ReactElement } from "react";
import type { TabType } from "../../types";
import { ChatIcon, ExtensionsIcon, FolderIcon, ProfileIcon } from "../icons";

interface ActivityBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function ActivityBar({ activeTab, onTabChange }: ActivityBarProps): ReactElement {
  return (
    <nav className="activity-bar">
      <div className="activity-group">
        <div
          className={`activity-item ${activeTab === "chat" ? "active" : ""}`}
          onClick={() => onTabChange("chat")}
          title="Conversations Chat"
        >
          <ChatIcon />
        </div>
        <div
          className={`activity-item ${activeTab === "files" ? "active" : ""}`}
          onClick={() => onTabChange("files")}
          title="Project File Explorer"
        >
          <FolderIcon />
        </div>
        <div
          className={`activity-item ${activeTab === "extensions" ? "active" : ""}`}
          onClick={() => onTabChange("extensions")}
          title="Extensions / Puzzle Blocks"
        >
          <ExtensionsIcon />
        </div>
      </div>
      <div className="activity-group">
        <div className="activity-item" title="User Account">
          <ProfileIcon />
        </div>
      </div>
    </nav>
  );
}
