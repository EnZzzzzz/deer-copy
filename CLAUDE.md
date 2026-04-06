# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DeerFlow (鹿流) is an AI agent interface built with Next.js. It's a Chinese-language web application for interacting with AI agents that can search the web, analyze data, and generate content like slideshows, images, videos, podcasts, and web pages.

## Tech Stack

- **Framework**: Next.js 16.2.2 with App Router
- **React**: 19.2.4
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 (CSS-based configuration)
- **UI Components**: shadcn/ui with "base-nova" style
- **Icons**: Lucide React
- **Package Manager**: npm

## Development Commands

```bash
# Start development server (runs on localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint
```

## Project Structure

### App Router Structure

- `app/layout.tsx` - Root layout with Geist font and metadata
- `app/(main)/layout.tsx` - Main layout with sidebar wrapper
- `app/(main)/page.tsx` - Welcome screen (default route)
- `app/(main)/chat/page.tsx` - Chat list page
- `app/(main)/chat/[id]/page.tsx` - Individual chat detail
- `app/(main)/agents/page.tsx` - Agent management page

### Component Organization

- `components/ui/` - shadcn/ui components (button, input, dialog, etc.)
- `components/workspace/` - App-specific layout components
  - `sidebar.tsx` - Navigation sidebar with chat history
  - `welcome-screen.tsx` - Landing page with input interface
  - `messages/` - Message display components
- `components/ai-elements/` - AI-specific UI patterns
  - `chain-of-thought.tsx` - Thinking/reasoning display, tool calls, search results

### Utilities

- `lib/utils.ts` - `cn()` utility for Tailwind class merging

## Styling System

### Tailwind CSS v4 Configuration

This project uses Tailwind CSS v4 with CSS-based configuration (no `tailwind.config.js`). Configuration is in:

- `app/globals.css` - Theme variables, custom properties, and `@theme inline` block
- `postcss.config.mjs` - PostCSS with `@tailwindcss/postcss` plugin

### Theme Variables

The app uses a stone/cream color palette defined in CSS variables:

```css
:root {
  --background: #faf8f5;    /* Cream background */
  --foreground: #1c1917;     /* Dark text */
  --primary: #1c1917;
  --secondary: #f5f5f4;
  --border: #e7e5e4;
  --radius: 0.75rem;
  /* ... see globals.css for full palette */
}
```

### Shadcn/ui Configuration

Configured in `components.json`:
- Style: "base-nova"
- Aliases: `@/components`, `@/lib/utils`, `@/components/ui`
- Icon library: lucide

## Component Patterns

### AI UI Components (`chain-of-thought.tsx`)

The project has a sophisticated component library for displaying AI interactions:

- `ChainOfThought` - Container for AI reasoning steps
- `ChainOfThoughtStep` - Individual step with icon and label
- `ToolCallStep` - Expandable tool call display with args/result
- `ReasoningBlock` - Collapsible thinking content (strips `<think>` tags)
- `StepsToggle` - Show/hide multiple steps

Tool icons are automatically mapped via `getToolIcon()`:
- `web_search`, `image_search` → Search icon
- `web_fetch` → Globe icon
- `ls` → FolderOpen icon
- `read_file`, `write_file`, `str_replace` → FileText icon
- `bash` → Terminal icon

## Important Notes

- This is a Chinese-language interface (zh-CN) - use Chinese for user-facing text
- The app uses mock data currently (see `mockChats` and `mockChatHistory`)
- Route group `(main)` wraps all pages with the sidebar layout
- Dark mode is configured via CSS variables but the app primarily uses light theme
