import { create } from "zustand";
import type { AppState, Chat, User, Settings } from "../types";

const DEFAULT_SETTINGS: Settings = {
  theme: "auto",
  language: "en",
  baseUrl: "https://your-backend.ngrok-free.app",
};

const DEFAULT_USER: User = {
  id: "user_" + Date.now(),
  email: "",
  username: "Student",
  streak: 0,
  createdAt: Date.now(),
};

export const useStore = create<AppState>((set, get) => ({
  // Initial state
  user: DEFAULT_USER,
  settings: DEFAULT_SETTINGS,
  currentChatId: null,
  chats: {},
  isLoading: false,
  error: null,
  isSidePanelOpen: false,
  isHistoryDrawerOpen: false,

  // User actions
  setUser: (user) => {
    set({ user });
    chrome.storage.local.set({ user });
  },

  updateSettings: (newSettings) => {
    const settings = { ...get().settings, ...newSettings };
    set({ settings });
    chrome.storage.local.set({ settings });
  },

  // Chat actions
  setCurrentChat: (chatId) => {
    set({ currentChatId: chatId });
    chrome.storage.local.set({ currentChatId: chatId });
  },

  addMessage: (chatId, message) => {
    const chats = { ...get().chats };
    if (chats[chatId]) {
      chats[chatId].messages.push(message);
      chats[chatId].updatedAt = Date.now();

      // Update title if it's the first user message
      if (chats[chatId].messages.length === 1 && message.role === "user") {
        chats[chatId].title =
          message.content.slice(0, 50) +
          (message.content.length > 50 ? "..." : "");
      }

      set({ chats });
      get().saveChatsToStorage();
    }
  },

  createNewChat: () => {
    const chatId = "chat_" + Date.now();
    const threadId = "thread_" + Date.now();

    const newChat: Chat = {
      id: chatId,
      threadId,
      title: "New Chat",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
    };

    const chats = { ...get().chats, [chatId]: newChat };
    set({ chats, currentChatId: chatId });
    get().saveChatsToStorage();

    return chatId;
  },

  deleteChat: (chatId) => {
    const chats = { ...get().chats };
    delete chats[chatId];

    const currentChatId =
      get().currentChatId === chatId ? null : get().currentChatId;
    set({ chats, currentChatId });
    get().saveChatsToStorage();
  },

  // UI actions
  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  toggleSidePanel: () => set({ isSidePanelOpen: !get().isSidePanelOpen }),

  toggleHistoryDrawer: () =>
    set({ isHistoryDrawerOpen: !get().isHistoryDrawerOpen }),

  // Storage actions
  loadChatsFromStorage: async () => {
    try {
      const result = await chrome.storage.local.get([
        "user",
        "settings",
        "chats",
        "currentChatId",
      ]);

      set({
        user: result.user || DEFAULT_USER,
        settings: result.settings || DEFAULT_SETTINGS,
        chats: result.chats || {},
        currentChatId: result.currentChatId || null,
      });
    } catch (error) {
      console.error("Failed to load from storage:", error);
    }
  },

  saveChatsToStorage: async () => {
    try {
      const { chats, currentChatId } = get();
      await chrome.storage.local.set({ chats, currentChatId });
    } catch (error) {
      console.error("Failed to save to storage:", error);
    }
  },
}));

// Initialize store from storage on load
if (typeof chrome !== "undefined" && chrome.storage) {
  useStore.getState().loadChatsFromStorage();
}
