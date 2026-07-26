import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, Bot } from "lucide-react";

type Msg = { role: "user" | "bot"; text: string; streaming?: boolean };

const SYSTEM_PROMPT = `You are Spark — the friendly AI assistant for SPARK Tech AI Hub, an AI learning and networking community based in India.

About SPARK Tech AI Hub:
- Founded by Fardeen Ansari (Founder & CEO), with Shiny Dhingra (Associate Graphic Designer)
- A movement for students and professionals to learn, build and grow in the age of AI
- Community of 500+ builders
- Programs: AI Workshops (weekly), Hackathons (48-hour sprints), Bootcamps, AI Projects, Community Meetups, Startup Networking
- Past events: SnowFrost Hackathon (Jan 17, 2026) at Jamia, Spark Tech Event 2025 (professional shoot), Neo4j Aura meetup
- Hosted 40+ events, 12 hackathons, 60+ workshops, 150+ projects built, 25+ mentors
- Join via WhatsApp: https://chat.whatsapp.com/DL3S2U6W6zHJFREu11Oht0
- LinkedIn: https://www.linkedin.com/company/spark-tech-ai-hub/
- Instagram: @spark_tech_ai_hub
- Most events are free; bootcamps have a nominal fee

Personality: Be warm, enthusiastic, helpful, and concise. Use emojis sparingly. Keep replies under 3 sentences unless asked for detail. If you don't know something specific, direct to WhatsApp or LinkedIn.`;

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY as string | undefined;

async function* streamGroqReply(
  history: Msg[],
  userMsg: string
): AsyncGenerator<string> {
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.filter((m) => !m.streaming).map((m) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.text,
    })),
    { role: "user", content: userMsg }
  ];

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages,
      stream: true,
    }),
  });

  if (!response.ok || !response.body) {
    throw new Error("Failed to fetch from Groq");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    
    for (const line of lines) {
      if (line.startsWith("data: ") && line !== "data: [DONE]") {
        try {
          const data = JSON.parse(line.slice(6));
          const content = data.choices[0]?.delta?.content;
          if (content) yield content;
        } catch (e) {
          // ignore parse errors for incomplete chunks
        }
      }
    }
  }
}

// Simple fallback KB
const KB: { q: RegExp; a: string }[] = [
  { q: /event|hackathon|workshop|meetup|upcoming/i, a: "We regularly host AI workshops, hackathons and community meetups! 🚀 Check the Events section on this page or follow us on LinkedIn & Instagram for the next announcement." },
  { q: /join|community|whatsapp|register/i, a: "Join our WhatsApp community via the link in the Community section — we'd love to have you! 🤝" },
  { q: /contact|email|reach|founder|fardeen/i, a: "Reach out to our Founder Fardeen Ansari on LinkedIn, or drop into our WhatsApp community — we reply fast! ⚡" },
  { q: /what.*spark|about|who|spark/i, a: "SPARK Tech AI Hub is a community for students & professionals to grow in AI through workshops, hackathons and real projects. 500+ builders strong! 💡" },
  { q: /price|cost|fee|free/i, a: "Most community events & meetups are free! Some deep-dive bootcamps have a nominal fee — details shared per event. 🎯" },
  { q: /team|shiny|designer/i, a: "Fardeen Ansari is our Founder & CEO. Shiny Dhingra leads graphic design. We're growing fast! 🌟" },
];

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "bot", text: "Hi! I'm Spark ✨ — your AI guide to SPARK Tech AI Hub. Ask me about events, how to join, our programs, or anything else!" },
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const sendText = async (t: string) => {
    if (!t || loading) return;
    setInput("");
    setLoading(true);

    const userMsg: Msg = { role: "user", text: t };
    const botPlaceholder: Msg = { role: "bot", text: "", streaming: true };
    setMsgs((prev) => [...prev, userMsg, botPlaceholder]);

    try {
      let fullText = "";
      const historyForContext = msgs;

      for await (const chunk of streamGroqReply(historyForContext, t)) {
        fullText += chunk;
        setMsgs((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "bot", text: fullText, streaming: true };
          return copy;
        });
      }

      setMsgs((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "bot", text: fullText, streaming: false };
        return copy;
      });
    } catch {
      setMsgs((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "bot",
          text: "Sorry, I ran into an issue connecting to the AI. Please try again or reach us on WhatsApp! 🙏",
          streaming: false,
        };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  };

  const send = () => sendText(input.trim());

  return (
    <>
      {/* Toggle button - Light theme as requested */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-white text-primary shadow-lg border border-border/40 hover:bg-white/90"
        aria-label="Open chatbot"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "x" : "chat"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="glass fixed bottom-24 right-6 z-50 flex h-[520px] w-[370px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl shadow-[var(--shadow-card)]"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-border/60 bg-primary/5 p-4">
              <div className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white shadow-sm border border-border/20">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-400" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold">Spark Assistant</div>
                <div className="text-[11px] text-muted-foreground">
                  {loading ? (
                    <span className="text-primary animate-pulse">Typing…</span>
                  ) : (
                    "Online"
                  )}
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4 scroll-smooth">
              {msgs.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "bot" && (
                    <div className="mb-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white border border-border/20 shadow-sm">
                      <Bot className="h-3.5 w-3.5 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "rounded-br-sm bg-[var(--gradient-brand)] text-white"
                        : "rounded-bl-sm bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {m.text || (m.streaming && (
                      <span className="flex gap-1 items-center h-4">
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
                      </span>
                    ))}
                    {m.streaming && m.text && (
                      <span className="ml-0.5 inline-block h-3.5 w-0.5 translate-y-0.5 animate-pulse bg-current opacity-70" />
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Quick suggestions */}
            {msgs.length === 1 && (
              <div className="flex flex-wrap gap-2 px-4 pb-2">
                {["Upcoming events?", "How to join?", "What is SPARK?", "Is it free?"].map((s) => (
                  <button
                    key={s}
                    onClick={() => sendText(s)}
                    className="rounded-full border border-border/60 bg-secondary/60 px-3 py-1 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="flex items-center gap-2 border-t border-border/60 p-3">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
                placeholder="Ask about SPARK…"
                disabled={loading}
                className="flex-1 rounded-xl bg-input px-3.5 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring disabled:opacity-50"
              />
              <motion.button
                onClick={send}
                disabled={loading || !input.trim()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--gradient-brand)] text-background shadow-[var(--shadow-glow)] disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}