import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  MessageCircle,
  Plus,
  History,
  Trash2,
  Clock,
  Sparkles,
  Send,
} from "lucide-react";
import { useStore } from "../../store";
import {
  chatModelAPI,
  formatDate as formatHistoryDate,
} from "../../services/ChatService";

interface ChatPageProps {
  onBack: () => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ onBack }) => {
  const { chats, createNewChat, deleteChat, setCurrentChat } = useStore();
  const [recentChats, setRecentChats] = useState<
    Array<{
      id: string;
      title: string;
      preview: string;
      timestamp: number;
      messageCount: number;
    }>
  >([]);
  const [apiHistory, setApiHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    // Load recent chats from store
    const chatList = Object.values(chats)
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 10)
      .map((chat) => ({
        id: chat.id,
        title: chat.title,
        preview:
          chat.messages.length > 0
            ? chat.messages[chat.messages.length - 1].content.slice(0, 80)
            : "No messages yet",
        timestamp: chat.updatedAt,
        messageCount: chat.messages.length,
      }));

    setRecentChats(chatList);

    // Fetch API chat history
    const fetchHistory = async () => {
      try {
        setLoadingHistory(true);
        const response = await chatModelAPI.getUserChats();
        if (response.chats) {
          setApiHistory(response.chats);
        }
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, [chats]);

  const handleStartNewChat = () => {
    const newChatId = createNewChat();
    setCurrentChat(newChatId);

    // Open side panel
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.runtime.sendMessage({
          action: "openSidePanel",
          data: { chatId: newChatId },
        });
      }
    });

    window.close();
  };

  const handleContinueChat = (chatId: string) => {
    setCurrentChat(chatId);

    // Open side panel with existing chat
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.runtime.sendMessage({
          action: "openSidePanel",
          data: { chatId },
        });
      }
    });

    window.close();
  };

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this chat?")) {
      deleteChat(chatId);
    }
  };

  const formatTimestamp = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const quickActions = [
    {
      id: "homework",
      label: "Homework Help",
      icon: <Sparkles className="w-4 h-4" />,
      prompt: "I need help with my homework. Can you assist me with",
    },
    {
      id: "explain",
      label: "Explain Concept",
      icon: <MessageCircle className="w-4 h-4" />,
      prompt: "Can you explain this concept to me:",
    },
    {
      id: "practice",
      label: "Practice Questions",
      icon: <Send className="w-4 h-4" />,
      prompt: "Generate practice questions for me about",
    },
  ];

  const handleQuickAction = (prompt: string) => {
    const newChatId = createNewChat();
    setCurrentChat(newChatId);

    // Store the prompt to be picked up by side panel
    chrome.storage.local.set({ pendingQuery: prompt });

    // Open side panel
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.runtime.sendMessage({
          action: "openSidePanel",
          data: { chatId: newChatId, initialPrompt: prompt },
        });
      }
    });

    window.close();
  };

  return (
    <div className="w-[400px] h-[600px] bg-gradient-to-br from-purple-50 via-blue-50 to-orange-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <img
              src="/NEWLOGO.png"
              alt="Adhyayan AI"
              className="w-8 h-8 object-contain"
            />
            <div>
              <h1 className="text-lg font-bold text-gray-800">
                Chat Assistant
              </h1>
              <p className="text-xs text-gray-500">
                AI-powered learning assistant
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* New Chat Button */}
        <button
          onClick={handleStartNewChat}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Start New Chat
        </button>

        {/* Quick Actions */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action.prompt)}
                className="p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all text-left flex items-center gap-3"
              >
                <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                  {action.icon}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Chats */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <History className="w-4 h-4" />
            Recent Chats
            {recentChats.length > 0 && (
              <span className="text-xs text-gray-500">
                ({recentChats.length})
              </span>
            )}
          </h3>

          {recentChats.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500 mb-1">No chats yet</p>
              <p className="text-xs text-gray-400">
                Start a new conversation to begin learning
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleContinueChat(chat.id)}
                  className="bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-800 truncate group-hover:text-purple-600 transition-colors">
                          {chat.title}
                        </h4>
                        <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                          {chat.preview}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleDeleteChat(chat.id, e)}
                        className="p-1.5 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimestamp(chat.timestamp)}
                      </span>
                      <span className="text-gray-400 flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {chat.messageCount}{" "}
                        {chat.messageCount === 1 ? "message" : "messages"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-blue-900 mb-1">
                AI Learning Assistant
              </div>
              <div className="text-xs text-blue-700">
                Ask questions, get explanations, solve problems, and practice
                concepts. Your personal tutor is always ready to help!
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        {recentChats.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-purple-600">
                {recentChats.length}
              </div>
              <div className="text-xs text-gray-500">Total Chats</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">
                {recentChats.reduce((sum, chat) => sum + chat.messageCount, 0)}
              </div>
              <div className="text-xs text-gray-500">Total Messages</div>
            </div>
          </div>
        )}

        {/* API Chat History */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-700">
              API Chat History
            </h3>
          </div>
          {loadingHistory ? (
            <div className="text-center py-4">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : apiHistory.length > 0 ? (
            <div className="space-y-2">
              {apiHistory.map((chat, index) => (
                <div
                  key={index}
                  className="w-full flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <MessageCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {chat.title || chat.chat_id || "Untitled Chat"}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{formatHistoryDate(chat.updated_at)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-sm text-gray-500">
              No API chat history found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
