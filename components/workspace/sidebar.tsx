"use client";

import {
  Bot,
  MessageSquare,
  Plus,
  Settings,
  PanelLeft,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ChatHistory {
  id: string;
  title: string;
  isActive?: boolean;
}

const mockChatHistory: ChatHistory[] = [
  { id: "1", title: "Untitled" },
  { id: "2", title: '<think> 用户希望我加载 skill-creator' },
  { id: "3", title: '<think> 用户想要一个关于"holy shit"' },
  { id: "4", title: '<think> The user wants me to gener' },
  { id: "5", title: '<think> 用户要求我返回一个标题，只' },
];

export function Sidebar() {
  const [activeTab, setActiveTab] = useState<"chats" | "agents">("chats");
  const [isNewChatActive, setIsNewChatActive] = useState(true);

  return (
    <aside className="flex h-full w-[260px] flex-col border-r border-border bg-sidebar">
      {/* Header */}
      <div className="flex h-14 items-center justify-between px-3">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-tight text-sidebar-foreground">
            DeerFlow
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-sidebar-foreground"
        >
          <PanelLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* New Chat Button */}
      <div className="px-3 pb-2">
        <Button
          className={cn(
            "w-full justify-start gap-2 rounded-xl font-medium transition-all border",
            isNewChatActive
              ? "bg-muted text-foreground border-border hover:bg-muted/80"
              : "bg-transparent text-sidebar-foreground hover:bg-muted border-transparent"
          )}
          onClick={() => setIsNewChatActive(true)}
        >
          <Plus className="h-4 w-4" />
          新对话
        </Button>
      </div>

      {/* Navigation */}
      <div className="px-3 py-2">
        <nav className="space-y-1">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all",
              activeTab === "chats"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
            onClick={() => setActiveTab("chats")}
          >
            <MessageSquare className="h-4 w-4" />
            对话
          </Button>

          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all",
              activeTab === "agents"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
            onClick={() => setActiveTab("agents")}
          >
            <Bot className="h-4 w-4" />
            智能体
          </Button>
        </nav>
      </div>

      {/* Recent Chats Section */}
      <div className="flex-1 overflow-hidden px-3">
        <div className="mb-2 mt-4 px-3 text-xs font-medium text-muted-foreground">
          最近的对话
        </div>
        <ScrollArea className="h-[calc(100vh-280px)] sidebar-scroll">
          <div className="space-y-1 pr-2">
            {mockChatHistory.map((chat) => (
              <Button
                key={chat.id}
                variant="ghost"
                className="w-full justify-start truncate rounded-xl px-3 py-2 text-left text-sm font-normal text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                onClick={() => {
                  setIsNewChatActive(false);
                }}
              >
                <span className="truncate">{chat.title}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3">
        <Button
          variant="ghost"
          className="w-full justify-between rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>设置和更多</span>
          </div>
          <ChevronUp className="h-4 w-4" />
        </Button>
      </div>
    </aside>
  );
}
