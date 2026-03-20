import React, { useEffect, useState } from "react";
import {
  FileText,
  Youtube,
  MessageCircle,
  BookOpen,
  Mic,
  Flame,
  User,
} from "lucide-react";
import { useStore } from "../store";
import type { QuickAction } from "../types";
import PDFUploadPage from "./pages/PDFUploadPage";
import YouTubePage from "./pages/YouTubePage";
import GitaPage from "./pages/GitaPage";
import PodcastPage from "./pages/PodcastPage";
import ChatPage from "./pages/ChatPage";

type PageType = "home" | "pdf" | "youtube" | "gita" | "podcast" | "chat";

const Popup: React.FC = () => {
  const { user, settings } = useStore();
  const [currentPage, setCurrentPage] = useState<PageType>("home");

  useEffect(() => {
    // Apply theme on mount
    const root = document.documentElement;
    if (settings.theme === "auto") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      root.classList.toggle("dark", prefersDark);
    } else {
      root.classList.toggle("dark", settings.theme === "dark");
    }
  }, [settings.theme]);

  const quickActions: QuickAction[] = [
    {
      id: "pdf",
      icon: "file",
      label: "Upload PDF",
      color: "#A29BFE",
      bgColor: "#F3E5F5",
      action: () => {
        setCurrentPage("pdf");
      },
    },
    {
      id: "youtube",
      icon: "youtube",
      label: "Learn from YouTube",
      color: "#FF7675",
      bgColor: "#FFF0F0",
      action: () => {
        setCurrentPage("youtube");
      },
    },
    {
      id: "chat",
      icon: "chat",
      label: "Chat Assistant",
      color: "#4895EF",
      bgColor: "#EFF6FF",
      action: () => {
        setCurrentPage("chat");
      },
    },
    {
      id: "gita",
      icon: "book",
      label: "Gita Counselor",
      color: "#FF9933",
      bgColor: "#FFF5E6",
      action: () => {
        setCurrentPage("gita");
      },
    },
    {
      id: "podcast",
      icon: "mic",
      label: "Podcast Generator",
      color: "#9B59B6",
      bgColor: "#F3E5F5",
      action: () => {
        setCurrentPage("podcast");
      },
    },
  ];

  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      file: <FileText size={32} />,
      youtube: <Youtube size={32} />,
      chat: <MessageCircle size={32} />,
      book: <BookOpen size={32} />,
      mic: <Mic size={32} />,
    };
    return icons[iconName];
  };

  const handleBack = () => {
    setCurrentPage("home");
  };

  // Render tool pages
  if (currentPage === "pdf") {
    return <PDFUploadPage onBack={handleBack} />;
  }

  if (currentPage === "youtube") {
    return <YouTubePage onBack={handleBack} />;
  }

  if (currentPage === "gita") {
    return <GitaPage onBack={handleBack} />;
  }

  if (currentPage === "podcast") {
    return <PodcastPage onBack={handleBack} />;
  }

  if (currentPage === "chat") {
    return <ChatPage onBack={handleBack} />;
  }
  // Render home page
  return (
    <div className="w-[400px] h-[600px] bg-gradient-to-br from-purple-50 via-blue-50 to-orange-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/NEWLOGO.png"
              alt="Adhyayan AI Logo"
              className="w-8 h-8 object-contain"
            />
            <div>
              <h1 className="text-lg font-bold text-gray-800">Adhyayan AI</h1>
              <p className="text-xs text-gray-500">Doubt Clearing Assistant</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-orange-100 px-2 py-1 rounded-full">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-bold text-orange-600">
                {user?.streak || 0}
              </span>
            </div>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white shadow-md">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="User"
                  className="w-full h-full rounded-full"
                />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">
          Choose a Tool
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={action.action}
              className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-purple-400 hover:shadow-lg transition-all flex flex-col items-center justify-center gap-3 min-h-[140px] group"
            >
              <div
                className="transition-transform group-hover:scale-110"
                style={{ color: action.color }}
              >
                {getIcon(action.icon)}
              </div>
              <span
                className="text-sm font-semibold text-center"
                style={{ color: action.color }}
              >
                {action.label}
              </span>
            </button>
          ))}
        </div>

        {/* Stats Card */}
        <div className="mt-6 bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-800">
                  Learning Streak
                </div>
                <div className="text-xs text-gray-500">
                  Keep going! You're doing great
                </div>
              </div>
            </div>
            <div className="text-2xl font-bold text-orange-500">
              {user?.streak || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6">
        <button
          onClick={() => {
            chrome.runtime.openOptionsPage();
            window.close();
          }}
          className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors text-center py-2 hover:bg-white rounded-lg"
        >
          Settings & Preferences
        </button>
      </div>
    </div>
  );
};

export default Popup;
