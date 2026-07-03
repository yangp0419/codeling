import type { ReactElement } from "react";
import { ApplyIcon, CopyIcon } from "../icons";

// Pre-tokenized syntax highlighting for the default processData demo snippet.
function ProcessDataDemoCode(): ReactElement {
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

interface CodeBlockProps {
  messageId: string;
  language: string;
  code: string;
  onApply: () => void;
  onCopy: (code: string) => void;
}

export function CodeBlock({ messageId, language, code, onApply, onCopy }: CodeBlockProps): ReactElement {
  return (
    <div className="code-container">
      <div className="code-header">
        <span className="code-lang-label">{language}</span>
        <div className="code-actions">
          <button className="code-action-btn" onClick={onApply} title="应用更改">
            <ApplyIcon />
            <span>应用更改</span>
          </button>
          <button className="code-action-btn" onClick={() => onCopy(code)} title="复制代码">
            <CopyIcon />
            <span>复制代码</span>
          </button>
        </div>
      </div>
      <div className="code-content-wrapper">
        {messageId === "m2" ? (
          <ProcessDataDemoCode />
        ) : (
          <pre className="code-body">
            <code>{code}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
