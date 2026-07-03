import type { ReactElement } from "react";

export function ExtensionsPanel(): ReactElement {
  return (
    <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
      <p style={{ fontWeight: "600", marginBottom: "8px" }}>扩展与插件</p>
      <p>暂无已启用的扩展模块。</p>
    </div>
  );
}
