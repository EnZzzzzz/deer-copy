"use client";

import { Search, ChevronRight } from "lucide-react";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ChatItem {
  id: string;
  title: string;
  preview: string;
  time: string;
}

const mockChats: ChatItem[] = [
  {
    id: "1",
    title: "Untitled",
    preview: "",
    time: "大约 9 小时前",
  },
  {
    id: "2",
    title: "<think> 用户希望我加载 skill-creator 技能，让我先读取这个技能文件来了解它的使用方法。</th",
    preview: "<think> 用户希望我加载 skill-creator 技能，让我先读取这个技能文件来了解它的使用方法。</think>",
    time: "大约 13 小时前",
  },
  {
    id: "3",
    title: '<think> 用户想要一个关于"holy shit"的PPT，10页，任意风格和内容。这是一个比较开放性的请求，我需要',
    preview: '<think> 用户想要一个关于"holy shit"的PPT，10页，任意风格和内容。这是一个比较开放性的请求，我需要',
    time: "大约 13 小时前",
  },
  {
    id: "4",
    title: "<think> The user wants me to generate a PowerPoint presentat",
    preview: "<think> The user wants me to generate a PowerPoint presentation about \"holy shit\" - this is an interesting...",
    time: "大约 14 小时前",
  },
  {
    id: "5",
    title: "<think> 用户要求我返回一个标题，只需要标题，不要引号，不要解释。但问题是，用户没有给出任何具体的内容或主题要",
    preview: "<think> 用户要求我返回一个标题，只需要标题，不要引号，不要解释。但问题是，用户没有给出任何具体的内容或主题要",
    time: "大约 14 小时前",
  },
];

export default function ChatPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = mockChats.filter(
    (chat) =>
      chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <header className="flex h-14 items-center justify-between border-b border-border px-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>工作区</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">对话</span>
        </div>
      </header>

      {/* Search */}
      <div className="border-b border-border px-6 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索对话"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 rounded-lg border-border bg-secondary pl-9 text-sm placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-border">
          {filteredChats.map((chat, index) => (
            <div
              key={chat.id}
              className={cn(
                "group cursor-pointer px-6 py-4 transition-colors hover:bg-accent",
                index === 0 && "bg-accent/50"
              )}
            >
              <div className="mb-1 flex items-center justify-between">
                <h3 className="text-sm font-medium text-foreground">
                  {chat.title || "Untitled"}
                </h3>
                <span className="text-xs text-muted-foreground">{chat.time}</span>
              </div>
              {chat.preview && (
                <p className="line-clamp-1 text-xs text-muted-foreground">
                  {chat.preview}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
