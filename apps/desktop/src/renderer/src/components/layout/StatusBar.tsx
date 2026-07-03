import type { ReactElement } from "react";
import { BranchIcon, CommentIcon, SyncIcon } from "../icons";

export function StatusBar(): ReactElement {
  return (
    <footer className="status-bar">
      <div className="status-bar-section">
        <div className="status-bar-item" title="Git Branch">
          <BranchIcon />
          <span>Main Branch</span>
        </div>
        <div className="status-bar-item" title="Sync Status">
          <SyncIcon />
          <span>Synchronized</span>
        </div>
      </div>
      <div className="status-bar-section">
        <div className="status-bar-item">
          <span>TypeScript</span>
        </div>
        <div className="status-bar-item" title="Give Feedback">
          <CommentIcon />
          <span>反馈</span>
        </div>
      </div>
    </footer>
  );
}
