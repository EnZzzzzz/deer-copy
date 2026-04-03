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
  Sparkles,
  ClipboardCopy,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// ------------------------------------------------------------------
// Mock data matching the design screenshots
// ------------------------------------------------------------------

const MOCK_MESSAGES: MessageItem[] = [
  {
    id: "m1",
    role: "user",
    content:
      '<think> 用户要求我返回一个标题，只需要标题，不要引号，不要解释。但问题是，用户没有给出任何具体的内容或主题要求',
  },
  {
    id: "m2",
    role: "assistant",
    content: `1. 首先完成对文件的复制部分，了解已有什么\n2. 然后继续编写剩余的部分`,
  },
  {
    id: "m3",
    role: "assistant",
    content: `<think> 从之前的对话来看，文件已经被写入了一部分。让我先检查文件的当前状态。</think>`,
  },
  {
    id: "m4",
    role: "assistant",
    content: `让我先检查文件的当前状态: [TOOL_CALL] <invoke name="Read"><args><param name="args">{"path": "/tmp/user-data/workspace/index.html", "limit": 50, "offset": 1}</param></args></invoke> </tool_call>`,
  },
  {
    id: "m5",
    role: "assistant",
    type: "file-tree",
    content: "查看生成的文件",
    meta: "/tmp/user-data/workspace",
  },
  {
    id: "m6",
    role: "assistant",
    type: "file",
    content: "index.html",
    meta: "HTML File",
  },
  {
    id: "m7",
    role: "assistant",
    type: "step-collapsed",
    content: "查看其他 1 个步骤",
    meta: "",
  },
  {
    id: "m8",
    role: "assistant",
    type: "checkpoint",
    content: "补充收集页面相关内容",
    meta: "/tmp/user-data/workspace/...html",
  },
  {
    id: "m9",
    role: "assistant",
    content: `<think> 用户要求我返回一个标题...</think>`,
  },
  {
    id: "m10",
    role: "assistant",
    type: "reference",
    content: "参考",
    meta: "",
  },
];

const MOCK_ARTIFACT_CODE = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>小鹿爱吃面 - 个人主页</title>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-main: #fdfbf8;
      --bg-card: #ffffff;
      --text-primary: #2d2a26;
      --text-secondary: #6b6560;
      --accent: #e8e2da;
      --border: #e5e0d8;
    }

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
      font-family: 'Noto Sans SC', sans-serif;
      background: var(--bg-main);
      color: var(--text-primary);
      overflow-x: hidden;
    }
  </style>
</head>
<body>
  ...
