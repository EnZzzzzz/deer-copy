"use client";

import { useMemo, useState } from "react";
import {
  ChainOfThought,
  ChainOfThoughtContent,
  StepsToggle,
  ToolCallStep,
  ReasoningBlock,
} from "@/components/ai-elements/chain-of-thought";
import { cn } from "@/lib/utils";
import { ChevronUp, Search, Globe, FolderOpen, FileText, Terminal, Lightbulb, Wrench } from "lucide-react";

// ------------------------------------------------------------------
// Types
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

interface Step {
  id: string;
  type: "reasoning" | "toolCall";
  content?: string;
  toolName?: string;
  args?: Record<string, unknown>;
  result?: unknown;
}

// ------------------------------------------------------------------
// MessageGroup Component - Main component with hidden steps
// ------------------------------------------------------------------

interface MessageGroupProps {
  messages: Message[];
  isLoading?: boolean;
  className?: string;
}

export function MessageGroup({ messages, isLoading, className }: MessageGroupProps) {
  const [showHiddenSteps, setShowHiddenSteps] = useState(false);

  const steps = useMemo(() => convertToSteps(messages), [messages]);

  // Find the last tool call step
  const lastToolCallIndex = useMemo(() => {
    for (let i = steps.length - 1; i >= 0; i--) {
      if (steps[i].type === "toolCall") return i;
    }
    return -1;
  }, [steps]);

  // Steps before the last tool call (hidden by default)
  const hiddenSteps = useMemo(() => {
    if (lastToolCallIndex > 0) {
      return steps.slice(0, lastToolCallIndex);
    }
    return [];
  }, [steps, lastToolCallIndex]);

  // The last tool call to always show
  const lastToolCall = useMemo(() => {
    if (lastToolCallIndex >= 0) {
      return steps[lastToolCallIndex];
    }
    return null;
  }, [steps, lastToolCallIndex]);

  // Find last reasoning step after last tool call
  const lastReasoning = useMemo(() => {
    if (lastToolCallIndex >= 0) {
      const afterToolCall = steps.slice(lastToolCallIndex + 1);
      for (let i = afterToolCall.length - 1; i >= 0; i--) {
        if (afterToolCall[i].type === "reasoning") return afterToolCall[i];
      }
    } else {
      // No tool calls, find last reasoning
      for (let i = steps.length - 1; i >= 0; i--) {
        if (steps[i].type === "reasoning") return steps[i];
      }
    }
    return null;
  }, [steps, lastToolCallIndex]);

  if (steps.length === 0) return null;

  return (
    <ChainOfThought className={cn("w-full gap-2", className)} open={true}>
      {/* Hidden steps toggle */}
      {hiddenSteps.length > 0 && (
        <StepsToggle
          count={hiddenSteps.length}
          expanded={showHiddenSteps}
          onToggle={() => setShowHiddenSteps(!showHiddenSteps)}
        />
      )}

      {/* Hidden steps content */}
      {showHiddenSteps && hiddenSteps.length > 0 && (
        <ChainOfThoughtContent className="gap-2">
          {hiddenSteps.map((step) =>
            step.type === "reasoning" ? (
              <ReasoningBlock key={step.id} content={step.content || ""} />
            ) : (
              <ToolCallStep
                key={step.id}
                toolName={step.toolName || "unknown"}
                args={step.args}
                result={step.result}
              />
            )
          )}
        </ChainOfThoughtContent>
      )}

      {/* Last tool call */}
      {lastToolCall && (
        <ToolCallStep
          toolName={lastToolCall.toolName || "unknown"}
          args={lastToolCall.args}
          result={lastToolCall.result}
          isLoading={isLoading}
        />
      )}

      {/* Last reasoning */}
      {lastReasoning && (
        <ReasoningBlock content={lastReasoning.content || ""} />
      )}
    </ChainOfThought>
  );
}

// ------------------------------------------------------------------
// Helper: Convert messages to steps
// ------------------------------------------------------------------

function convertToSteps(messages: Message[]): Step[] {
  const steps: Step[] = [];

  for (const message of messages) {
    if (message.role === "assistant") {
      // Extract reasoning from content
      const reasoning = extractReasoning(message.content);
      if (reasoning) {
        steps.push({
          id: `${message.id}-reasoning`,
          type: "reasoning",
          content: reasoning,
        });
      }

      // Add tool calls
      if (message.tool_calls) {
        for (const toolCall of message.tool_calls) {
          // Skip task tool calls
          if (toolCall.name === "task") continue;

          const step: Step = {
            id: toolCall.id,
            type: "toolCall",
            toolName: toolCall.name,
            args: toolCall.args,
          };

          // Find result for this tool call
          const result = findToolCallResult(toolCall.id, messages);
          if (result) {
            step.result = result;
          }

          steps.push(step);
        }
      }
    }
  }

  return steps;
}

// ------------------------------------------------------------------
// Helper: Extract reasoning content from message
// ------------------------------------------------------------------

function extractReasoning(content: string): string | null {
  const thinkMatch = content.match(/<think>([\s\S]*?)<\/think>/);
  if (thinkMatch) {
    return thinkMatch[1].trim();
  }

  // Also check for plain think blocks without tags
  if (content.includes("<think>")) {
    return content.replace(/<think>/g, "").replace(/<\/think>/g, "").trim();
  }

  return null;
}

// ------------------------------------------------------------------
// Helper: Find tool call result
// ------------------------------------------------------------------

function findToolCallResult(toolCallId: string, messages: Message[]): unknown | null {
  for (const message of messages) {
    if (message.role === "assistant" && message.tool_call_id === toolCallId) {
      try {
        return JSON.parse(message.content);
      } catch {
        return message.content;
      }
    }
  }
  return null;
}

// ------------------------------------------------------------------
// SimpleMessage - For simple text messages
// ------------------------------------------------------------------

interface SimpleMessageProps {
  content: string;
  isUser?: boolean;
  className?: string;
}

export function SimpleMessage({ content, isUser, className }: SimpleMessageProps) {
  if (isUser) {
    return (
      <div className={cn("my-4 flex justify-start", className)}>
        <div className="max-w-[90%] rounded-xl bg-muted px-4 py-2.5 text-sm leading-relaxed text-foreground">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("my-5 flex gap-3", className)}>
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-[10px] font-semibold text-background">
        D
      </div>
      <div className="min-w-0 flex-1 text-sm leading-relaxed text-foreground">
        {content}
      </div>
    </div>
  );
}
