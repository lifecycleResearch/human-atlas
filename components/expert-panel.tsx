'use client';

import * as React from 'react';
import { Sparkles, Bot, ArrowUpRight, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  ExpertTurn,
  expertReply,
  expertSuggest,
  type ExpertToolCall,
} from '@/app/expert';
import type { Concept } from '@/app/anatomy';

interface Props {
  atlas: Concept[];
  inspect: (concept: Concept) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SUGGESTIONS = expertSuggest();

function ToolChip({ tool }: { tool: ExpertToolCall }) {
  return (
    <Badge variant="secondary" className="mt-1 w-fit text-xs">
      <Bot size={11} className="mr-1" />
      {tool.name}()
    </Badge>
  );
}

function Msg({ turn }: { turn: ExpertTurn }) {
  const isUser = turn.role === 'user';
  return (
    <div
      data-user={isUser ? 'true' : 'false'}
      className={`flex w-full gap-2.5 ${
        isUser ? 'flex-row-reverse' : ''
      }`}
    >
      {!isUser && <Bot size={15} className="mt-1 shrink-0 text-muted-foreground" />}
      <div
        className={`w-full text-sm leading-relaxed ${
          isUser ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-sm px-3.5 py-2.5' : 'bg-muted/70 rounded-2xl rounded-bl-sm px-3.5 py-2.5'
        }`}
      >
        {turn.content.split('\n\n').map((block, i, arr) => (
          <React.Fragment key={i}>
            {i > 0 && <br />}
            {block}
          </React.Fragment>
        ))}
      </div>
      {isUser && <Sparkles size={15} className="mt-1 shrink-0 text-muted-foreground" />}
    </div>
  );
}

function ToolResultChip({ turn }: { turn: ExpertTurn }) {
  if (turn.role !== 'tool' || !turn.toolCall) return null;
  return (
    <div className="ml-7 mr-2 mt-1 rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-xs text-muted-foreground">
      <div className="flex items-center gap-1.5 mb-1">
        <Lightbulb size={11} />
        <span className="font-medium uppercase tracking-wide">tool result</span>
      </div>
      <div className="text-[13px] leading-relaxed text-foreground">{turn.content}</div>
    </div>
  );
}

export function ExpertPanel({ atlas, inspect, open, onOpenChange }: Props) {
  const [history, setHistory] = React.useState<ExpertTurn[]>([]);
  const [pending, setPending] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const formRef = React.useRef<HTMLFormElement>(null);
  const scrollerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) {
      setHistory([]);
      setInputValue('');
    }
  }, [open]);

  React.useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: 'smooth' });
  }, [history]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || pending) return;
    setInputValue('');
    setPending(true);
    try {
      const next = await expertReply(history, atlas, inspect);
      setHistory(next.turns);
    } finally {
      setPending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = (e.currentTarget.elements.namedItem('q') as HTMLInputElement)?.value ?? inputValue;
    await send(text);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="sm:top-0 sm:left-0 sm:right-0 sm:bottom-auto sm:w-full sm:max-w-lg sm:border-t sm:border-l sm:border-r sm:border-b-0 sm:rounded-tl-2xl sm:rounded-tr-2xl sm:rounded-bl-2xl sm:rounded-br-2xl sm:pb-0 sm:align-start sm:max-h-[78dvh] sm:data-[side=bottom]:inset-0 sm:data-[side=bottom]:border-0">
        <SheetHeader className="sr-only">
          <SheetTitle>GREA&apos;s Anatomy — expert</SheetTitle>
          <SheetDescription>Ask about the app, the anatomy, or any control.</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-full gap-3">
          <div className="flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <Bot size={18} className="text-primary" />
              <div>
                <SheetTitle className="text-base">Expert</SheetTitle>
                <SheetDescription className="text-xs mt-0.5">
                  Free in-app explainer for GREA&apos;s Anatomy
                </SheetDescription>
              </div>
            </div>
            <a
              href="https://aed0fd62.human-atlas-temp.pages.dev"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground underline-offset-4 hover:underline"
            >
              Open web version <ArrowUpRight size={11} />
            </a>
          </div>

          <Separator />

          <ScrollArea className="flex-1 min-h-0 py-2" ref={scrollerRef}>
            {history.length === 0 && (
              <div className="flex flex-col gap-2 py-4">
                <div className="text-sm text-muted-foreground">
                  This expert is built into the app and runs locally, so it can explain the
                  viewer, the controls, and the anatomical systems without sending anything to
                  a server. Ask it anything about the app.
                </div>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      className="h-auto !py-2 text-xs"
                      onClick={() => send(s)}
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            {history.map((turn, i) => (
              <React.Fragment key={i}>
                <Msg turn={turn} />
                {turn.toolCall && <ToolChip tool={turn.toolCall} />}
                {turn.role === 'tool' && <ToolResultChip turn={turn} />}
              </React.Fragment>
            ))}
            {pending && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground px-1">
                <Sparkles size={14} className="animate-pulse" />
                Thinking…
              </div>
            )}
          </ScrollArea>

          <Separator />

          <form onSubmit={handleSubmit} className="flex gap-2 shrink-0">
            <Input
              name="q"
              className="h-11 text-sm"
              placeholder="Ask about the app or anatomy…"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              autoFocus
            />
            <Button type="submit" size="icon" className="h-11 w-11 shrink-0" disabled={pending || !inputValue.trim()}>
              <Sparkles size={16} />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
