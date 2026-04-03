"use client";

import { cn } from "@/lib/utils";
import { ChevronUp, Search, Globe, FolderOpen, FileText, Terminal, Lightbulb, Wrench } from "lucide-react";
import { useState } from "react";

// ------------------------------------------------------------------
// ChainOfThought Container
// ------------------------------------------------------------------

interface ChainOfThoughtProps {
  children: React.ReactNode;
  className?: string;
  open?: boolean;
}

export function ChainOfThought({ children, className, open = true }: ChainOfThoughtProps) {
  if (!open) return null;
  return <div className={cn("flex flex-col", className)}>{children}</div>;
}

// ------------------------------------------------------------------
// ChainOfThoughtContent - expandable content area
// ------------------------------------------------------------------

interface ChainOfThoughtContentProps {
  children: React.ReactNode;
  className?: string;
}

export function ChainOfThoughtContent({ children, className }: ChainOfThoughtContentProps) {
  return <div className={cn("flex flex-col gap-1", className)}>{children}</div>;
}

// ------------------------------------------------------------------
// ChainOfThoughtStep - individual step item
// ------------------------------------------------------------------

interface ChainOfThoughtStepProps {
  label: React.ReactNode;
  icon?: React.ElementType | React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function ChainOfThoughtStep({
  label,
  icon: Icon,
  children,
  className,
  onClick,
}: ChainOfThoughtStepProps) {
  const iconElement =
    typeof Icon === "function" ? (
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
    ) : (
      Icon
    );

  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-md px-2 py-1.5 transition-colors",
        onClick && "cursor-pointer hover:bg-accent/50",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        {iconElement && <span className="flex shrink-0">{iconElement}</span>}
        <span className="flex-1 text-sm text-foreground/90">{label}</span>
      </div>
      {children && <div className="mt-1 pl-6">{children}</div>}
    </div>
  );
}

// ------------------------------------------------------------------
// ChainOfThoughtSearchResults - container for search results
// ------------------------------------------------------------------

interface ChainOfThoughtSearchResultsProps {
  children: React.ReactNode;
  className?: string;
}

export function ChainOfThoughtSearchResults({
  children,
  className,
}: ChainOfThoughtSearchResultsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {children}
    </div>
  );
}

// ------------------------------------------------------------------
// ChainOfThoughtSearchResult - individual search result
// ------------------------------------------------------------------

interface ChainOfThoughtSearchResultProps {
  children: React.ReactNode;
  className?: string;
}

export function ChainOfThoughtSearchResult({
  children,
  className,
}: ChainOfThoughtSearchResultProps) {
  return (
    <div
      className={cn(
        "rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-accent/30",
        className
      )}
    >
      {children}
    </div>
  );
}

// ------------------------------------------------------------------
// ToolIcon - get icon for tool name
// ------------------------------------------------------------------

const toolIconMap: Record<string, React.ElementType> = {
  web_search: Search,
  image_search: Search,
  web_fetch: Globe,
  ls: FolderOpen,
  read_file: FileText,
  write_file: FileText,
  str_replace: FileText,
  bash: Terminal,
  default: Wrench,
};

export function getToolIcon(toolName: string): React.ElementType {
  return toolIconMap[toolName] || toolIconMap.default;
}

// ------------------------------------------------------------------
// ToolCallStep - tool call with expand/collapse
// ------------------------------------------------------------------

interface ToolCallStepProps {
  toolName: string;
  description?: string;
  args?: Record<string, unknown>;
  result?: unknown;
  isLoading?: boolean;
  className?: string;
}

export function ToolCallStep({
  toolName,
  description,
  args,
  result,
  isLoading,
  className,
}: ToolCallStepProps) {
  const Icon = getToolIcon(toolName);
  const [showDetails, setShowDetails] = useState(false);

  // Get display label
  const getLabel = (): string => {
    if (description) return description;

    switch (toolName) {
      case "web_search":
        return args?.query ? `搜索 "${String(args.query)}"` : "搜索相关信息";
      case "image_search":
        return args?.query ? `搜索图片 "${String(args.query)}"` : "搜索相关图片";
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
        return args?.description ? String(args.description) : "执行命令";
      default:
        return `使用 "${toolName}" 工具`;
    }
  };

  // Get path or command display
  const getMetaDisplay = () => {
    if (args?.path) return String(args.path);
    if (args?.url) return String(args.url);
    if (args?.command) return String(args.command);
    return null;
  };

  const meta = getMetaDisplay();

  return (
    <div className={cn("rounded-lg border border-border/60 bg-muted/30", className)}>
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-accent/30"
      >
        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="flex-1 text-sm text-foreground/90">{getLabel()}</span>
        {isLoading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground" />
        )}
        <ChevronUp
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
            showDetails ? "rotate-180" : ""
          )}
        />
      </button>

      {showDetails && (
        <div className="border-t border-border/60 px-3 py-2">
          {meta && (
            <div className="mb-2 rounded bg-background/50 px-2 py-1.5 text-xs font-mono text-muted-foreground">
              {meta}
            </div>
          )}
          {args && (
            <div className="mb-2">
              <div className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">参数</div>
              <pre className="max-h-32 overflow-auto rounded bg-background/50 p-2 text-xs text-muted-foreground">
                {JSON.stringify(args, null, 2)}
              </pre>
            </div>
          )}
          {result !== undefined && (
            <div>
              <div className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">结果</div>
              <pre className="max-h-48 overflow-auto rounded bg-background/50 p-2 text-xs text-muted-foreground">
                {typeof result === "string" ? result : JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------------
// StepsToggle - expand/collapse multiple steps
// ------------------------------------------------------------------

interface StepsToggleProps {
  count: number;
  expanded: boolean;
  onToggle: () => void;
  className?: string;
}

export function StepsToggle({ count, expanded, onToggle, className }: StepsToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "flex w-full items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-left hover:bg-accent/30",
        className
      )}
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
// ReasoningBlock - thinking/reasoning content
// ------------------------------------------------------------------

interface ReasoningBlockProps {
  content: string;
  className?: string;
}

export function ReasoningBlock({ content, className }: ReasoningBlockProps) {
  const [expanded, setExpanded] = useState(true);

  // Clean up think tags
  const cleanContent = content
    .replace(/<think>/g, "")
    .replace(/<\/think>/g, "")
    .trim();

  return (
    <div className={cn("rounded-lg border border-border/60 bg-muted/30", className)}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-accent/30"
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
          <div className="text-sm leading-relaxed text-muted-foreground">{cleanContent}</div>
        </div>
      )}
    </div>
  );
}
