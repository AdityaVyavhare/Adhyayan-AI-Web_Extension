import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  BookOpen,
  Heart,
  Briefcase,
  Users,
  Brain,
  Sparkles,
  History,
  Clock,
} from "lucide-react";
import { gitaAPI, formatDate } from "../../services/ChatService";

interface GitaPageProps {
  onBack: () => void;
}

type TopicType =
  | "anxiety"
  | "career"
  | "relationships"
  | "purpose"
  | "conflict"
  | "custom";

interface Scenario {
  id: TopicType;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  prompt: string;
}

const GitaPage: React.FC<GitaPageProps> = ({ onBack }) => {
  const [selectedTopic, setSelectedTopic] = useState<TopicType | null>(null);
  const [customQuery, setCustomQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Fetch chat history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoadingHistory(true);
        const response = await gitaAPI.getUserChats();
        if (response.chats) {
          setHistory(response.chats);
        }
      } catch (error) {
        console.error("Failed to fetch Gita history:", error);
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, []);

  const scenarios: Scenario[] = [
    {
      id: "anxiety",
      label: "Stress & Anxiety",
      icon: <Heart size={20} />,
      color: "#FF6B6B",
      bgColor: "#FFF0F0",
      prompt:
        "I'm feeling anxious and stressed. What does Bhagavad Gita teach about dealing with anxiety?",
    },
    {
      id: "career",
      label: "Career Decisions",
      icon: <Briefcase size={20} />,
      color: "#4ECDC4",
      bgColor: "#E8F8F7",
      prompt:
        "I'm confused about my career path. What guidance does Gita offer for making career decisions?",
    },
    {
      id: "relationships",
      label: "Relationships",
      icon: <Users size={20} />,
      color: "#FF9F43",
      bgColor: "#FFF5E6",
      prompt:
        "I'm having difficulties in my relationships. What does Bhagavad Gita say about maintaining healthy relationships?",
    },
    {
      id: "purpose",
      label: "Life Purpose",
      icon: <Brain size={20} />,
      color: "#9B59B6",
      bgColor: "#F3E5F5",
      prompt:
        "I feel lost and don't know my life purpose. What does Gita teach about finding purpose?",
    },
    {
      id: "conflict",
      label: "Inner Conflict",
      icon: <Sparkles size={20} />,
      color: "#3498DB",
      bgColor: "#EBF4FF",
      prompt:
        "I'm experiencing inner conflict and confusion. How does Bhagavad Gita help resolve inner conflicts?",
    },
  ];

  const handleGetGuidance = async () => {
    let query = "";

    if (selectedTopic === "custom") {
      query = customQuery;
    } else if (selectedTopic) {
      const scenario = scenarios.find((s) => s.id === selectedTopic);
      query = scenario?.prompt || "";
    }

    if (!query.trim()) return;

    setIsLoading(true);

    // Save to recent queries
    chrome.storage.local.get(["recentGitaQueries"], (result) => {
      const recentQueries = result.recentGitaQueries || [];
      const newQuery = {
        topic: selectedTopic,
        query,
        timestamp: Date.now(),
      };
      const updated = [newQuery, ...recentQueries.slice(0, 4)];
      chrome.storage.local.set({ recentGitaQueries: updated });
    });

    // Send message to background to open side panel
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.runtime.sendMessage({
          action: "gitaGuidance",
          topic: selectedTopic,
          query,
        });
      }
    });

    setIsLoading(false);
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
                Gita Counselor
              </h1>
              <p className="text-xs text-gray-500">Get spiritual guidance</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Quick Scenarios */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Choose a Topic
          </label>
          <div className="grid grid-cols-2 gap-3">
            {scenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => {
                  setSelectedTopic(scenario.id);
                  setCustomQuery("");
                }}
                className={`p-4 rounded-xl border-2 transition-all text-left bg-white ${
                  selectedTopic === scenario.id
                    ? "border-orange-500 shadow-md"
                    : "border-gray-200 hover:border-orange-300 hover:shadow"
                }`}
              >
                <div
                  className="flex items-center gap-2 mb-2"
                  style={{ color: scenario.color }}
                >
                  {scenario.icon}
                  <span className="text-sm font-semibold">
                    {scenario.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Query */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Or Ask Your Own Question
          </label>
          <textarea
            value={customQuery}
            onChange={(e) => {
              setCustomQuery(e.target.value);
              if (e.target.value.trim()) {
                setSelectedTopic("custom");
              }
            }}
            placeholder="What guidance do you seek from Bhagavad Gita?"
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Sanskrit Verse Note */}
        {selectedTopic && (
          <div className="bg-gradient-to-br from-orange-100 to-amber-100 p-4 rounded-lg border border-orange-200">
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-orange-900 mb-1">
                  Divine Wisdom
                </div>
                <div className="text-xs text-orange-700">
                  Your guidance will include relevant Sanskrit verses from
                  Bhagavad Gita with their meanings.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Get Guidance Button */}
        <button
          onClick={handleGetGuidance}
          disabled={!selectedTopic || isLoading}
          className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Opening...
            </>
          ) : (
            <>
              <BookOpen className="w-5 h-5" />
              Get Guidance
            </>
          )}
        </button>

        {/* Help Text */}
        <div className="bg-gradient-to-br from-purple-100 to-blue-100 p-4 rounded-lg border border-purple-200">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-purple-900 mb-1">
                Timeless Wisdom
              </div>
              <div className="text-xs text-purple-700">
                Receive guidance from Bhagavad Gita to navigate life's
                challenges with clarity and peace.
              </div>
            </div>
          </div>
        </div>

        {/* Chat History */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-orange-600" />
            <h3 className="text-sm font-semibold text-gray-700">
              Counseling History
            </h3>
          </div>
          {loadingHistory ? (
            <div className="text-center py-4">
              <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : history.length > 0 ? (
            <div className="space-y-2">
              {history.map((chat, index) => (
                <div
                  key={index}
                  className="w-full flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all"
                >
                  <BookOpen className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {chat.chat_id || "Counseling Session"}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(chat.last_updated)}</span>
                      {chat.counseling_count && (
                        <>
                          <span>•</span>
                          <span>{chat.counseling_count} sessions</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-sm text-gray-500">
              No counseling history found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GitaPage;
