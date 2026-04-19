"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Loader2, RotateCcw, Send, Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCgpaStore } from "@/lib/storage";
import { buildUserContext } from "@/lib/chat-context";
import { cn } from "@/lib/utils";

export const OPEN_CHAT_EVENT = "iris:open-chat";

const SUGGESTIONS = [
  "What should I focus on in the current semester?",
  "Which courses prepare me for data science roles?",
  "Given my GPA so far, what target is realistic?",
  "Explain what Regression Analysis II covers.",
];

export function ChatPanel() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { history, courseGrades } = useCgpaStore();
  const pathname = usePathname();
  const skipUserContext = pathname === "/curriculum";

  const context = useMemo(
    () =>
      skipUserContext ? undefined : buildUserContext(history, courseGrades),
    [history, courseGrades, skipUserContext],
  );

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_CHAT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, onOpen);
  }, []);

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat" }),
    [],
  );

  const { messages, sendMessage, status, setMessages, error } = useChat({
    transport,
  });

  const busy = status === "streaming" || status === "submitted";

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  function submit(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    sendMessage(
      { text: trimmed },
      context !== undefined ? { body: { context } } : undefined,
    );
    setInput("");
  }

  function reset() {
    setMessages([]);
    setInput("");
  }

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className={cn(
          "fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full",
          "border border-border bg-foreground text-background shadow-lg",
          "px-4 py-2.5 text-sm font-medium",
          "hover:opacity-90 transition-opacity",
        )}
        aria-label="Open chat assistant"
      >
        <Sparkles className="h-4 w-4" />
        <span>Ask AI</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 260 }}
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l bg-background shadow-2xl"
            >
              <header className="flex items-center justify-between border-b px-4 py-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-foreground/80" />
                  <div>
                    <div className="text-sm font-semibold">
                      Academic advisor
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Llama 3.3 70B via Groq · grounded in your curriculum
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {messages.length > 0 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={reset}
                      aria-label="New conversation"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setOpen(false)}
                    aria-label="Close chat"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </header>

              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
              >
                {messages.length === 0 && (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Ask about courses, study plans, or career paths. I know
                      your curriculum and (if saved) your GPA so far.
                    </p>
                    <div className="flex flex-col gap-2">
                      {SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => submit(s)}
                          className="rounded-lg border bg-card px-3 py-2 text-left text-sm hover:bg-accent transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((m) => (
                  <MessageBubble key={m.id} message={m} />
                ))}

                {busy && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    thinking…
                  </div>
                )}

                {error && (
                  <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                    {error.message || "Something went wrong."}
                  </div>
                )}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submit(input);
                }}
                className="border-t p-3 flex items-center gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything about your curriculum…"
                  disabled={busy}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={busy || !input.trim()}
                  aria-label="Send"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function MessageBubble({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";
  const text = message.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm whitespace-pre-wrap leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-muted text-foreground rounded-bl-md",
        )}
      >
        {text}
      </div>
    </motion.div>
  );
}
