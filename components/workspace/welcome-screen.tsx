"use client";

import {
  Paperclip,
  Zap,
  ChevronDown,
  ArrowUp,
  Sparkles,
  PenLine,
  Search,
  Bookmark,
  GraduationCap,
  Plus,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Mode = "flash" | "thinking" | "pro" | "ultra";
type Model = "MiniMax M2.7" | "GPT-4" | "Claude 3.5";

const modes: { id: Mode; label: string; icon: React.ReactNode; description: string }[] = [
  { id: "flash", label: "闪速", icon: <Zap className="h-3.5 w-3.5" />, description: "快速响应" },
  { id: "thinking", label: "思考", icon: <Zap className="h-3.5 w-3.5" />, description: "深度推理" },
  { id: "pro", label: "专业", icon: <Zap className="h-3.5 w-3.5" />, description: "全面分析" },
  { id: "ultra", label: "超级", icon: <Zap className="h-3.5 w-3.5" />, description: "最强能力" },
];

const models: Model[] = ["MiniMax M2.7", "GPT-4", "Claude 3.5"];

const suggestions = [
  { icon: Sparkles, label: "小惊喜", color: "text-amber-500" },
  { icon: PenLine, label: "写作", color: "text-blue-500" },
  { icon: Search, label: "研究", color: "text-emerald-500" },
  { icon: Bookmark, label: "收集", color: "text-purple-500" },
  { icon: GraduationCap, label: "学习", color: "text-rose-500" },
];

export function WelcomeScreen() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("flash");
  const [model, setModel] = useState<Model>("MiniMax M2.7");

  return (
    <div className="flex h-full flex-col items-center justify-center px-4">
      {/* Welcome Section */}
      <div className="mb-8 text-center">
        <h1 className="mb-3 flex items-center justify-center gap-2 text-3xl font-bold text-foreground">
          <span className="inline-block animate-bounce">👋</span>
          你好，欢迎回来！
        </h1>
        <p className="mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground">
          欢迎使用 🦌 DeerFlow，一个完全开源的超级智能体。通过内置和自定义的 Skills，
          <br />
          DeerFlow 可以帮你搜索网络、分析数据，还能为你生成幻灯片、
          <br />
          图片、视频、播客及网页等，几乎可以做任何事情。
        </p>
      </div>

      {/* Input Box */}
      <div className="w-full max-w-2xl">
        <div className="relative rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
          <Textarea
            placeholder="今天我能为你做些什么？"
            className="min-h-[120px] resize-none border-0 bg-transparent px-4 py-4 text-base placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          {/* Bottom Toolbar */}
          <div className="flex items-center justify-between px-3 pb-3">
            <div className="flex items-center gap-1">
              {/* Attachment Button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <Paperclip className="h-4 w-4" />
              </Button>

              {/* Mode Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  {modes.find((m) => m.id === mode)?.icon}
                  {modes.find((m) => m.id === mode)?.label}
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-40">
                  {modes.map((m) => (
                    <DropdownMenuItem
                      key={m.id}
                      className={cn(
                        "flex items-center gap-2 text-xs",
                        mode === m.id && "bg-accent"
                      )}
                      onClick={() => setMode(m.id)}
                    >
                      {m.icon}
                      <div className="flex flex-col">
                        <span>{m.label}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {m.description}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-2">
              {/* Model Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="inline-flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  {model}
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {models.map((m) => (
                    <DropdownMenuItem
                      key={m}
                      className={cn("text-xs", model === m && "bg-accent")}
                      onClick={() => setModel(m)}
                    >
                      {m}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Send Button */}
              <Button
                size="icon"
                className="h-8 w-8 rounded-lg bg-foreground text-background hover:bg-foreground/90"
                disabled={!input.trim()}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Suggestion Buttons */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {suggestions.map((suggestion) => (
            <Button
              key={suggestion.label}
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 rounded-full border-border bg-card px-4 text-xs font-normal text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <suggestion.icon className={cn("h-3.5 w-3.5", suggestion.color)} />
              {suggestion.label}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 rounded-full border-border bg-card px-4 text-xs font-normal text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <Plus className="h-3.5 w-3.5" />
            创建
          </Button>
        </div>
      </div>
    </div>
  );
}
