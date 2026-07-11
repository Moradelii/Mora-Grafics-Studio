import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Bot, Sparkles, User, UserCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

interface CesarChatbotProps {
  lang: string;
}

export default function CesarChatbot({ lang }: CesarChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeRole, setActiveRole] = useState<"cesar" | "seo" | "conversion">("cesar");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const t = {
    es: {
      welcome: "¡Hola! Soy **César Moradel**, director de **Mora-Grafic's Studio**. Bienvenido a nuestro espacio de innovación. ¿En qué puedo ayudarte a redefinir y digitalizar tu negocio hoy?",
      placeholder: "Pregunta sobre diseño, presupuestos, SEO de IA...",
      processing: "Procesando respuesta creativa...",
      error: "**[Error de Conexión]** No pudimos conectarnos al motor de inteligencia artificial. Inténtalo de nuevo.",
      title: "Asesor Inteligente Mora-Grafic's",
      switchMsg: (name: string, label: string) => `Has cambiado al asesor **${name}** (${label}).`,
    },
    en: {
      welcome: "Hello! I am **César Moradel**, director of **Mora-Grafic's Studio**. Welcome to our creative space. How can I help you redefine and scale your brand identity today?",
      placeholder: "Ask about design, budgets, branding, flyers...",
      processing: "Processing creative response...",
      error: "**[Connection Error]** Could not connect to the AI engine. Please try again.",
      title: "Mora-Grafic's Intelligent Advisor",
      switchMsg: (name: string, label: string) => `You switched to advisor **${name}** (${label}).`,
    }
  };

  const currentT = lang === "es" ? t.es : t.en;

  const roles = {
    cesar: {
      name: "César Moradel",
      label: lang === "es" ? "Director Creativo" : "Creative Director",
      desc: lang === "es" ? "Especialista en arte visual y branding de lujo" : "Specialist in visual arts and luxury brand identity",
      avatarBg: "from-blue-500 to-indigo-700"
    },
    seo: {
      name: lang === "es" ? "Asistente Técnico AEO/SEO" : "AEO/SEO Assistant",
      label: lang === "es" ? "Arquitecto de Autoridad" : "Authority Architect",
      desc: lang === "es" ? "Optimización para buscadores de IA, Google y metadatos" : "Optimization for AI search engines, Google, and rich metadata",
      avatarBg: "from-emerald-500 to-emerald-700"
    },
    conversion: {
      name: lang === "es" ? "Asesor de Conversión" : "Sales Advisor",
      label: lang === "es" ? "Estratega Comercial" : "Business Strategist",
      desc: lang === "es" ? "Optimización de embudos, Lighthouse y CRM inteligente" : "Funnel optimizations, Lighthouse speed, and strategic growth",
      avatarBg: "from-cyan-500 to-blue-700"
    }
  };

  // Set reactive welcome message when language changes
  useEffect(() => {
    setMessages([
      {
        sender: "bot",
        text: currentT.welcome,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);
  }, [lang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsgText = input.trim();
    setInput("");

    const newMsg: Message = {
      sender: "user",
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, newMsg]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsgText,
          role: activeRole,
          history: messages.map((m) => ({
            role: m.sender === "user" ? "user" : "model",
            parts: [{ text: m.text }]
          }))
        })
      });

      const data = await response.json();
      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: data.reply || (lang === "es" ? "Disculpa, no obtuve respuesta." : "Apologies, I obtained no response."),
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          }
        ]);
      } else {
        throw new Error(data.error || "Server Error");
      }
    } catch (error: any) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `${currentT.error} \n\n*${error.message}*`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20 hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        title={currentT.title}
        id="chatbot-trigger-btn"
      >
        <MessageSquare className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
        </span>
      </button>

      {/* Floating Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-6 right-6 z-50 flex h-[600px] w-[400px] max-w-[calc(100vw-32px)] flex-col rounded-2xl liquid-glass overflow-hidden shadow-2xl border border-white/10"
            id="chatbot-container"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-neutral-900 to-blue-950 p-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-full bg-gradient-to-tr ${roles[activeRole].avatarBg} flex items-center justify-center text-white font-semibold shadow-inner`}>
                  {activeRole === "cesar" ? <UserCheck className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
                    {roles[activeRole].name}
                    <Sparkles className="h-3 w-3 text-blue-400" />
                  </h4>
                  <span className="text-[11px] text-blue-300 font-mono tracking-wider uppercase">
                    {roles[activeRole].label}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
                id="chatbot-close-btn"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Role Selectors */}
            <div className="bg-neutral-950/60 p-2 flex gap-1 border-b border-white/5 overflow-x-auto no-scrollbar">
              {Object.entries(roles).map(([key, r]) => (
                <button
                  key={key}
                  onClick={() => {
                    setActiveRole(key as any);
                    setMessages((prev) => [
                      ...prev,
                      {
                        sender: "bot",
                        text: `${currentT.switchMsg(r.name, r.label)} \n\n*${r.desc}*`,
                        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                      }
                    ]);
                  }}
                  className={`px-3 py-1 text-[11px] font-medium rounded-lg transition-all shrink-0 ${
                    activeRole === key
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : "bg-white/5 text-neutral-400 hover:text-white border border-transparent"
                  }`}
                >
                  {r.name.split(" ")[0]}
                </button>
              ))}
            </div>

            {/* Chat History Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-900/40">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-lg ${
                      msg.sender === "user"
                        ? "bg-gradient-to-tr from-blue-600 to-blue-800 text-white rounded-br-none border border-blue-500/20"
                        : "bg-neutral-900/95 text-neutral-200 rounded-bl-none border border-white/5"
                    }`}
                  >
                    <div className="space-y-1 select-text">
                      {msg.text.split("\n\n").map((para, pIdx) => (
                        <p key={pIdx}>
                          {para.split("**").map((text, tIdx) => {
                            if (tIdx % 2 === 1) {
                              return <strong key={tIdx} className="text-blue-300 font-semibold">{text}</strong>;
                            }
                            return text;
                          })}
                        </p>
                      ))}
                    </div>
                    <span className="block mt-1.5 text-[9px] text-right text-neutral-400/80">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-neutral-900/95 text-neutral-400 rounded-2xl p-3.5 text-xs rounded-bl-none border border-white/5 shadow-lg flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                    <span className="italic">{currentT.processing}</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 bg-neutral-950/80 border-t border-white/10 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={currentT.placeholder}
                className="flex-1 bg-neutral-900 text-white placeholder-neutral-500 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                id="chatbot-input-field"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-800 disabled:text-neutral-600 text-white p-2.5 rounded-xl transition-colors shrink-0"
                id="chatbot-submit-btn"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
