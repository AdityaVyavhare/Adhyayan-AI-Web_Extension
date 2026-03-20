import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Paperclip,
  History,
  X,
  Plus,
  Trash2,
  Settings,
  Sun,
  Moon,
} from "lucide-react";
import { useStore } from "../store";
import api from "../utils/api";
import { generateId } from "../utils/helpers";
import ChatMessage from "../components/ChatMessage";
import ThinkingBubble from "../components/ThinkingBubble";
import type { Message } from "../types";

const SidePanel: React.FC = () => {
  const {
    user,
    settings,
    currentChatId,
    chats,
    isLoading,
    setCurrentChat,
    addMessage,
    createNewChat,
    deleteChat,
    setLoading,
    setError,
    updateSettings,
  } = useStore();

  const [inputValue, setInputValue] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentChat = currentChatId ? chats[currentChatId] : null;

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat?.messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [inputValue]);

  // Check for pending queries on mount (from context menu/tool pages)
  useEffect(() => {
    chrome.storage.local.get(
      [
        "pendingQuery",
        "pendingPDF",
        "pendingYouTube",
        "pendingGita",
        "pendingPodcast",
      ],
      (result) => {
        if (result.pendingQuery) {
          setInputValue(result.pendingQuery);
          chrome.storage.local.remove("pendingQuery");
          textareaRef.current?.focus();
        } else if (result.pendingPDF) {
          const pdf = result.pendingPDF;
          setInputValue(
            `I've uploaded a PDF file "${pdf.name}" (${(pdf.size / 1024).toFixed(1)} KB). Please analyze it and help me understand the content.`,
          );
          chrome.storage.local.remove("pendingPDF");
          textareaRef.current?.focus();
        } else if (result.pendingYouTube) {
          const yt = result.pendingYouTube;
          let prompt = `I want to learn from this YouTube video: ${yt.url}\n\n`;
          if (yt.mode === "summary") {
            prompt += "Please provide a comprehensive summary of the video.";
          } else if (yt.mode === "qa") {
            prompt += "I'd like to ask questions about this video.";
          } else if (yt.mode === "quiz") {
            prompt +=
              "Please create a quiz to test my understanding of this video.";
          }
          setInputValue(prompt);
          chrome.storage.local.remove("pendingYouTube");
          textareaRef.current?.focus();
        } else if (result.pendingGita) {
          const gita = result.pendingGita;
          setInputValue(gita.query);
          chrome.storage.local.remove("pendingGita");
          textareaRef.current?.focus();
        } else if (result.pendingPodcast) {
          const podcast = result.pendingPodcast;
          setInputValue(
            `Generate a ${podcast.duration}-minute ${podcast.format} podcast about "${podcast.topic}" in a ${podcast.voiceStyle} style. ` +
              `Please create an engaging audio script with proper pacing and structure.`,
          );
          chrome.storage.local.remove("pendingPodcast");
          textareaRef.current?.focus();
        }
      },
    );
  }, []);

  // Listen for ask-question event from ChatMessage component
  useEffect(() => {
    const handleAskQuestion = (e: CustomEvent) => {
      setInputValue(e.detail.question);
      textareaRef.current?.focus();
    };

    window.addEventListener("ask-question", handleAskQuestion as EventListener);
    return () =>
      window.removeEventListener(
        "ask-question",
        handleAskQuestion as EventListener,
      );
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    if (!user) return;

    let chatId = currentChatId;

    // Create new chat if none exists
    if (!chatId) {
      chatId = createNewChat();
    }

    const chat = chats[chatId];
    if (!chat) return;

    const userMessage: Message = {
      id: generateId("msg"),
      role: "user",
      content: inputValue,
      timestamp: Date.now(),
    };

    addMessage(chatId, userMessage);
    setInputValue("");
    setLoading(true);
    setError(null);

    try {
      // Send to API
      const response = await api.sendMessage({
        user_id: user.id,
        chat_id: chat.id,
        thread_id: chat.threadId,
        prompt: inputValue,
      });

      const assistantMessage: Message = {
        id: response.working.message_id,
        role: "assistant",
        content: response.working.response,
        timestamp: Date.now(),
        links: response.working.links,
        nextQuestions: response.working.next_questions,
      };

      addMessage(chatId, assistantMessage);
    } catch (error: any) {
      console.error("Failed to send message:", error);
      const errorMessage: Message = {
        id: generateId("msg"),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: Date.now(),
        isError: true,
      };
      addMessage(chatId, errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleTheme = () => {
    const newTheme = settings.theme === "dark" ? "light" : "dark";
    updateSettings({ theme: newTheme });
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <div className="flex h-screen bg-bg-light dark:bg-bg-dark text-text-primary-light dark:text-text-primary-dark">
      {/* History Drawer */}
      {showHistory && (
        <div className="w-64 border-r border-border-light dark:border-border-dark flex flex-col">
          <div className="p-4 border-b border-border-light dark:border-border-dark flex items-center justify-between">
            <h3 className="font-semibold">Chat History</h3>
            <button
              onClick={() => setShowHistory(false)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
            {Object.values(chats)
              .sort((a, b) => b.updatedAt - a.updatedAt)
              .map((chat) => (
                <div
                  key={chat.id}
                  className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors ${
                    currentChatId === chat.id
                      ? "bg-primary/20"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => {
                    setCurrentChat(chat.id);
                    setShowHistory(false);
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium truncate flex-1">
                      {chat.title}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(chat.id);
                      }}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">
                    {new Date(chat.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
          </div>

          <button
            onClick={createNewChat}
            className="m-4 btn-primary flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            New Chat
          </button>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="p-4 border-b border-border-light dark:border-border-dark flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/NEWLOGO.png"
              alt="Adhyayan AI Logo"
              className="w-8 h-8 object-contain"
            />
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <History size={20} />
            </button>
            <div>
              <h2 className="font-bold">Sarthi - Your AI Guide</h2>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                {currentChat?.title || "Start a new conversation"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {settings.theme === "dark" ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}
            </button>
            <button
              onClick={() => chrome.runtime.openOptionsPage()}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Settings size={18} />
            </button>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
          {!currentChat || currentChat.messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
                  A
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Welcome to Adhyayan AI!
                </h3>
                <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
                  Ask me anything - from complex math problems to conceptual
                  doubts, I'm here to help you learn!
                </p>
                <div className="text-sm text-left space-y-2">
                  <p className="text-text-secondary-light dark:text-text-secondary-dark">
                    Try asking:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-text-secondary-light dark:text-text-secondary-dark">
                    <li>Explain Newton's laws of motion</li>
                    <li>Help me solve this quadratic equation</li>
                    <li>What is photosynthesis?</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <>
              {currentChat.messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <ThinkingBubble show={isLoading} />
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-border-light dark:border-border-dark p-4">
          <div className="flex items-end gap-2">
            <button
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Attach file"
            >
              <Paperclip size={20} />
            </button>

            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a doubt..."
                className="w-full px-4 py-3 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary max-h-32"
                rows={1}
              />
            </div>

            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="p-3 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
