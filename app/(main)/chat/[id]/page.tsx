"use client";

import {
  ChevronDown,
  ChevronUp,
  Download,
  FileCode,
  Eye,
  X,
  ArrowUp,
  Paperclip,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Globe,
  FolderOpen,
  FileText,
  Terminal,
  Lightbulb,
  Sparkles,
  ClipboardCopy,
  Wrench,
} from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// ------------------------------------------------------------------
// Mock data matching the design screenshots with hidden steps
// ------------------------------------------------------------------

interface ToolCall {
  id: string;
  name: string;
  args: Record<string, unknown>;
  result?: unknown;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
}

// Mock messages with hidden steps like in the screenshot
const MOCK_MESSAGES: Message[] = [
  {
    id: "m1",
    role: "user",
    content: "帮我生成一个登录页面",
  },
  {
    id: "m2",
    role: "assistant",
    content: `<think>用户想要一个登录页面。我需要：
1. 创建一个 HTML 登录页面
2. 包含用户名和密码输入
3. 添加样式美化</think>`,
  },
  {
    id: "m3",
    role: "assistant",
    content: "我来帮你创建一个漂亮的登录页面。",
    tool_calls: [
      {
        id: "tool-1",
        name: "write_file",
        args: {
          path: "/tmp/user-data/workspace/login.html",
          content: "<!DOCTYPE html>...",
          description: "写入 login.html 文件",
        },
      },
    ],
  },
  {
    id: "m4",
    role: "assistant",
    content: "文件已写入，结果如下",
    tool_call_id: "tool-1",
  },
  // This message has hidden steps like in the screenshot
  {
    id: "m5",
    role: "assistant",
    content: `<think>文件已经创建好了，现在需要把文件复制到 output 目录，让用户能够下载。</think>`,
    tool_calls: [
      {
        id: "tool-2",
        name: "read_file",
        args: {
          path: "/tmp/user-data/workspace/login.html",
          limit: 50,
          description: "读取完整文件",
        },
        result: { success: true, size: "617.96 KB" },
      },
      {
        id: "tool-3",
        name: "bash",
        args: {
          command: "mkdir -p /tmp/user-data/output",
          description: "创建 output 目录",
        },
        result: { success: true },
      },
      {
        id: "tool-4",
        name: "bash",
        args: {
          command: "cp /tmp/user-data/workspace/login.html /tmp/user-data/output/login.html",
          description: "复制文件到 output 目录",
        },
        result: { success: true },
      },
    ],
  },
  {
    id: "m6",
    role: "assistant",
    content: "登录页面已生成完成！文件已保存到 output 目录。",
  },
];

