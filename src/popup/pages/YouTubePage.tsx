import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Youtube,
  Play,
  CheckCircle,
  Sparkles,
  History,
  Clock,
} from "lucide-react";
import { youtubeAPI, formatDate } from "../../services/ChatService";

interface YouTubePageProps {
  onBack: () => void;
}

type LearningMode = "summary" | "qa" | "quiz";

const YouTubePage: React.FC<YouTubePageProps> = ({ onBack }) => {
  const [url, setUrl] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [selectedMode, setSelectedMode] = useState<LearningMode>("summary");
  const [isLoading, setIsLoading] = useState(false);
  const [autoDetected, setAutoDetected] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Auto-detect YouTube URL on mount
  useEffect(() => {
    const detectYouTubeTab = async () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (
          tab?.url &&
          (tab.url.includes("youtube.com") || tab.url.includes("youtu.be"))
        ) {
          setUrl(tab.url);
          setAutoDetected(true);
          const id = extractVideoId(tab.url);
          if (id) {
            setVideoId(id);
            setIsValidUrl(true);
          }
        }
      });
    };
    detectYouTubeTab();

    // Fetch chat history
    const fetchHistory = async () => {
      try {
        setLoadingHistory(true);
        const response = await youtubeAPI.getUserChats();
        if (response.chats) {
          setHistory(response.chats);
        }
      } catch (error) {
        console.error("Failed to fetch YouTube history:", error);
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, []);

  const extractVideoId = (urlString: string): string | null => {
    try {
      const urlObj = new URL(urlString);
      // youtube.com/watch?v=VIDEO_ID
      if (urlObj.hostname.includes("youtube.com")) {
        return urlObj.searchParams.get("v");
      }
      // youtu.be/VIDEO_ID
      if (urlObj.hostname === "youtu.be") {
        return urlObj.pathname.slice(1);
      }
    } catch {
      return null;
    }
    return null;
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    setAutoDetected(false);
    const id = extractVideoId(value);
    if (id) {
      setVideoId(id);
      setIsValidUrl(true);
    } else {
      setVideoId(null);
      setIsValidUrl(false);
    }
  };

  const handleStartLearning = async () => {
    if (!isValidUrl || !videoId) return;

    setIsLoading(true);

    // Save to recent videos
    chrome.storage.local.get(["recentVideos"], (result) => {
      const recentVideos = result.recentVideos || [];
      const newVideo = {
        url,
        videoId,
        mode: selectedMode,
        timestamp: Date.now(),
      };
      const updated = [newVideo, ...recentVideos.slice(0, 4)];
      chrome.storage.local.set({ recentVideos: updated });
    });

    // Send message to background to open side panel
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.runtime.sendMessage({
          action: "youtubeLearn",
          url,
          videoId,
          mode: selectedMode,
        });
      }
    });

    setIsLoading(false);
    window.close();
  };

  const learningModes = [
    {
      id: "summary" as LearningMode,
      label: "Summary",
      description: "Get key points and overview",
      icon: "📝",
    },
    {
      id: "qa" as LearningMode,
      label: "Q&A",
      description: "Ask questions about the video",
      icon: "💬",
    },
    {
      id: "quiz" as LearningMode,
      label: "Quiz",
      description: "Test your understanding",
      icon: "🎯",
    },
  ];

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
                YouTube Learning
              </h1>
              <p className="text-xs text-gray-500">Learn from videos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* URL Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Video URL
          </label>
          <div className="relative">
            <input
              type="text"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="Paste YouTube URL here..."
              className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            {isValidUrl && (
              <CheckCircle className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
            )}
          </div>
          {autoDetected && (
            <p className="text-xs text-green-600 flex items-center gap-1 mt-2 bg-green-50 px-2 py-1 rounded inline-flex">
              <Sparkles className="w-3 h-3" />
              Auto-detected from current tab
            </p>
          )}
        </div>

        {/* Video Preview */}
        {videoId && (
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="aspect-video bg-gray-100 relative">
              <img
                src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                alt="Video thumbnail"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <Play className="w-16 h-16 text-white opacity-90" />
              </div>
            </div>
          </div>
        )}

        {/* Learning Mode Selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Learning Mode
          </label>
          <div className="grid grid-cols-3 gap-3">
            {learningModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={`p-4 rounded-xl border-2 transition-all bg-white ${
                  selectedMode === mode.id
                    ? "border-red-500 shadow-md"
                    : "border-gray-200 hover:border-red-300 hover:shadow"
                }`}
              >
                <div className="text-3xl mb-2">{mode.icon}</div>
                <div className="text-sm font-semibold text-gray-800">
                  {mode.label}
                </div>
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-3">
            {learningModes.find((m) => m.id === selectedMode)?.description}
          </p>
        </div>

        {/* Start Learning Button */}
        <button
          onClick={handleStartLearning}
          disabled={!isValidUrl || isLoading}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Youtube className="w-5 h-5" />
              Start Learning
            </>
          )}
        </button>

        {/* Help Text */}
        <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-blue-900 mb-1">
                Smart Detection
              </div>
              <div className="text-xs text-blue-700">
                Open any YouTube video and click this tool to automatically
                detect the URL!
              </div>
            </div>
          </div>
        </div>

        {/* Chat History */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-red-600" />
            <h3 className="text-sm font-semibold text-gray-700">
              YouTube Chat History
            </h3>
          </div>
          {loadingHistory ? (
            <div className="text-center py-4">
              <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : history.length > 0 ? (
            <div className="space-y-2">
              {history.map((chat, index) => (
                <div
                  key={index}
                  className="w-full flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-red-300 hover:shadow-md transition-all"
                >
                  <Youtube className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {chat.title || chat.chat_id || "Untitled Video"}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>
                        {formatDate(chat.last_updated || chat.updated_at)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-sm text-gray-500">
              No YouTube chat history found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default YouTubePage;
