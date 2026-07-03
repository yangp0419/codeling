import { useState } from "react";
import type { ReactElement } from "react";
import type { TabType } from "./types";
import { Header } from "./components/layout/Header";
import { ActivityBar } from "./components/layout/ActivityBar";
import { PrimarySidebar } from "./components/layout/PrimarySidebar";
import { StatusBar } from "./components/layout/StatusBar";
import { ChatPanel } from "./components/chat/ChatPanel";
import { SettingsPage } from "./components/settings/SettingsPage";
import { useProjectScan } from "./hooks/useProjectScan";
import { useChat } from "./hooks/useChat";
import { useToast } from "./hooks/useToast";
import { useAiConfig } from "./hooks/useAiConfig";

export default function App(): ReactElement {
  const [activeTab, setActiveTab] = useState<TabType>("chat");
  const { toast, showToast } = useToast();
  const projectScan = useProjectScan();
  const aiConfig = useAiConfig();
  const chat = useChat();

  function handleSelectProject(): void {
    void projectScan.selectProject(() => setActiveTab("files"));
  }

  function handleScanProject(): void {
    void projectScan.scanProject(() => showToast("项目扫描成功！"));
  }

  function handleCreateNewChat(): void {
    chat.createNewChat();
    setActiveTab("chat");
    showToast("已创建新会话");
  }

  function handleFileClick(relativePath: string): void {
    setActiveTab("chat");
    chat.setInputText(`能帮我分析一下 \`${relativePath}\` 这个文件吗？`);
  }

  return (
    <div className="app-container">
      {toast && (
        <div className="toast-notification">
          <span>{toast}</span>
        </div>
      )}

      <Header onOpenSettings={() => setActiveTab("settings")} />

      <div className="app-body">
        <ActivityBar activeTab={activeTab} onTabChange={setActiveTab} />

        <PrimarySidebar
          activeTab={activeTab}
          conversations={chat.conversations}
          activeChatId={chat.activeChatId}
          onSelectChat={chat.setActiveChatId}
          onCreateNewChat={handleCreateNewChat}
          projectPath={projectScan.projectPath}
          scanResult={projectScan.scanResult}
          isSelecting={projectScan.isSelecting}
          isScanning={projectScan.isScanning}
          errorMessage={projectScan.errorMessage}
          onSelectProject={handleSelectProject}
          onScanProject={handleScanProject}
          onFileClick={handleFileClick}
        />

        {activeTab === "settings" ? (
          <SettingsPage
            config={aiConfig.config}
            isLoading={aiConfig.isLoading}
            isSaving={aiConfig.isSaving}
            errorMessage={aiConfig.errorMessage}
            onSave={(config) => aiConfig.saveConfig(config, () => showToast("API 配置已保存"))}
          />
        ) : (
          <ChatPanel
            conversation={chat.activeConversation}
            isResponding={chat.isResponding}
            inputText={chat.inputText}
            model={aiConfig.config.model}
            onInputChange={chat.setInputText}
            onSend={() =>
              chat.sendMessage({
                projectPath: projectScan.projectPath,
                scanResult: projectScan.scanResult,
                hasApiKey: aiConfig.hasApiKey,
                onMissingConfig: () => {
                  setActiveTab("settings");
                  showToast("请先配置 API Key");
                }
              })
            }
            showToast={showToast}
          />
        )}
      </div>

      <StatusBar />
    </div>
  );
}