const MOCK_ARTIFACT_CODE = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>登录 - DeerFlow</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .login-container {
      width: 100%;
      max-width: 400px;
      padding: 40px;
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .login-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .login-header h1 {
      font-size: 28px;
      color: #333;
      margin-bottom: 8px;
    }

    .login-header p {
      color: #666;
      font-size: 14px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      color: #555;
      font-size: 14px;
      font-weight: 500;
    }

    .form-group input {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      font-size: 15px;
      transition: border-color 0.3s;
    }

    .form-group input:focus {
      outline: none;
      border-color: #667eea;
    }

    .login-button {
      width: 100%;
      padding: 14px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .login-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
    }

    .login-footer {
      text-align: center;
      margin-top: 20px;
      font-size: 13px;
      color: #888;
    }

    .login-footer a {
      color: #667eea;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="login-container">
    <div class="login-header">
      <h1>欢迎回来</h1>
      <p>请登录您的账户</p>
    </div>
    <form>
      <div class="form-group">
        <label>用户名</label>
        <input type="text" placeholder="请输入用户名">
      </div>
      <div class="form-group">
        <label>密码</label>
        <input type="password" placeholder="请输入密码">
      </div>
      <button type="submit" class="login-button">登录</button>
    </form>
    <div class="login-footer">
      还没有账户？ <a href="#">立即注册</a>
    </div>
  </div>
</body>
</html>`;

// ------------------------------------------------------------------
// Chain of Thought Components
// ------------------------------------------------------------------

function ToolIcon({ name }: { name: string }) {
  const iconMap: Record<string, React.ElementType> = {
    web_search: Search,
    image_search: Search,
    web_fetch: Globe,
    ls: FolderOpen,
    read_file: FileText,
    write_file: FileText,
    str_replace: FileText,
    bash: Terminal,
  };
  const Icon = iconMap[name] || Wrench;
  return <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />;
}

function ToolCallStep({
  toolCall,
  isLast,
}: {
  toolCall: ToolCall;
  isLast?: boolean;
}) {
  const [expanded, setExpanded] = useState(isLast);

  const getLabel = () => {
    if (toolCall.args?.description) {
      return String(toolCall.args.description);
    }

    switch (toolCall.name) {
      case "web_search":
        return toolCall.args?.query
          ? `搜索 "${toolCall.args.query}"`
          : "搜索相关信息";
      case "image_search":
        return toolCall.args?.query
          ? `搜索图片 "${toolCall.args.query}"`
          : "搜索相关图片";
      case "web_fetch":
        return "查看网页";
      case "ls":
        return "列出文件夹";
      case "read_file":
        return "读取文件";
      case "write_file":
        return "写入文件";
      case "str_replace":
        return "编辑文件";
      case "bash":
        return "执行命令";
      default:
        return `使用 "${toolCall.name}" 工具`;
    }
  };

  const getMeta = () => {
    if (toolCall.args?.path) return String(toolCall.args.path);
    if (toolCall.args?.url) return String(toolCall.args.url);
    if (toolCall.args?.command) return String(toolCall.args.command);
    return null;
  };

  const meta = getMeta();

  return (
    <div
      className={cn(
        "rounded-lg border bg-card transition-all",
        isLast ? "border-border" : "border-border/60"
      )}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left hover:bg-accent/30"
      >
        <ToolIcon name={toolCall.name} />
        <span className="flex-1 text-sm text-foreground/90">{getLabel()}</span>
        <ChevronUp
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
            expanded ? "rotate-180" : ""
          )}
        />
      </button>

      {expanded && (
        <div className="border-t border-border/60 px-3 py-2">
          {meta && (
            <div className="mb-2 rounded bg-muted/50 px-2.5 py-1.5 text-xs font-mono text-muted-foreground">
              {meta}
            </div>
          )}
          {toolCall.result !== undefined && (
            <div className="rounded bg-muted/50 p-2">
              <div className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                结果
              </div>
              <pre className="max-h-40 overflow-auto text-xs text-muted-foreground">
                {typeof toolCall.result === "string"
                  ? toolCall.result
                  : JSON.stringify(toolCall.result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ReasoningBlock({ content }: { content: string }) {
  const [expanded, setExpanded] = useState(true);

  // Clean think tags
  const cleanContent = content
    .replace(/<think>/g, "")
    .replace(/<\/think>/g, "")
    .trim();

  return (
    <div className="rounded-lg border border-border/60 bg-muted/30">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-3 py-2.5 text-left hover:bg-accent/30"
      >
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-foreground/90">思考</span>
        </div>
        <ChevronUp
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
            expanded ? "" : "rotate-180"
          )}
        />
      </button>
      {expanded && (
        <div className="border-t border-border/60 px-3 py-2">
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
            {cleanContent}
          </div>
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------------
// Message Step Converter
// ------------------------------------------------------------------

interface Step {
  id: string;
  type: "reasoning" | "toolCall";
  content?: string;
  toolCall?: ToolCall;
}

function convertToSteps(message: Message): Step[] {
  const steps: Step[] = [];

  // Extract reasoning
  const reasoningMatch = message.content.match(/<think>([\s\S]*?)<\/think>/);
  if (reasoningMatch) {
    steps.push({
      id: `${message.id}-reasoning`,
      type: "reasoning",
      content: reasoningMatch[1].trim(),
    });
  }

  // Add tool calls
  if (message.tool_calls) {
    for (const tc of message.tool_calls) {
      if (tc.name === "task") continue;
      steps.push({
        id: tc.id,
        type: "toolCall",
        toolCall: tc,
      });
    }
  }

  return steps;
}

// ------------------------------------------------------------------
// StepsToggle - Hidden steps functionality
// ------------------------------------------------------------------

function StepsToggle({
  count,
  expanded,
  onToggle,
}: {
  count: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5 text-left transition-colors hover:bg-accent/30"
    >
      <span className="text-sm text-muted-foreground">
        {expanded ? "隐藏步骤" : `查看其他 ${count} 个步骤`}
      </span>
      <ChevronUp
        className={cn(
          "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
          expanded ? "rotate-180" : ""
        )}
      />
    </button>
  );
}

// ------------------------------------------------------------------
// MessageGroup - With hidden steps
// ------------------------------------------------------------------

function MessageGroup({
  message,
  isLoading,
}: {
  message: Message;
  isLoading?: boolean;
}) {
  const steps = useMemo(() => convertToSteps(message), [message]);
  const [showHidden, setShowHidden] = useState(false);

  if (message.role === "user") {
    return (
      <div className="my-4 flex justify-start">
        <div className="max-w-[90%] rounded-xl bg-muted px-4 py-2.5 text-sm leading-relaxed text-foreground">
          {message.content}
        </div>
      </div>
    );
  }

  // Get plain content (without think tags)
  const plainContent = message.content
    .replace(/<think>[\s\S]*?<\/think>/g, "")
    .trim();

  // Find last tool call index
  const lastToolIndex = steps.reduce((acc, step, idx) => {
    if (step.type === "toolCall") return idx;
    return acc;
  }, -1);

  // Steps before last tool call are hidden
  const hiddenSteps =
    lastToolIndex > 0 ? steps.slice(0, lastToolIndex) : [];
  const visibleSteps =
    lastToolIndex >= 0 ? steps.slice(lastToolIndex) : steps;

  return (
    <div className="my-5 flex gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-[10px] font-semibold text-background">
        D
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        {/* Hidden steps toggle */}
        {hiddenSteps.length > 0 && (
          <StepsToggle
            count={hiddenSteps.length}
            expanded={showHidden}
            onToggle={() => setShowHidden(!showHidden)}
          />
        )}

        {/* Hidden steps content */}
        {showHidden &&
          hiddenSteps.map((step) =>
            step.type === "reasoning" ? (
              <ReasoningBlock key={step.id} content={step.content || ""} />
            ) : (
              <ToolCallStep key={step.id} toolCall={step.toolCall!} />
            )
          )}

        {/* Visible steps */}
        {visibleSteps.map((step, idx) =>
          step.type === "reasoning" ? (
            <ReasoningBlock key={step.id} content={step.content || ""} />
          ) : (
            <ToolCallStep
              key={step.id}
              toolCall={step.toolCall!}
              isLast={idx === visibleSteps.length - 1}
            />
          )
        )}

        {/* Plain text content */}
        {plainContent && (
          <div className="text-sm leading-relaxed text-foreground">
            {plainContent}
          </div>
        )}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// ArtifactPanel
// ------------------------------------------------------------------

function ArtifactPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<"code" | "preview">("code");
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(MOCK_ARTIFACT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={cn(
        "flex h-full flex-col border-l border-border bg-card transition-all duration-300",
        open ? "w-full opacity-100" : "w-0 overflow-hidden opacity-0"
      )}
    >
      {/* Header */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-border px-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            login.html
          </span>
          <span className="text-xs text-muted-foreground">617.96 KB</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="flex items-center rounded-md border border-border bg-background p-0.5">
            <button
              onClick={() => setMode("code")}
              className={cn(
                "flex h-7 items-center gap-1 rounded px-2 text-xs font-medium transition-colors",
                mode === "code"
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <FileCode className="h-3.5 w-3.5" />
              Code
            </button>
            <button
              onClick={() => setMode("preview")}
              className={cn(
                "flex h-7 items-center gap-1 rounded px-2 text-xs font-medium transition-colors",
                mode === "preview"
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Eye className="h-3.5 w-3.5" />
              Preview
            </button>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            className="h-8 w-8"
            onClick={copyCode}
          >
            {copied ? (
              <span className="text-[10px]">OK</span>
            ) : (
              <ClipboardCopy className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="h-8 w-8"
            onClick={onClose}
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-0 flex-1">
        {mode === "code" ? (
          <ScrollArea className="h-full">
            <pre className="p-4 text-xs leading-5 text-foreground/90">
              <code>{MOCK_ARTIFACT_CODE}</code>
            </pre>
          </ScrollArea>
        ) : (
          <iframe
            title="preview"
            className="h-full w-full border-0"
            sandbox="allow-scripts"
            srcDoc={MOCK_ARTIFACT_CODE}
          />
        )}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// ChatInput
// ------------------------------------------------------------------

function ChatInput() {
  const [value, setValue] = useState("");
  return (
    <div className="relative rounded-2xl border border-border bg-card shadow-sm">
      <Textarea
        placeholder="在这里输入..."
        className="min-h-[80px] resize-none border-0 bg-transparent px-4 py-3.5 text-sm placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="flex items-center justify-between px-3 pb-3">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
        </div>
        <Button
          size="icon"
          className="h-8 w-8 rounded-lg bg-foreground text-background hover:bg-foreground/90"
          disabled={!value.trim()}
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Page
// ------------------------------------------------------------------

export default function ChatDetailPage() {
  const [artifactOpen, setArtifactOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on mount
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  return (
    <div className="flex h-full w-full overflow-hidden bg-background">
      {/* Main chat area */}
      <div
        className={cn(
          "flex min-h-0 flex-col transition-all duration-300",
          artifactOpen ? "w-[55%]" : "w-full"
        )}
      >
        {/* Header */}
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
          <div className="text-sm font-medium text-foreground">
            帮我生成一个登录页面
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1 rounded-lg border-border bg-background px-2.5 text-xs font-medium text-foreground hover:bg-accent"
            >
              导出
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-7 gap-1 rounded-lg border-border bg-background px-2.5 text-xs font-medium hover:bg-accent",
                artifactOpen ? "bg-accent text-accent-foreground" : "text-foreground"
              )}
              onClick={() => setArtifactOpen((v) => !v)}
            >
              {artifactOpen ? (
                <PanelLeftClose className="h-3.5 w-3.5" />
              ) : (
                <PanelLeftOpen className="h-3.5 w-3.5" />
              )}
              附件
            </Button>
          </div>
        </header>

        {/* Messages */}
        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4">
          <div className="mx-auto max-w-3xl pb-4 pt-4">
            {MOCK_MESSAGES.map((message) => (
              <MessageGroup key={message.id} message={message} />
            ))}
            <div className="h-6" />
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-border bg-background px-4 py-3">
          <div className="mx-auto max-w-3xl">
            <ChatInput />
          </div>
        </div>
      </div>

      {/* Artifact panel */}
      <div
        className={cn(
          "shrink-0 transition-all duration-300",
          artifactOpen ? "w-[45%] opacity-100" : "w-0 opacity-0"
        )}
      >
        <ArtifactPanel
          open={artifactOpen}
          onClose={() => setArtifactOpen(false)}
        />
      </div>
    </div>
  );
}
