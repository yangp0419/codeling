import { useEffect, useState } from "react";
import type { FormEvent, ReactElement } from "react";
import type { AiApiConfig } from "@codeling/shared";

interface SettingsPageProps {
  config: AiApiConfig;
  isLoading: boolean;
  isSaving: boolean;
  errorMessage: string | null;
  onSave: (config: AiApiConfig) => Promise<void>;
}

export function SettingsPage({
  config,
  isLoading,
  isSaving,
  errorMessage,
  onSave
}: SettingsPageProps): ReactElement {
  const [draftConfig, setDraftConfig] = useState<AiApiConfig>(config);

  useEffect(() => {
    setDraftConfig(config);
  }, [config]);

  function updateField(field: keyof AiApiConfig, value: string): void {
    setDraftConfig((prev) => ({
      ...prev,
      [field]: value
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    void onSave(draftConfig);
  }

  return (
    <main className="settings-main-area">
      <div className="settings-header">
        <div>
          <h1 className="settings-title">设置</h1>
          <p className="settings-subtitle">配置 CodeLing 连接真实 AI 服务所需的接口信息。</p>
        </div>
      </div>

      <form className="settings-form" onSubmit={handleSubmit}>
        <section className="settings-section">
          <div className="settings-section-heading">
            <h2>API 配置</h2>
            <span className={`settings-status ${draftConfig.apiKey.trim() ? "ready" : ""}`}>
              {draftConfig.apiKey.trim() ? "已配置" : "未配置"}
            </span>
          </div>

          <label className="settings-field">
            <span>Base URL</span>
            <input
              type="url"
              value={draftConfig.baseUrl}
              placeholder="https://api.openai.com/v1"
              onChange={(event) => updateField("baseUrl", event.target.value)}
              disabled={isLoading || isSaving}
            />
          </label>

          <label className="settings-field">
            <span>API Key</span>
            <input
              type="password"
              value={draftConfig.apiKey}
              placeholder="sk-..."
              onChange={(event) => updateField("apiKey", event.target.value)}
              disabled={isLoading || isSaving}
            />
          </label>

          <label className="settings-field">
            <span>Model</span>
            <input
              type="text"
              value={draftConfig.model}
              placeholder="gpt-4o-mini"
              onChange={(event) => updateField("model", event.target.value)}
              disabled={isLoading || isSaving}
            />
          </label>

          {errorMessage && <div className="settings-error">{errorMessage}</div>}

          <div className="settings-actions">
            <button className="settings-save-btn" type="submit" disabled={isLoading || isSaving}>
              {isSaving ? "保存中..." : "保存配置"}
            </button>
          </div>
        </section>
      </form>
    </main>
  );
}

export function SettingsSidebar(): ReactElement {
  return (
    <>
      <div className="sidebar-header">
        <span className="sidebar-title">设置</span>
      </div>
      <div className="settings-sidebar-list">
        <div className="settings-sidebar-item active">API 配置</div>
      </div>
    </>
  );
}
