"use client";

import { Bot, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function AgentsPage() {
  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <header className="flex h-14 items-center justify-between border-b border-border px-6">
        <div>
          <h1 className="text-base font-semibold text-foreground">智能体</h1>
          <p className="text-xs text-muted-foreground">
            创建和管理具有专属 Prompt 与能力的自定义智能体。
          </p>
        </div>
        <Button className="h-8 gap-1.5 rounded-lg bg-foreground px-4 text-xs font-medium text-background hover:bg-foreground/90">
          <Plus className="h-3.5 w-3.5" />
          新建智能体
        </Button>
      </header>

      {/* Content - Empty State */}
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="flex flex-col items-center">
          {/* Robot Icon */}
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
            <Bot className="h-6 w-6 text-muted-foreground" />
          </div>

          {/* Title */}
          <h2 className="mb-1 text-sm font-medium text-foreground">
            还没有自定义智能体
          </h2>

          {/* Description */}
          <p className="mb-4 text-xs text-muted-foreground">
            创建你的第一个自定义智能体，设置专属系统提示词。
          </p>

          {/* Create Button */}
          <Button
            variant="outline"
            className="h-8 gap-1.5 rounded-lg border-border bg-card px-4 text-xs font-medium text-foreground hover:bg-accent"
          >
            <Plus className="h-3.5 w-3.5" />
            新建智能体
          </Button>
        </div>
      </div>
    </div>
  );
}
