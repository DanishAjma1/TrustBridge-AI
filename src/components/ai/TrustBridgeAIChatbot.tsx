import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { MessageSquare, X, Send, Bot, User, Minimize2, Maximize2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const TrustBridgeAIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>(() => {
    const saved = localStorage.getItem("trustbridge_chat_history");
    return saved ? JSON.parse(saved) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();
  const location = useLocation();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // Routes where chatbot should not appear.
  const normalizedPath = location.pathname.toLowerCase();
  const hiddenExactPaths = new Set([
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/account-under-review",
    "/account-rejected",
    "/account-suspended",
    "/account-blocked",
    "/verify-2fa",
    "/terms",
    "/guidelines",
    "/all-campaigns",
    "/fundraises",
  ]);
  const shouldHideChatbot =
    user?.role === "admin" ||
    hiddenExactPaths.has(normalizedPath) ||
    normalizedPath.startsWith("/campaigns/");

  useEffect(() => {
    if (!user) {
      localStorage.removeItem("trustbridge_chat_history");
      if (chatHistory.length > 0) {
        setChatHistory([]);
      }
      return;
    }

    localStorage.setItem("trustbridge_chat_history", JSON.stringify(chatHistory));
  }, [chatHistory, user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isLoading]);

  useEffect(() => {
    // Always reset widget visibility when auth identity changes.
    setIsOpen(false);
    setIsMinimized(false);
    setMessage("");
  }, [user?.userId, user?.email, user?.role]);

  if (shouldHideChatbot) {
    return null;
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = { role: "user", content: message };
    setChatHistory((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${BACKEND_URL}/ai/chat/chat`, {
        message: userMessage.content,
        history: chatHistory.slice(-6), // Send last 3 pairs for context
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (response.data.success) {
        setChatHistory((prev) => [...prev, response.data.aiMessage]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: "I'm sorry, I'm having trouble connecting right now. Please try again later." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-full shadow-2xl hover:from-white hover:to-indigo-50 hover:text-indigo-600 border-2 border-transparent hover:border-indigo-100 transition-all duration-500 z-50 flex items-center justify-center group"
      >
        <MessageSquare size={28} className="group-hover:hidden" />
        <img 
          src="/logo-192x192.png" 
          alt="TrustBridge AI" 
          className="hidden group-hover:block w-8 h-8 rounded-full animate-bounce"
        />
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-lg">1</div>
      </button>
    );
  }

  return (
    <div 
      className={`fixed right-6 bottom-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-100 transition-all duration-300 transform ${
        isMinimized ? "h-16" : "h-[500px] sm:h-[600px]"
      } flex flex-col`}
    >
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl backdrop-blur-sm flex items-center justify-center">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="font-bold text-sm">TrustBridge AI</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-[10px] opacity-80 uppercase font-black tracking-widest">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-red-500 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50"
          >
            {chatHistory.length === 0 && (
              <div className="text-center py-10 px-6">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl mx-auto flex items-center justify-center mb-4">
                  <Bot size={32} />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Welcome to TrustBridge!</h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  I'm your AI assistant. Ask me anything about investments, startups, or about our platform!
                </p>
                <div className="mt-6 grid grid-cols-1 gap-2">
                  <button 
                    onClick={() => setMessage(user?.role === "entrepreneur" ? "How can I grow my business on TrustBridge?" : "What is the best investment plan for me?")}
                    className="text-xs p-2.5 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 text-gray-600 transition-all text-left shadow-sm font-medium"
                  >
                    {user?.role === "entrepreneur" ? "📈 How can I grow my business?" : "💰 What is the best investment plan?"}
                  </button>
                  <button 
                    onClick={() => setMessage("What industries are popular right now?")}
                    className="text-xs p-2.5 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 text-gray-600 transition-all text-left shadow-sm font-medium"
                  >
                    🔍 What industries are popular right now?
                  </button>
                </div>
              </div>
            )}

            {chatHistory.map((chat, index) => (
              <div 
                key={index} 
                className={`flex ${chat.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div className={`flex gap-2.5 max-w-[85%] ${chat.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white ${
                    chat.role === "user" ? "bg-indigo-500" : "bg-purple-500"
                  }`}>
                    {chat.role === "user" ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`p-3.5 rounded-2xl text-sm shadow-sm ${
                    chat.role === "user" 
                      ? "bg-indigo-600 text-white rounded-tr-none" 
                      : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                  }`}>
                    {chat.content}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-2 mt-1">
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex-shrink-0 flex items-center justify-center text-white">
                    <Bot size={16} />
                  </div>
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 flex gap-1.5 shadow-sm">
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form 
            onSubmit={handleSendMessage}
            className="p-4 bg-white border-t border-gray-100"
          >
            <div className="relative group">
              <input
                type="text"
                placeholder="Type your question..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full pl-4 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm group-hover:bg-white"
              />
              <button
                type="submit"
                disabled={!message.trim() || isLoading}
                className="absolute right-2 top-1.5 bottom-1.5 px-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:grayscale"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-2 text-center">Powered by TrustBridge Intelligence</p>
          </form>
        </>
      )}
    </div>
  );
};
