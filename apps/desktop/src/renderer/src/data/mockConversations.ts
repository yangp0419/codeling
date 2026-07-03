import type { ChatConversation } from "../types";

export const INITIAL_CONVERSATIONS: ChatConversation[] = [
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
        content:
          "我已经为您优化了该函数的性能，并添加了必要的类型检查。为了处理大数据量，我引入了批处理逻辑，这样可以避免阻塞主线程。",
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
        content:
          '建议采用 PATCH 结合请求体包含项数组，或设立一个专门的 bulk-update 端点：\n\n```typescript\nPATCH /api/v1/orders/bulk-update\nContent-Type: application/json\n\n{\n  "ids": [101, 102, 103],\n  "status": "shipped"\n}\n```\n对于更复杂的差异化批量修改，可以将 payload 设计为更改项映射集合。'
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
        content:
          "针对大列表卡顿，主要建议如下：\n1. **虚拟列表** (Virtual Scrolling): 推荐使用 `react-window` 或 `@tanstack/react-virtual` 只绘制可视区域。\n2. **粒度细化与缓存**: 将表格行 `Row` 拆为子组件并使用 `React.memo` 封装，避免未修改的行重新渲染。\n3. **计算结果缓存**: 复杂的排序/过滤逻辑务必用 `useMemo` 缓存。"
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
        content:
          '这里为您设计了一组具有高端暗黑科技感的蓝紫色系配置。可以用于您的 tailwind.config.js 中：\n\n```json\n{\n  "theme": {\n    "extend": {\n      "colors": {\n        "cyber-dark": "#090d16",\n        "cyber-navy": "#0f172a",\n        "cyber-blue": "#2563eb",\n        "cyber-indigo": "#4f46e5",\n        "cyber-violet": "#7c3aed",\n        "cyber-neon": "#06b6d4"\n      }\n    }\n  }\n}\n```'
      }
    ]
  }
];
