// API Configuration
const API_BASE_URL = "https://f0f1-49-248-124-242.ngrok-free.app";
export const TEST_GENERATION_URL =
  "https://llmquestionansweringreasoning.onrender.com";

// User ID constant
export const USER_ID = "vyavhareaditya11@gmail.com";

// Types
export interface ChatHistory {
  chat_id: string;
  title?: string;
  updated_at?: string;
  created_at?: string;
  last_updated?: string;
  [key: string]: any;
}

// Feature 1: Chat Model API
export const chatModelAPI = {
  async getUserChats(userId: string = USER_ID) {
    const response = await fetch(
      `${API_BASE_URL}/feature1_get_user_chats/${userId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );
    if (!response.ok) throw new Error("Failed to fetch chat history");
    return response.json();
  },

  async getConversation(
    chatId: string,
    threadId: string,
    userId: string = USER_ID,
  ) {
    const response = await fetch(`${API_BASE_URL}/feature1_get_conversation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        chat_id: chatId,
        thread_id: threadId,
      }),
    });
    if (!response.ok) throw new Error("Failed to fetch conversation");
    return response.json();
  },

  async sendMessage(
    chatId: string,
    message: string,
    threadId?: string,
    userId: string = USER_ID,
  ) {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        chat_id: chatId,
        message,
        thread_id: threadId,
      }),
    });
    if (!response.ok) throw new Error("Failed to send message");
    return response.json();
  },

  async deleteChat(chatId: string, userId: string = USER_ID) {
    const response = await fetch(`${API_BASE_URL}/feature1_delete_chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, chat_id: chatId }),
    });
    if (!response.ok) throw new Error("Failed to delete chat");
    return response.json();
  },
};

// Feature 3: PDF Upload API
export const pdfAPI = {
  async getUserChats(userId: string = USER_ID) {
    const response = await fetch(`${API_BASE_URL}/get_user_chats`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId }),
    });
    if (!response.ok) throw new Error("Failed to fetch PDF chats");
    return response.json();
  },

  async getConversation(
    chatId: string,
    threadId: string,
    userId: string = USER_ID,
  ) {
    const response = await fetch(`${API_BASE_URL}/get_conversation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        chat_id: chatId,
        thread_id: threadId,
      }),
    });
    if (!response.ok) throw new Error("Failed to fetch PDF conversation");
    return response.json();
  },

  async ingestPDF(
    chatId: string,
    pdfUrl: string,
    message: string,
    userId: string = USER_ID,
  ) {
    const response = await fetch(`${API_BASE_URL}/pdf_ingest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        chat_id: chatId,
        pdf_url: pdfUrl,
        message,
      }),
    });
    if (!response.ok) throw new Error("Failed to ingest PDF");
    return response.json();
  },

  async deleteChat(chatId: string, userId: string = USER_ID) {
    const response = await fetch(`${API_BASE_URL}/delete_chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, chat_id: chatId }),
    });
    if (!response.ok) throw new Error("Failed to delete PDF chat");
    return response.json();
  },
};

// Feature 5: YouTube Video API
export const youtubeAPI = {
  async getUserChats(userId: string = USER_ID) {
    const response = await fetch(`${API_BASE_URL}/feature5_get_chats`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId }),
    });
    if (!response.ok) throw new Error("Failed to fetch YouTube chats");
    return response.json();
  },

  async getChatHistory(chatId: string, userId: string = USER_ID) {
    const response = await fetch(`${API_BASE_URL}/feature5_get_chat_history`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, chat_id: chatId }),
    });
    if (!response.ok) throw new Error("Failed to fetch YouTube chat history");
    return response.json();
  },

  async analyzeVideo(
    chatId: string,
    youtubeUrl: string,
    message: string,
    userId: string = USER_ID,
  ) {
    const response = await fetch(`${API_BASE_URL}/video_rag`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        chat_id: chatId,
        youtube_url: youtubeUrl,
        message,
      }),
    });
    if (!response.ok) throw new Error("Failed to analyze video");
    return response.json();
  },

  async deleteChat(chatId: string, userId: string = USER_ID) {
    const response = await fetch(`${API_BASE_URL}/feature5_delete_chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, chat_id: chatId }),
    });
    if (!response.ok) throw new Error("Failed to delete YouTube chat");
    return response.json();
  },
};

// Feature 7: Podcast Generator API
export const podcastAPI = {
  async getUserChats(userId: string = USER_ID) {
    const response = await fetch(`${API_BASE_URL}/feature7_get_chats`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId }),
    });
    if (!response.ok) throw new Error("Failed to fetch podcast chats");
    return response.json();
  },

  async getChatHistory(chatId: string, userId: string = USER_ID) {
    const response = await fetch(`${API_BASE_URL}/feature7_get_chat_history`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, chat_id: chatId }),
    });
    if (!response.ok) throw new Error("Failed to fetch podcast history");
    return response.json();
  },

  async generatePodcast(
    chatId: string,
    topic: string,
    userId: string = USER_ID,
  ) {
    const response = await fetch(`${API_BASE_URL}/podcast_generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, chat_id: chatId, topic }),
    });
    if (!response.ok) throw new Error("Failed to generate podcast");
    return response.json();
  },

  async deleteChat(chatId: string, userId: string = USER_ID) {
    const response = await fetch(`${API_BASE_URL}/feature7_delete_chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, chat_id: chatId }),
    });
    if (!response.ok) throw new Error("Failed to delete podcast chat");
    return response.json();
  },
};

// Feature 8: Gita Counselor API
export const gitaAPI = {
  async getUserChats(userId: string = USER_ID) {
    const response = await fetch(`${API_BASE_URL}/feature8_get_chats`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId }),
    });
    if (!response.ok) throw new Error("Failed to fetch Gita chats");
    return response.json();
  },

  async getChatHistory(chatId: string, userId: string = USER_ID) {
    const response = await fetch(`${API_BASE_URL}/feature8_get_chat_history`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, chat_id: chatId }),
    });
    if (!response.ok)
      throw new Error("Failed to fetch Gita counseling history");
    return response.json();
  },

  async getCounseling(
    chatId: string,
    doubt: string,
    preferredLanguage: string = "english",
    userId: string = USER_ID,
  ) {
    const response = await fetch(`${API_BASE_URL}/gita_counseling`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        chat_id: chatId,
        doubt,
        preferred_language: preferredLanguage,
      }),
    });
    if (!response.ok) throw new Error("Failed to get Gita counseling");
    return response.json();
  },

  async deleteChat(chatId: string, userId: string = USER_ID) {
    const response = await fetch(`${API_BASE_URL}/feature8_delete_chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, chat_id: chatId }),
    });
    if (!response.ok) throw new Error("Failed to delete Gita chat");
    return response.json();
  },
};

// Utility function to generate chat ID
export const generateChatId = (prefix: string): string => {
  return `${prefix}_${Date.now()}`;
};

// Utility function to format date
export const formatDate = (dateString?: string): string => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};
