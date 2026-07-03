import { useMemo, useState } from "react";
import type { ReactElement } from "react";
import type { ChatConversation } from "../../types";
import { EditIcon, FolderIcon, SearchIcon } from "../icons";

interface ChatSidebarProps {
  conversations: ChatConversation[];
  activeChatId: string;
  onSelectChat: (chatId: string) => void;
  onCreateNewChat: () => void;
}

export function ChatSidebar({
  conversations,
  activeChatId,
  onSelectChat,
  onCreateNewChat
}: ChatSidebarProps): ReactElement {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const foldersMap = useMemo(() => {
    const map: Record<string, ChatConversation[]> = {};
    conversations.forEach((c) => {
      const list = map[c.folder] || [];
      list.push(c);
      map[c.folder] = list;
    });
    return map;
  }, [conversations]);

  return (
    <>
      <div className="sidebar-header">
        <span className="sidebar-title">项目与会话</span>
        <button className="sidebar-action-btn" title="新建对话" onClick={onCreateNewChat}>
          <EditIcon />
        </button>
      </div>
      <div className="sidebar-search">
        <div className="search-input-wrapper">
          <SearchIcon />
          <input
            type="text"
            placeholder="搜索会话..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="sidebar-content">
        {Object.keys(foldersMap).map((folderName) => {
          const items = (foldersMap[folderName] || []).filter((item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
          if (items.length === 0) return null;

          return (
            <div key={folderName} style={{ marginBottom: "12px" }}>
              <div className="sidebar-section-title">
                <FolderIcon />
                <span>{folderName}</span>
              </div>
              {items.map((conv) => (
                <div
                  key={conv.id}
                  className={`sidebar-chat-item ${activeChatId === conv.id ? "active" : ""}`}
                  onClick={() => onSelectChat(conv.id)}
                >
                  {conv.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <div className="sidebar-bottom">
        <button className="btn-new-chat" onClick={onCreateNewChat}>
          <span>+ 新建对话</span>
        </button>
      </div>
    </>
  );
}