</body>
</html>`;

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

type MessageRole = "user" | "assistant";
type MessageType = "text" | "think" | "file" | "file-tree" | "step-collapsed" | "checkpoint" | "reference";

interface MessageItem {
  id: string;
  role: MessageRole;
  type?: MessageType;
  content: string;
  meta?: string;
}

// ------------------------------------------------------------------
// Components
// ------------------------------------------------------------------

function ThinkBlock({ content }: { content: string }) {
  const [open, setOpen] = useState(true);
  const text = content.replace(/<{0,1}think>/g, "").trim();
  return (
    <div className="my-3 rounded-lg border border-border/60 bg-muted/40">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <span className="flex items-center gap-1.5">
          <span className="text-muted-foreground/70">&lt;think&gt;</span>
          <span className="line-clamp-1 text-left">{text.slice(0, 60)}</span>
        </span>
        {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
      </button>
      {open && (
        <div className="px-3 pb-3 text-sm leading-relaxed text-foreground/90">
          {text}
        </div>
      )}
    </div>
  );
}

function UserMessage({ content }: { content: string }) {
  return (
    <div className="my-4 flex justify-start">
      <div className="max-w-[90%] rounded-xl bg-muted px-4 py-2.5 text-sm leading-relaxed text-foreground">
        {content}
      </div>
    </div>
  );
}

function FileCard({ name, subtype, onView }: { name: string; subtype: string; onView?: () => void }) {
  return (
    <div
      onClick={onView}
      className="my-3 flex cursor-pointer items-center justify-between rounded-lg border border-border bg-card px-3 py-2.5 shadow-sm transition-colors hover:border-ring/60 hover:bg-accent/30"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
          <FileCode className="h-4.5 w-4.5 text-muted-foreground" />
        </div>
        <div>
          <div className="text-sm font-medium text-foreground">{name}</div>
          <div className="text-xs text-muted-foreground">{subtype}</div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          className="h-8 w-8"
          onClick={(e) => {
            e.stopPropagation();
            onView?.();
          }}
        >
          <Eye className="h-4 w-4 text-muted-foreground" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          className="h-8 w-8"
          onClick={(e) => e.stopPropagation()}
        >
          <Download className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}

function StepCollapsed({ count }: { count: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="my-2">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
      >
        {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        <span>查看其他 {count} 个步骤</span>
      </button>
    </div>
  );
}

function CheckpointCard({ title, path }: { title: string; path: string }) {
  return (
    <div className="my-3 rounded-lg border border-border bg-card px-3 py-2.5 shadow-sm">
      <div className="text-sm font-medium text-foreground">{title}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{path}</div>
    </div>
  );
}

function ReferenceCard() {
  return (
    <div className="my-3 flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground shadow-sm">
      <Sparkles className="h-4 w-4 text-muted-foreground" />
      <span>参考</span>
    </div>
  );
}

function FileTreeCard({ title, path }: { title: string; path: string }) {
  return (
    <div className="my-3 rounded-lg border border-border bg-card px-3 py-2.5 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <PanelLeftOpen className="h-4 w-4 text-muted-foreground" />
        <span>{title}</span>
      </div>
      <div className="mt-0.5 text-xs text-muted-foreground">{path}</div>
    </div>
  );
}

function AssistantMessage({ item, onViewArtifact }: { item: MessageItem; onViewArtifact?: () => void }) {
  if (item.type === "think" || (item.content.includes("<think") && item.content.includes("</think>"))) {
    return <ThinkBlock content={item.content} />;
  }

  if (item.type === "file") {
    return <FileCard name={item.content} subtype={item.meta || "File"} onView={onViewArtifact} />;
  }

  if (item.type === "step-collapsed") {
    return <StepCollapsed count={1} />;
  }

  if (item.type === "checkpoint") {
    return <CheckpointCard title={item.content} path={item.meta || ""} />;
  }

  if (item.type === "reference") {
    return <ReferenceCard />;
  }

  if (item.type === "file-tree") {
    return <FileTreeCard title={item.content} path={item.meta || ""} />;
  }

  // Plain text with possible inline code styling
  return (
    <div className="my-2 text-sm leading-7 text-foreground">
      {item.content.split("\n").map((line, idx) => (
        <p key={idx} className="my-1">
          {line}
        </p>
      ))}
    </div>
  );
}

function ChatMessageGroup({
  items,
  onViewArtifact,
}: {
  items: MessageItem[];
  onViewArtifact?: () => void;
}) {
  const isUser = items[0]?.role === "user";
  if (isUser) {
    return <UserMessage content={items[0].content} />;
  }

  // Try to merge consecutive think blocks into the same assistant group if needed.
  // For simplicity we render assistant items sequentially under one avatar row.
  return (
    <div className="my-5 flex gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-[10px] font-semibold text-background">
        D
      </div>
      <div className="min-w-0 flex-1">
        {items.map((item) => (
          <AssistantMessage key={item.id} item={item} onViewArtifact={onViewArtifact} />
        ))}
      </div>
    </div>
  );
}

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
          <span className="text-sm font-medium text-foreground">index.html</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="flex items-center rounded-md border border-border bg-background p-0.5">
            <button
              onClick={() => setMode("code")}
              className={cn(
                "flex h-7 items-center gap-1 rounded px-2 text-xs font-medium transition-colors",
                mode === "code" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <FileCode className="h-3.5 w-3.5" />
              Code
            </button>
            <button
              onClick={() => setMode("preview")}
              className={cn(
                "flex h-7 items-center gap-1 rounded px-2 text-xs font-medium transition-colors",
                mode === "preview" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Eye className="h-3.5 w-3.5" />
              Preview
            </button>
          </div>
          <Button variant="ghost" size="icon-sm" className="h-8 w-8" onClick={copyCode}>
            {copied ? (
              <span className="text-[10px]">OK</span>
            ) : (
              <ClipboardCopy className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
          <Button variant="ghost" size="icon-sm" className="h-8 w-8" onClick={onClose}>
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
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground">
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
  const [artifactOpen, setArtifactOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on mount
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  // Group messages by role for rendering
  const groups: MessageItem[][] = [];
  let currentGroup: MessageItem[] = [];
  for (const msg of MOCK_MESSAGES) {
    if (currentGroup.length === 0 || currentGroup[0].role === msg.role) {
      currentGroup.push(msg);
    } else {
      groups.push(currentGroup);
      currentGroup = [msg];
    }
  }
  if (currentGroup.length) groups.push(currentGroup);

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
            用户要求我返回一个标题，只需要标题，不要引号，不要解释。但问题是...
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
              {artifactOpen ? <PanelLeftClose className="h-3.5 w-3.5" /> : <PanelLeftOpen className="h-3.5 w-3.5" />}
              附件
            </Button>
          </div>
        </header>

        {/* Messages */}
        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4">
          <div className="mx-auto max-w-3xl pb-4 pt-4">
            {groups.map((group, idx) => (
              <ChatMessageGroup
                key={idx}
                items={group}
                onViewArtifact={() => setArtifactOpen(true)}
              />
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
        <ArtifactPanel open={artifactOpen} onClose={() => setArtifactOpen(false)} />
      </div>
    </div>
  );
}
