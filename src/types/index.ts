// Message types
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  links?: string[];
  nextQuestions?: string[];
  isError?: boolean;
}

// Chat types
export interface Chat {
  id: string;
  threadId: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
}

// User types
export interface User {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
  streak: number;
  createdAt: number;
}

// Settings types
export type Theme = "light" | "dark" | "auto";
export type Language = "en" | "hi";

export interface Settings {
  theme: Theme;
  language: Language;
  apiKey?: string;
  baseUrl: string;
}

// Storage schema
export interface StorageSchema {
  settings: Settings;
  user: User;
  chats: Record<string, Chat>;
  recentActions: RecentAction[];
  currentChatId?: string;
}

// Recent actions
export type ActionType =
  | "scan"
  | "pdf"
  | "youtube"
  | "chat"
  | "gita"
  | "podcast";

export interface RecentAction {
  type: ActionType;
  timestamp: number;
  query: string;
}

// Quick action
export interface QuickAction {
  id: ActionType;
  icon: string;
  label: string;
  color: string;
  bgColor: string;
  action: () => void;
}

// API Request/Response types
export interface SendMessageRequest {
  user_id: string;
  chat_id: string;
  thread_id: string;
  prompt: string;
  model?: string;
}

export interface SendMessageResponse {
  working: {
    message_id: string;
    chat_id: string;
    response: string;
    links: string[];
    next_questions: string[];
  };
}

export interface GetChatsResponse {
  chats: Array<{
    chat_id: string;
    thread_id: string;
    title: string;
    created_at: number;
    updated_at: number;
  }>;
}

export interface GetConversationRequest {
  user_id: string;
  chat_id: string;
  thread_id: string;
}

export interface GetConversationResponse {
  messages: Array<{
    role: "user" | "assistant";
    content: string;
    timestamp: number;
    links?: string[];
  }>;
}

export interface UploadPDFRequest {
  user_id: string;
  file: File;
}

export interface OCRRequest {
  user_id: string;
  image: File | Blob;
}

export interface YouTubeLearningRequest {
  youtube_url: string;
  user_id: string;
}

export interface GitaCounselingRequest {
  user_query: string;
  user_id: string;
}

// Component props types
export interface ChatMessageProps {
  message: Message;
}

export interface ThinkingBubbleProps {
  show: boolean;
}

export interface QuickActionCardProps {
  action: QuickAction;
}

// State types
export interface AppState {
  // User & settings
  user: User | null;
  settings: Settings;

  // Chat state
  currentChatId: string | null;
  chats: Record<string, Chat>;
  isLoading: boolean;
  error: string | null;

  // UI state
  isSidePanelOpen: boolean;
  isHistoryDrawerOpen: boolean;

  // Actions
  setUser: (user: User) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  setCurrentChat: (chatId: string | null) => void;
  addMessage: (chatId: string, message: Message) => void;
  createNewChat: () => string;
  deleteChat: (chatId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  toggleSidePanel: () => void;
  toggleHistoryDrawer: () => void;
  loadChatsFromStorage: () => Promise<void>;
  saveChatsToStorage: () => Promise<void>;
}
