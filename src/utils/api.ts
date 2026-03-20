import type {
  SendMessageRequest,
  SendMessageResponse,
  GetChatsResponse,
  GetConversationRequest,
  GetConversationResponse,
  UploadPDFRequest,
  OCRRequest,
  YouTubeLearningRequest,
  GitaCounselingRequest,
} from "../types";

// Get base URL from settings
async function getBaseUrl(): Promise<string> {
  const result = await chrome.storage.local.get("settings");
  return result.settings?.baseUrl || "https://your-backend.ngrok-free.app";
}

// Generic API call helper
async function apiCall<T>(
  endpoint: string,
  method: string = "GET",
  body?: any,
  isFormData: boolean = false,
): Promise<T> {
  const baseUrl = await getBaseUrl();
  const url = `${baseUrl}${endpoint}`;

  const options: RequestInit = {
    method,
    headers: isFormData
      ? {}
      : {
          "Content-Type": "application/json",
        },
  };

  if (body) {
    options.body = isFormData ? body : JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
}

// API methods
export const api = {
  // Send message to AI
  sendMessage: async (
    data: SendMessageRequest,
  ): Promise<SendMessageResponse> => {
    return apiCall<SendMessageResponse>("/send_message", "POST", data);
  },

  // Get user's chat history
  getUserChats: async (userId: string): Promise<GetChatsResponse> => {
    return apiCall<GetChatsResponse>(
      `/feature1_get_user_chats/${userId}`,
      "GET",
    );
  },

  // Get specific conversation
  getConversation: async (
    data: GetConversationRequest,
  ): Promise<GetConversationResponse> => {
    return apiCall<GetConversationResponse>(
      "/feature1_get_conversation",
      "POST",
      data,
    );
  },

  // Upload PDF
  uploadPDF: async (data: UploadPDFRequest): Promise<any> => {
    const formData = new FormData();
    formData.append("user_id", data.user_id);
    formData.append("file", data.file);

    return apiCall<any>("/upload_pdf", "POST", formData, true);
  },

  // OCR scan
  ocrScan: async (data: OCRRequest): Promise<{ text: string }> => {
    const formData = new FormData();
    formData.append("user_id", data.user_id);
    formData.append("image", data.image);

    return apiCall<{ text: string }>("/ocr_scan", "POST", formData, true);
  },

  // YouTube learning
  youtubeLearning: async (
    data: YouTubeLearningRequest,
  ): Promise<SendMessageResponse> => {
    return apiCall<SendMessageResponse>("/youtube_learning", "POST", data);
  },

  // Gita counseling
  gitaCounseling: async (
    data: GitaCounselingRequest,
  ): Promise<SendMessageResponse> => {
    return apiCall<SendMessageResponse>("/gita_counseling", "POST", data);
  },

  // Podcast generation (placeholder - adjust endpoint as needed)
  generatePodcast: async (data: {
    topic: string;
    user_id: string;
  }): Promise<any> => {
    return apiCall<any>("/generate_podcast", "POST", data);
  },
};

export default api;
