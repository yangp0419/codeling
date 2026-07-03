import type { ReactElement } from "react";
import type { ScanProjectResult } from "@codeling/shared";
import { CompassIcon } from "../icons";
import { formatFileSize } from "../../lib/format";

interface FileExplorerProps {
  projectPath: string | null;
  scanResult: ScanProjectResult | null;
  isSelecting: boolean;
  isScanning: boolean;
  errorMessage: string | null;
  onSelectProject: () => void;
  onScanProject: () => void;
  onFileClick: (relativePath: string) => void;
}

export function FileExplorer({
  projectPath,
  scanResult,
  isSelecting,
  isScanning,
  errorMessage,
  onSelectProject,
  onScanProject,
  onFileClick
}: FileExplorerProps): ReactElement {
  const fileCountText = !scanResult ? "尚未扫描" : `${scanResult.files.length} 个代码文件`;

  return (
    <>
      <div className="file-explorer-header">
        <span className="sidebar-title">项目资源管理器</span>
        <div className="explorer-actions">
          <button className="explorer-btn primary" onClick={onSelectProject} disabled={isSelecting || isScanning}>
            {isSelecting ? "选择中..." : "选择项目目录"}
          </button>
          <button
            className="explorer-btn"
            onClick={onScanProject}
            disabled={!projectPath || isSelecting || isScanning}
          >
            {isScanning ? "扫描中..." : "扫描项目"}
          </button>
        </div>
        {errorMessage && (
          <div
            style={{
              color: "#ef4444",
              fontSize: "12px",
              marginTop: "8px",
              padding: "8px",
              background: "#fef2f2",
              border: "1px solid #fee2e2",
              borderRadius: "4px"
            }}
          >
            {errorMessage}
          </div>
        )}
        {projectPath && (
          <div className="project-info-box">
            <div className="project-info-label">项目路径</div>
            <div className="project-info-val">{projectPath}</div>
            <div className="project-info-label" style={{ marginTop: "8px" }}>
              文件统计
            </div>
            <div className="project-info-val" style={{ fontFamily: "inherit", fontWeight: "600" }}>
              {fileCountText}
            </div>
          </div>
        )}
      </div>
      <div className="file-tree-container">
        {scanResult && scanResult.files.length > 0 ? (
          <ul className="file-tree-list">
            {scanResult.files.map((file) => (
              <li
                key={file.relativePath}
                className="file-tree-item"
                onClick={() => onFileClick(file.relativePath)}
                title="点击对此文件进行交谈"
              >
                <span className="file-tree-name">
                  <CompassIcon />
                  {file.relativePath}
                </span>
                <span className="file-tree-size">{formatFileSize(file.size)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ padding: "16px", color: "var(--text-muted)", fontSize: "12px", textAlign: "center" }}>
            请选择项目并扫描，扫描后的文件结构将会列在此处。
          </p>
        )}
      </div>
    </>
  );
}
