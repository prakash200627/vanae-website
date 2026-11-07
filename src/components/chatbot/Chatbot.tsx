"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { MessageCircle, Send, X } from "lucide-react";
import {
  createChatMessage,
  demoSuggestedQuestions,
  demoWelcomeMessage,
  getChatProvider,
  type ChatMessage,
} from "@/lib/chatbot";
import { prefersReducedMotion } from "@/lib/motion";

interface ChatbotProps {
  /** Hide launcher while enquiry modal is open (avoids stacked overlays). */
  isEnquiryOpen?: boolean;
  /** Shared Concierge open state (lifted from page). */
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NEAR_BOTTOM_PX = 72;

/**
 * Frontend-only Vanae Concierge (demo) — bottom-right contact dock sibling.
 * Panel is viewport-constrained flex column; only the conversation pane scrolls.
 */
export default function Chatbot({
  isEnquiryOpen = false,
  open,
  onOpenChange,
}: ChatbotProps) {
  const provider = useRef(getChatProvider()).current;
  const titleId = useId();
  const panelId = useId();
  const inputId = useId();

  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    createChatMessage("assistant", demoWelcomeMessage),
  ]);
  const [suggestionsVisible, setSuggestionsVisible] = useState(true);
  const [entered, setEntered] = useState(false);
  const [viewportBottomInset, setViewportBottomInset] = useState(0);
  const [isWide, setIsWide] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const submittingRef = useRef(false);
  const messagesRef = useRef(messages);
  const stickToBottomRef = useRef(true);
  messagesRef.current = messages;

  const isNearBottom = useCallback(() => {
    const el = listRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight <= NEAR_BOTTOM_PX;
  }, []);

  const scrollToBottom = useCallback((force = false) => {
    const el = listRef.current;
    if (!el) return;
    if (!force && !stickToBottomRef.current) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, []);

  const onConversationScroll = useCallback(() => {
    stickToBottomRef.current = isNearBottom();
  }, [isNearBottom]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(min-width: 640px)");
    const syncWide = () => setIsWide(mq.matches);
    syncWide();
    mq.addEventListener("change", syncWide);

    const vv = window.visualViewport;
    const syncInset = () => {
      if (!vv) {
        setViewportBottomInset(0);
        return;
      }
      const inset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setViewportBottomInset(inset);
    };
    syncInset();
    vv?.addEventListener("resize", syncInset);
    vv?.addEventListener("scroll", syncInset);

    return () => {
      mq.removeEventListener("change", syncWide);
      vv?.removeEventListener("resize", syncInset);
      vv?.removeEventListener("scroll", syncInset);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      setEntered(false);
      stickToBottomRef.current = true;
      return;
    }
    scrollToBottom(true);
    const t = window.setTimeout(() => setEntered(true), 16);
    return () => window.clearTimeout(t);
  }, [open, scrollToBottom]);

  useEffect(() => {
    if (!open) return;
    scrollToBottom(false);
  }, [messages, busy, open, scrollToBottom]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 40);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const launcher = launcherRef.current;
    return () => {
      window.setTimeout(() => launcher?.focus(), 0);
    };
  }, [open]);

  const sendText = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || submittingRef.current) return;

      submittingRef.current = true;
      setBusy(true);
      setSuggestionsVisible(false);
      setInput("");

      const userMessage = createChatMessage("user", text);
      const transcript = [...messagesRef.current, userMessage];
      messagesRef.current = transcript;
      setMessages(transcript);
      // Show the just-sent message; if the user scrolls up while waiting,
      // onConversationScroll clears stick-to-bottom so the reply won't yank them.
      stickToBottomRef.current = true;
      requestAnimationFrame(() => scrollToBottom(true));

      try {
        const { message } = await provider.complete({ messages: transcript });
        setMessages((prev) => {
          const next = [...prev, message];
          messagesRef.current = next;
          return next;
        });
      } catch {
        setMessages((prev) => {
          const next = [
            ...prev,
            createChatMessage(
              "assistant",
              "Something went wrong on my side. Please try again, or use the Enquire button for personal assistance."
            ),
          ];
          messagesRef.current = next;
          return next;
        });
      } finally {
        setBusy(false);
        submittingRef.current = false;
        inputRef.current?.focus();
      }
    },
    [provider, scrollToBottom]
  );

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void sendText(input);
  };

  const onInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendText(input);
    }
  };

  if (isEnquiryOpen) {
    return null;
  }

  const reduce = prefersReducedMotion();
  // Closed: clear Enquire + WhatsApp. Open: only Concierge launcher remains.
  const dockClearance = open
    ? isWide
      ? 5.75
      : 5.25
    : isWide
      ? 14.5
      : 12.75;
  // Explicit height (not max-height alone) so flex children can shrink and scroll.
  const panelHeight = `min(56dvh, calc(100dvh - ${dockClearance}rem - 1.25rem - ${viewportBottomInset}px), 30rem)`;
  const panelStyle: CSSProperties = {
    bottom: `calc(${dockClearance}rem + ${viewportBottomInset}px)`,
    height: panelHeight,
    maxHeight: panelHeight,
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  };
  // flex-basis 0 is required so the transcript is constrained by the panel,
  // not by message content height (classic nested flex scroll fix).
  const conversationStyle: CSSProperties = {
    flex: "1 1 0%",
    minHeight: 0,
    overflowY: "auto",
    overflowX: "hidden",
    overscrollBehaviorY: "contain",
    WebkitOverflowScrolling: "touch",
  };

  const launcherBottomClass = open
    ? "bottom-5 sm:bottom-7"
    : "bottom-[8.75rem] sm:bottom-[10rem]";

  return (
    <div className="contents" aria-live="off">
      {open ? (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          data-lenis-prevent
          data-lenis-prevent-wheel
          className={`pointer-events-auto fixed z-40 flex w-[calc(100vw-1.5rem)] max-w-[26rem] flex-col overflow-hidden rounded-2xl border border-gold/40 bg-ivory-soft text-ink shadow-[0_28px_64px_rgba(10,26,21,0.42)] right-3 sm:right-5 motion-reduce:transition-none ${
            reduce
              ? "opacity-100"
              : entered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
          } motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out`}
          style={panelStyle}
        >
          <header className="relative z-[1] flex flex-none shrink-0 items-start justify-between gap-3 bg-forest px-5 py-4 sm:px-6 sm:py-5 text-ivory">
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/80 to-transparent"
              aria-hidden="true"
            />
            <div className="relative min-w-0 pr-2">
              <p
                id={titleId}
                className="font-serif text-2xl tracking-tight text-ivory leading-snug"
              >
                Vanae Concierge
              </p>
              <p className="mt-1.5 inline-flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.24em] text-gold">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full bg-gold"
                  aria-hidden="true"
                />
                Demo Assistant
              </p>
            </div>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label="Close chat"
              className="relative -mr-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ivory/25 text-ivory hover:border-gold hover:text-gold transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </header>

          {/*
            Root cause of prior “scroll broken” reports: Lenis smoothWheel
            captured wheel events for the page. data-lenis-prevent* below
            hands wheel/touch back to this native overflow container.
          */}
          <div
            ref={listRef}
            data-chatbot-conversation
            data-lenis-prevent
            data-lenis-prevent-wheel
            onScroll={onConversationScroll}
            className="bg-ivory-soft px-4 py-5 sm:px-6 sm:py-6 space-y-4 [overflow-anchor:none] touch-pan-y"
            role="log"
            aria-live="polite"
            aria-relevant="additions"
            style={conversationStyle}
          >
            {messages.map((message) => {
              const isUser = message.role === "user";
              return (
                <div
                  key={message.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[90%] break-words rounded-2xl px-4 py-3 text-[13px] sm:text-sm leading-[1.65] font-sans whitespace-pre-wrap ${
                      isUser
                        ? "rounded-br-md bg-forest text-ivory shadow-[0_6px_18px_rgba(13,90,70,0.2)]"
                        : "rounded-bl-md border border-ivory-border bg-ivory text-charcoal shadow-[0_4px_14px_rgba(10,26,21,0.05)]"
                    }`}
                  >
                    {!isUser ? (
                      <span className="sr-only">Assistant: </span>
                    ) : (
                      <span className="sr-only">You: </span>
                    )}
                    {message.content}
                  </div>
                </div>
              );
            })}

            {busy ? (
              <div className="flex justify-start" role="status" aria-live="polite">
                <div
                  className="inline-flex items-center gap-2 rounded-2xl rounded-bl-md border border-ivory-border bg-ivory px-4 py-3"
                  aria-hidden="true"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse motion-reduce:animate-none" />
                  <span className="h-1.5 w-1.5 rounded-full bg-forest/70 animate-pulse motion-reduce:animate-none [animation-delay:120ms]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-forest/40 animate-pulse motion-reduce:animate-none [animation-delay:240ms]" />
                </div>
                <span className="sr-only">Assistant is typing</span>
              </div>
            ) : null}

            {suggestionsVisible && messages.length <= 1 ? (
              <div className="pt-1">
                <p className="mb-3 font-sans text-[10px] uppercase tracking-[0.22em] text-stone">
                  Explore
                </p>
                <ul className="flex flex-wrap gap-2 list-none m-0 p-0">
                  {demoSuggestedQuestions.map((question) => (
                    <li key={question}>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void sendText(question)}
                        className="rounded-full border border-gold/40 bg-ivory px-3.5 py-2 text-left font-sans text-[11px] leading-snug text-forest-deep hover:border-gold hover:bg-gold/10 transition-colors motion-reduce:transition-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                      >
                        {question}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <form
            onSubmit={onSubmit}
            className="flex-none shrink-0 border-t border-ivory-border bg-ivory px-4 py-3.5 sm:px-5 sm:py-4 flex items-center gap-2.5"
          >
            <label htmlFor={inputId} className="sr-only">
              Message Vanae Concierge
            </label>
            <input
              ref={inputRef}
              id={inputId}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={onInputKeyDown}
              disabled={busy}
              autoComplete="off"
              placeholder="Ask about Vanae…"
              className="min-h-[46px] min-w-0 flex-1 rounded-lg border border-ivory-border bg-ivory-soft px-4 py-2.5 font-sans text-sm text-ink placeholder:text-stone/70 focus:border-forest focus:outline-none focus:ring-2 focus:ring-gold/35 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send message"
              className="inline-flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-lg border border-gold bg-gold text-ink hover:bg-forest hover:text-ivory disabled:opacity-40 disabled:cursor-not-allowed transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        </div>
      ) : null}

      <div
        className={`fixed z-40 flex flex-col items-end pointer-events-none right-3 sm:right-5 transition-[bottom] duration-200 motion-reduce:transition-none ${launcherBottomClass}`}
      >
        <button
          ref={launcherRef}
          type="button"
          onClick={() => onOpenChange(!open)}
          aria-expanded={open}
          aria-controls={open ? panelId : undefined}
          aria-label={
            open ? "Close Vanae Concierge" : "Open Vanae Concierge"
          }
          className="pointer-events-auto group inline-flex items-center gap-2.5 rounded-none bg-transparent border-0 p-0 focus-visible:outline-none"
        >
          <span className="hidden sm:inline order-first font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold text-forest-deep bg-ivory rounded-full px-3.5 py-1.5 border border-ivory-border shadow-[0_4px_14px_rgba(10,26,21,0.18)] group-hover:border-gold/50">
            Concierge
          </span>
          <span className="inline-flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl border border-forest/40 bg-forest text-ivory shadow-[0_8px_24px_rgba(10,26,21,0.35)] transition-all duration-300 motion-reduce:transition-none group-hover:bg-forest-deep group-hover:border-gold/50 group-focus-visible:ring-2 group-focus-visible:ring-gold group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-ink group-active:scale-[0.97]">
            {open ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
            )}
          </span>
        </button>
      </div>
    </div>
  );
}
