import { useMemo, useState, useEffect, useRef } from "react";
import type { ReactElement } from "react";
import type { ScanProjectResult } from "@codeling/shared";

type AppStatus = "idle" | "selecting" | "scanning" | "ready" | "error";
type TabType = "chat" | "files" | "extensions";

interface Message {
  id: string;
  sender: "user" | "assistant";
  content: string;
  aiLabel?: string;
  codeBlock?: {
    language: string;
    code: string;
  };
  bottomContent?: string;
}

interface ChatConversation {
  id: string;
  title: string;
  folder: string;
  messages: Message[];
}

// Inline custom SVG Icon Components
function LightningIcon(): ReactElement {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function GearIcon(): ReactElement {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function HelpIcon(): ReactElement {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function SearchIcon(): ReactElement {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function ChatIcon(): ReactElement {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function FolderIcon(): ReactElement {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function ExtensionsIcon(): ReactElement {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function ProfileIcon(): ReactElement {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function EditIcon(): ReactElement {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z" />
    </svg>
  );
}

function CompassIcon(): ReactElement {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

function CopyIcon(): ReactElement {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function ApplyIcon(): ReactElement {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function PaperclipIcon(): ReactElement {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function MicrophoneIcon(): ReactElement {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

function SendIcon(): ReactElement {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function BranchIcon(): ReactElement {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="3" x2="6" y2="15" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </svg>
  );
}

function SyncIcon(): ReactElement {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
    </svg>
  );
}

function CommentIcon(): ReactElement {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

// Pre-tokenized Syntax Highlighter for the default processData typescript code snippet
function DefaultTSCodeBlock(): ReactElement {
  return (
    <code className="code-body">
      <div>
        <span className="keyword">import</span> <span className="punctuation">{"{"}</span> <span className="type">PerformanceOptimizer</span> <span className="punctuation">{"}"}</span> <span className="keyword">from</span> <span className="string">"./utils"</span><span className="punctuation">;</span>
      </div>
      <br />
      <div>
        <span className="comment">// 优化后的数据处理逻辑</span>
      </div>
      <div>
        <span className="keyword">export const</span> <span className="function">processData</span> <span className="operator">=</span> <span className="punctuation">(</span><span className="variable">data</span><span className="punctuation">:</span> <span className="type">Record</span><span className="punctuation">&lt;</span><span className="type">string</span><span className="punctuation">,</span> <span className="type">any</span><span className="punctuation">&gt;</span><span className="punctuation">[]</span><span className="punctuation">)</span><span className="punctuation">:</span> <span className="type">Result</span><span className="punctuation">[]</span> <span className="operator">=&gt;</span> <span className="punctuation">{"{"}</span>
      </div>
      <div>
        {"  "}<span className="keyword">if</span> <span className="punctuation">(</span><span className="operator">!</span><span className="variable">data</span> <span className="operator">||</span> <span className="variable">data</span><span className="punctuation">.</span><span className="variable">length</span> <span className="operator">===</span> <span className="variable">0</span><span className="punctuation">)</span> <span className="punctuation">{"{"}</span>
      </div>
      <div>
        {"    "}<span className="keyword">return</span> <span className="punctuation">[]</span><span className="punctuation">;</span>
      </div>
      <div>
        {"  "}<span className="punctuation">{"}"}</span>
      </div>
      <br />
      <div>
        {"  "}<span className="keyword">return</span> <span className="type">PerformanceOptimizer</span><span className="punctuation">.</span><span className="function">batchExecute</span><span className="punctuation">(</span><span className="variable">data</span><span className="punctuation">,</span> <span className="punctuation">(</span><span className="variable">item</span><span className="punctuation">)</span> <span className="operator">=&gt;</span> <span className="punctuation">{"{"}</span>
      </div>
      <div>
        {"    "}<span className="keyword">return</span> <span className="punctuation">{"{"}</span>
      </div>
      <div>
        {"      "}<span className="variable">id</span><span className="punctuation">:</span> <span className="variable">item</span><span className="punctuation">.</span><span className="variable">id</span><span className="punctuation">,</span>
      </div>
      <div>
        {"      "}<span className="variable">timestamp</span><span className="punctuation">:</span> <span className="keyword">new</span> <span className="type">Date</span><span className="punctuation">()</span><span className="punctuation">.</span><span className="function">toISOString</span><span className="punctuation">(),</span>
      </div>
      <div>
        {"      "}<span className="variable">status</span><span className="punctuation">:</span> <span className="string">"optimized"</span>
      </div>
      <div>
        {"    "}<span className="punctuation">{"}"}</span><span className="punctuation">;</span>
      </div>
      <div>
        {"  "}<span className="punctuation">{"}"}</span><span className="punctuation">);</span>
      </div>
      <div>
        <span className="punctuation">{"};"}</span>
      </div>
    </code>
  );
}

export default function App(): ReactElement {
  // Activity bar tabs
  const [activeTab, setActiveTab] = useState<TabType>("chat");

  // Project Selection & Scan
  const [projectPath, setProjectPath] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanProjectResult | null>(null);
  const [status, setStatus] = useState<AppStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Chat interface states
  const [activeChatId, setActiveChatId] = useState<string>("processData");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [inputText, setInputText] = useState<string>("");
  const [isResponding, setIsResponding] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  // Conversations history
  const [conversations, setConversations] = useState<ChatConversation[]>([
    {
      id: "processData",
      title: "优化 processData 函数性能",
      folder: "电商后端优化",
      messages: [
        {
          id: "m1",
          sender: "user",
          content: "能帮我看看 index.ts 里的 processData 函数吗？感觉大数据量下有点慢。"
        },
        {
          id: "m2",
          sender: "assistant",
          aiLabel: "SmartFlow AI",
          content: "我已经为您优化了该函数的性能，并添加了必要的类型检查。为了处理大数据量，我引入了批处理逻辑，这样可以避免阻塞主线程。",
          codeBlock: {
            language: "typescript",
            code: `import { PerformanceOptimizer } from "./utils";\n\n// 优化后的数据处理逻辑\nexport const processData = (data: Record<string, any>[]): Result[] => {\n  if (!data || data.length === 0) {\n    return [];\n  }\n\n  return PerformanceOptimizer.batchExecute(data, (item) => {\n    return {\n      id: item.id,\n      timestamp: new Date().toISOString(),\n      status: "optimized"\n    };\n  });\n};`
          },
          bottomContent: "您可以直接点击右上角的“应用更改”将其合并到您的代码中。还需要进一步解释批处理的内部实现吗？"
        }
      ]
    },
    {
      id: "apiDesign",
      title: "API 接口设计讨论",
      folder: "电商后端优化",
      messages: [
        {
          id: "m3",
          sender: "user",
          content: "如何设计一个符合 RESTful 规范的批量更新接口？"
        },
        {
          id: "m4",
          sender: "assistant",
          aiLabel: "SmartFlow AI",
          content: "建议采用 PATCH 结合请求体包含项数组，或设立一个专门的 bulk-update 端点：\n\n```typescript\nPATCH /api/v1/orders/bulk-update\nContent-Type: application/json\n\n{\n  \"ids\": [101, 102, 103],\n  \"status\": \"shipped\"\n}\n```\n对于更复杂的差异化批量修改，可以将 payload 设计为更改项映射集合。"
        }
      ]
    },
    {
      id: "reactReconstruct",
      title: "React 组件重构建议",
      folder: "React组件库",
      messages: [
        {
          id: "m5",
          sender: "user",
          content: "我们有一个超大的 Table 组件，渲染很卡，有什么重构建议吗？"
        },
        {
          id: "m6",
          sender: "assistant",
          aiLabel: "SmartFlow AI",
          content: "针对大列表卡顿，主要建议如下：\n1. **虚拟列表** (Virtual Scrolling): 推荐使用 `react-window` 或 `@tanstack/react-virtual` 只绘制可视区域。\n2. **粒度细化与缓存**: 将表格行 `Row` 拆为子组件并使用 `React.memo` 封装，避免未修改的行重新渲染。\n3. **计算结果缓存**: 复杂的排序/过滤逻辑务必用 `useMemo` 缓存。"
        }
      ]
    },
    {
      id: "tailwindPalette",
      title: "生成 Tailwind 调色板",
      folder: "React组件库",
      messages: [
        {
          id: "m7",
          sender: "user",
          content: "能帮我生成一个深邃科技感的蓝紫色系 Tailwind 调色板配置吗？"
        },
        {
          id: "m8",
          sender: "assistant",
          aiLabel: "SmartFlow AI",
          content: "这里为您设计了一组具有高端暗黑科技感的蓝紫色系配置。可以用于您的 tailwind.config.js 中：\n\n```json\n{\n  \"theme\": {\n    \"extend\": {\n      \"colors\": {\n        \"cyber-dark\": \"#090d16\",\n        \"cyber-navy\": \"#0f172a\",\n        \"cyber-blue\": \"#2563eb\",\n        \"cyber-indigo\": \"#4f46e5\",\n        \"cyber-violet\": \"#7c3aed\",\n        \"cyber-neon\": \"#06b6d4\"\n      }\n    }\n  }\n}\n```"
        }
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll chats
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, isResponding]);

  // Selected chat details
  const activeConversation = useMemo(() => {
    return (
      conversations.find((c) => c.id === activeChatId) ||
      conversations[0] || {
        id: "fallback",
        title: "新对话",
        folder: "默认",
        messages: []
      }
    );
  }, [conversations, activeChatId]);

  // Grouped chats for sidebar navigation tree
  const foldersMap = useMemo(() => {
    const map: Record<string, ChatConversation[]> = {};
    conversations.forEach((c) => {
      const list = map[c.folder] || [];
      list.push(c);
      map[c.folder] = list;
    });
    return map;
  }, [conversations]);

  // File Count string
  const fileCountText = useMemo(() => {
    if (!scanResult) return "尚未扫描";
    return `${scanResult.files.length} 个代码文件`;
  }, [scanResult]);

  // IPC select folder handler
  async function handleSelectProject(): Promise<void> {
    setStatus("selecting");
    setErrorMessage(null);
    try {
      const selectedPath = await window.codeling.selectProjectDirectory();
      if (selectedPath) {
        setProjectPath(selectedPath);
        setScanResult(null);
        setStatus("idle");
        // Automatically switch to File Explorer to scan
        setActiveTab("files");
      } else {
        setStatus("idle");
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setStatus("error");
    }
  }

  // IPC scan project handler
  async function handleScanProject(): Promise<void> {
    if (!projectPath) return;
    setStatus("scanning");
    setErrorMessage(null);
    try {
      const result = await window.codeling.scanProject(projectPath);
      setScanResult(result);
      setStatus("ready");
      showToastNotification("项目扫描成功！");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setStatus("error");
    }
  }

  // Copy code utility
  function handleCopyCode(code: string): void {
    void navigator.clipboard.writeText(code);
    showToastNotification("代码已成功复制到剪贴板");
  }

  // Apply Changes mock utility
  function handleApplyChanges(): void {
    showToastNotification("更改已应用并成功合并到本地文件");
  }

  // Helper to show temporary feedback toast
  function showToastNotification(text: string): void {
    setToast(text);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  }

  // Send message handler
  function handleSendMessage(): void {
    if (!inputText.trim()) return;
    const userMsgText = inputText;
    setInputText("");

    // Add user message
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeChatId) {
          return {
            ...c,
            messages: [
              ...c.messages,
              {
                id: `u-${Date.now()}`,
                sender: "user",
                content: userMsgText
              }
            ]
          };
        }
        return c;
      })
    );

    // Simulate AI response
    setIsResponding(true);

    setTimeout(() => {
      setIsResponding(false);
      let replyText = "我已经理解了您的问题。我会为您查找相关资料并提供具体方案。";
      
      // Smart contextual integration
      if (projectPath && scanResult && scanResult.files.length > 0) {
        if (userMsgText.toLowerCase().includes("file") || userMsgText.toLowerCase().includes("文件") || userMsgText.toLowerCase().includes("项目")) {
          replyText = `我分析了您加载的项目：\`${projectPath}\`，该项目当前包含 ${scanResult.files.length} 个代码文件。我可以帮助您浏览其结构、进行重构或诊断其中某些文件的代码性能问题。`;
        }
      }

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeChatId) {
            return {
              ...c,
              messages: [
                ...c.messages,
                {
                  id: `a-${Date.now()}`,
                  sender: "assistant",
                  aiLabel: "SmartFlow AI",
                  content: replyText
                }
              ]
            };
          }
          return c;
        })
      );
    }, 1500);
  }

  // New Chat Dialog Simulation
  function handleCreateNewChat(): void {
    const newId = `chat-${Date.now()}`;
    const newChat: ChatConversation = {
      id: newId,
      title: `新对话 #${conversations.length + 1}`,
      folder: "电商后端优化",
      messages: [
        {
          id: `m-init-${Date.now()}`,
          sender: "assistant",
          aiLabel: "SmartFlow AI",
          content: "你好！我是 SmartFlow AI，有什么我可以帮助您的？"
        }
      ]
    };
    setConversations((prev) => [...prev, newChat]);
    setActiveChatId(newId);
    setActiveTab("chat");
    showToastNotification("已创建新会话");
  }

  // File explorer quick action: start chat about file
  function handleFileClick(relativePath: string): void {
    // Switch to Chat tab
    setActiveTab("chat");
    // Pre-fill input
    setInputText(`能帮我分析一下 \`${relativePath}\` 这个文件吗？`);
  }

  const isSelecting = status === "selecting";
  const isScanning = status === "scanning";

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {toast && (
        <div className="toast-notification">
          <span>{toast}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="app-header">
        <div className="logo-section">
          <span className="logo-text">CodeLing</span>
        </div>
        <div className="header-actions">
          <button className="header-btn" title="AI Fast Mode">
            <LightningIcon />
          </button>
          <button className="header-btn" title="Settings">
            <GearIcon />
          </button>
          <button className="header-btn" title="Help & Documentation">
            <HelpIcon />
          </button>
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80"
            alt="User Profile"
            className="avatar-img"
            onError={(e) => {
              // Fallback if image fails to load
              (e.target as HTMLImageElement).src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='28' height='28'%3E%3Ccircle cx='12' cy='12' r='12' fill='%230f2d59'/%3E%3Ctext x='12' y='16' text-anchor='middle' fill='white' font-size='12' font-family='sans-serif'%3EU%3C/text%3E%3C/svg%3E";
            }}
          />
        </div>
      </header>

      {/* Main Container */}
      <div className="app-body">
        {/* Left Activity Bar */}
        <nav className="activity-bar">
          <div className="activity-group">
            <div
              className={`activity-item ${activeTab === "chat" ? "active" : ""}`}
              onClick={() => setActiveTab("chat")}
              title="Conversations Chat"
            >
              <ChatIcon />
            </div>
            <div
              className={`activity-item ${activeTab === "files" ? "active" : ""}`}
              onClick={() => setActiveTab("files")}
              title="Project File Explorer"
            >
              <FolderIcon />
            </div>
            <div
              className={`activity-item ${activeTab === "extensions" ? "active" : ""}`}
              onClick={() => setActiveTab("extensions")}
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

        {/* Secondary Sidebar */}
        <aside className="primary-sidebar">
          {activeTab === "chat" && (
            <>
              <div className="sidebar-header">
                <span className="sidebar-title">项目与会话</span>
                <button className="sidebar-action-btn" title="新建对话" onClick={handleCreateNewChat}>
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
                          onClick={() => setActiveChatId(conv.id)}
                        >
                          {conv.title}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
              <div className="sidebar-bottom">
                <button className="btn-new-chat" onClick={handleCreateNewChat}>
                  <span>+ 新建对话</span>
                </button>
              </div>
            </>
          )}

          {activeTab === "files" && (
            <>
              <div className="file-explorer-header">
                <span className="sidebar-title">项目资源管理器</span>
                <div className="explorer-actions">
                  <button
                    className="explorer-btn primary"
                    onClick={handleSelectProject}
                    disabled={isSelecting || isScanning}
                  >
                    {isSelecting ? "选择中..." : "选择项目目录"}
                  </button>
                  <button
                    className="explorer-btn"
                    onClick={handleScanProject}
                    disabled={!projectPath || isSelecting || isScanning}
                  >
                    {isScanning ? "扫描中..." : "扫描项目"}
                  </button>
                </div>
                {errorMessage && (
                  <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "8px", padding: "8px", background: "#fef2f2", border: "1px solid #fee2e2", borderRadius: "4px" }}>
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
                        onClick={() => handleFileClick(file.relativePath)}
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
          )}

          {activeTab === "extensions" && (
            <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
              <p style={{ fontWeight: "600", marginBottom: "8px" }}>扩展与插件</p>
              <p>暂无已启用的扩展模块。</p>
            </div>
          )}
        </aside>

        {/* Main Conversation Panel */}
        <main className="chat-main-area">
          <div className="chat-header">
            <div className="chat-title-row">
              <span className="chat-title">{activeConversation.title}</span>
            </div>
            <div className="chat-meta">
              <CompassIcon />
              <span>适用 GPT-4 Turbo 模型</span>
            </div>
          </div>

          {/* Messages */}
          <div className="messages-container">
            {activeConversation.messages.map((message) => {
              if (message.sender === "user") {
                return (
                  <div key={message.id} className="message-row user">
                    <div className="user-bubble">{message.content}</div>
                  </div>
                );
              } else {
                return (
                  <div key={message.id} className="message-row assistant">
                    {message.aiLabel && <div className="ai-meta-label">{message.aiLabel}</div>}
                    <div className="ai-card">
                      <div className="ai-text">{message.content}</div>

                      {message.codeBlock && (
                        <div className="code-container">
                          <div className="code-header">
                            <span className="code-lang-label">{message.codeBlock.language}</span>
                            <div className="code-actions">
                              <button
                                className="code-action-btn"
                                onClick={() => handleApplyChanges()}
                                title="应用更改"
                              >
                                <ApplyIcon />
                                <span>应用更改</span>
                              </button>
                              <button
                                className="code-action-btn"
                                onClick={() => handleCopyCode(message.codeBlock!.code)}
                                title="复制代码"
                              >
                                <CopyIcon />
                                <span>复制代码</span>
                              </button>
                            </div>
                          </div>
                          <div className="code-content-wrapper">
                            {/* If it's our default processData code block, display rich syntax highlighting */}
                            {message.id === "m2" ? (
                              <DefaultTSCodeBlock />
                            ) : (
                              <pre className="code-body">
                                <code>{message.codeBlock.code}</code>
                              </pre>
                            )}
                          </div>
                        </div>
                      )}

                      {message.bottomContent && <div className="ai-text bottom">{message.bottomContent}</div>}
                    </div>
                  </div>
                );
              }
            })}

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

          {/* Bottom input area */}
          <div className="chat-input-section">
            <div className="input-box-wrapper">
              <textarea
                className="input-box-textarea"
                placeholder="给 AI 发送消息..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
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
                <button
                  className="btn-send"
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isResponding}
                >
                  <span>发送</span>
                  <SendIcon />
                </button>
              </div>
            </div>
            <div className="disclaimer-text">AI 可能会产生不准确的信息，请核实重要内容</div>
          </div>
        </main>
      </div>

      {/* Bottom Status Bar */}
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
    </div>
  );
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "操作失败，请稍后重试。";
}

function formatFileSize(size: number): string {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}
