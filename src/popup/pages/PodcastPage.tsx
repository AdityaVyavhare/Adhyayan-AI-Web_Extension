import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Mic2,
  Clock,
  Volume2,
  Sparkles,
  Play,
  History,
} from "lucide-react";
import { podcastAPI, formatDate } from "../../services/ChatService";

interface PodcastPageProps {
  onBack: () => void;
}

interface PodcastConfig {
  topic: string;
  duration: 5 | 10 | 15;
  voiceStyle: "conversational" | "formal" | "energetic" | "story";
  format: "solo" | "interview" | "discussion";
}

const PodcastPage: React.FC<PodcastPageProps> = ({ onBack }) => {
  const [config, setConfig] = useState<PodcastConfig>({
    topic: "",
    duration: 10,
    voiceStyle: "conversational",
    format: "solo",
  });
  const [recentPodcasts, setRecentPodcasts] = useState<
    Array<{
      topic: string;
      duration: number;
      timestamp: number;
    }>
  >([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Fetch chat history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoadingHistory(true);
        const response = await podcastAPI.getUserChats();
        if (response.chats) {
          setHistory(response.chats);
        }
      } catch (error) {
        console.error("Failed to fetch podcast history:", error);
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, []);

  const durations: Array<5 | 10 | 15> = [5, 10, 15];

  const voiceStyles: Array<{
    id: PodcastConfig["voiceStyle"];
    label: string;
    icon: React.ReactNode;
    description: string;
  }> = [
    {
      id: "conversational",
      label: "Conversational",
      icon: <Volume2 className="w-5 h-5" />,
      description: "Casual, friendly tone",
    },
    {
      id: "formal",
      label: "Formal",
      icon: <Mic2 className="w-5 h-5" />,
      description: "Professional, educational",
    },
    {
      id: "energetic",
      label: "Energetic",
      icon: <Sparkles className="w-5 h-5" />,
      description: "Dynamic, engaging",
    },
    {
      id: "story",
      label: "Storytelling",
      icon: <Play className="w-5 h-5" />,
      description: "Narrative, immersive",
    },
  ];

  const formats: Array<{
    id: PodcastConfig["format"];
    label: string;
    description: string;
  }> = [
    {
      id: "solo",
      label: "Solo Presentation",
      description: "Single narrator explaining the topic",
    },
    {
      id: "interview",
      label: "Interview Style",
      description: "Q&A format with two voices",
    },
    {
      id: "discussion",
      label: "Panel Discussion",
      description: "Multiple perspectives and viewpoints",
    },
  ];

  const handleGeneratePodcast = async () => {
    if (!config.topic.trim()) {
      alert("Please enter a topic for your podcast");
      return;
    }

    // Save to recent podcasts
    const newPodcast = {
      topic: config.topic,
      duration: config.duration,
      timestamp: Date.now(),
    };

    const updatedRecentPodcasts = [newPodcast, ...recentPodcasts].slice(0, 5);
    setRecentPodcasts(updatedRecentPodcasts);

    // Store in Chrome storage
    chrome.storage.local.set({
      recentPodcasts: updatedRecentPodcasts,
    });

    // Send message to background to open side panel
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.runtime.sendMessage({
          action: "generatePodcast",
          topic: config.topic,
          duration: config.duration,
          voiceStyle: config.voiceStyle,
          format: config.format,
        });
      }
    });

    window.close();
  };

  // Load recent podcasts on mount
  React.useEffect(() => {
    chrome.storage.local.get(["recentPodcasts"], (result) => {
      if (result.recentPodcasts) {
        setRecentPodcasts(result.recentPodcasts);
      }
    });
  }, []);

  const formatTimestamp = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
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
                Podcast Generator
              </h1>
              <p className="text-xs text-gray-500">Learn through audio</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Topic Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Podcast Topic
          </label>
          <textarea
            value={config.topic}
            onChange={(e) => setConfig({ ...config, topic: e.target.value })}
            placeholder="E.g., 'The impact of AI on education' or 'History of the Roman Empire'"
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows={3}
          />
        </div>

        {/* Duration Selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Clock className="w-4 h-4 inline mr-1" />
            Duration
          </label>
          <div className="grid grid-cols-3 gap-3">
            {durations.map((duration) => (
              <button
                key={duration}
                onClick={() => setConfig({ ...config, duration })}
                className={`p-3 rounded-lg border-2 transition-all ${
                  config.duration === duration
                    ? "border-purple-500 bg-purple-50 text-purple-700"
                    : "border-gray-200 hover:border-purple-300"
                }`}
              >
                <div className="text-2xl font-bold">{duration}</div>
                <div className="text-xs text-gray-600">minutes</div>
              </button>
            ))}
          </div>
        </div>

        {/* Voice Style */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Voice Style
          </label>
          <div className="grid grid-cols-2 gap-3">
            {voiceStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => setConfig({ ...config, voiceStyle: style.id })}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  config.voiceStyle === style.id
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 hover:border-purple-300"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {style.icon}
                  <span className="font-semibold text-sm">{style.label}</span>
                </div>
                <div className="text-xs text-gray-600">{style.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Format Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Podcast Format
          </label>
          <div className="space-y-2">
            {formats.map((format) => (
              <button
                key={format.id}
                onClick={() => setConfig({ ...config, format: format.id })}
                className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                  config.format === format.id
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 hover:border-purple-300"
                }`}
              >
                <div className="font-semibold text-sm">{format.label}</div>
                <div className="text-xs text-gray-600">
                  {format.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGeneratePodcast}
          disabled={!config.topic.trim()}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          <Mic2 className="w-5 h-5" />
          Generate Podcast
        </button>

        {/* Recent Podcasts */}
        {recentPodcasts.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Recent Podcasts
            </h3>
            <div className="space-y-2">
              {recentPodcasts.map((podcast, index) => (
                <button
                  key={index}
                  onClick={() => setConfig({ ...config, topic: podcast.topic })}
                  className="w-full p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-colors text-left"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800 truncate">
                        {podcast.topic}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {podcast.duration} min •{" "}
                        {formatTimestamp(podcast.timestamp)}
                      </div>
                    </div>
                    <Mic2 className="w-4 h-4 text-purple-400 flex-shrink-0 ml-2" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Info Card */}
        <div className="bg-gradient-to-br from-purple-100 to-blue-100 p-4 rounded-lg border border-purple-200">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-purple-900 mb-1">
                AI-Generated Audio Learning
              </div>
              <div className="text-xs text-purple-700">
                Our AI creates engaging podcasts customized to your preferences.
                Perfect for learning on the go!
              </div>
            </div>
          </div>
        </div>

        {/* Chat History */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-purple-600" />
            <h3 className="text-sm font-semibold text-gray-700">
              Podcast History
            </h3>
          </div>
          {loadingHistory ? (
            <div className="text-center py-4">
              <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : history.length > 0 ? (
            <div className="space-y-2">
              {history.map((chat, index) => (
                <div
                  key={index}
                  className="w-full flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all"
                >
                  <Mic2 className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {chat.chat_id || "Podcast Session"}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(chat.last_updated)}</span>
                      {chat.podcast_count && (
                        <>
                          <span>•</span>
                          <span>{chat.podcast_count} podcasts</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-sm text-gray-500">
              No podcast history found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PodcastPage;
