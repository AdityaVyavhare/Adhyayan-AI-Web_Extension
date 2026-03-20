// Generate unique IDs
export function generateId(prefix: string = "id"): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Format timestamp to readable date
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);

  if (diffInHours < 1) {
    const minutes = Math.floor(diffInMs / (1000 * 60));
    return minutes === 0 ? "just now" : `${minutes}m ago`;
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`;
  } else if (diffInHours < 48) {
    return "yesterday";
  } else {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

// Parse YouTube URL
export function parseYouTubeUrl(url: string): string | null {
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

// Detect if current page is YouTube
export function isYouTubePage(url: string): boolean {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

// Get current tab info
export async function getCurrentTab(): Promise<chrome.tabs.Tab | null> {
  if (typeof chrome === "undefined" || !chrome.tabs) {
    return null;
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab || null;
}

// Open side panel
export async function openSidePanel(): Promise<void> {
  if (typeof chrome === "undefined" || !chrome.sidePanel) {
    return;
  }

  try {
    const currentWindow = await chrome.windows.getCurrent();
    if (currentWindow.id) {
      await chrome.sidePanel.open({ windowId: currentWindow.id });
    }
  } catch (error) {
    console.error("Failed to open side panel:", error);
  }
}

// Copy text to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
}

// Capture screenshot
export async function captureScreenshot(): Promise<string | null> {
  if (typeof chrome === "undefined" || !chrome.tabs) {
    return null;
  }

  try {
    const dataUrl = await chrome.tabs.captureVisibleTab({
      format: "png",
    });
    return dataUrl;
  } catch (error) {
    console.error("Failed to capture screenshot:", error);
    return null;
  }
}

// Convert data URL to Blob
export function dataURLtoBlob(dataURL: string): Blob {
  const arr = dataURL.split(",");
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new Blob([u8arr], { type: mime });
}

// Get theme preference
export function getThemePreference(): "light" | "dark" {
  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return isDark ? "dark" : "light";
}

// Apply theme
export function applyTheme(theme: "light" | "dark" | "auto"): void {
  const root = document.documentElement;

  if (theme === "auto") {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    root.classList.toggle("dark", prefersDark);
  } else {
    root.classList.toggle("dark", theme === "dark");
  }
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// File size formatter
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

// Error message formatter
export function formatErrorMessage(error: any): string {
  if (typeof error === "string") return error;
  if (error?.message) return error.message;
  return "An unexpected error occurred";
}

// Check if string contains math
export function containsMath(text: string): boolean {
  return /\$.*?\$|\$\$.*?\$\$/.test(text);
}

// Extract selected text from page
export async function getSelectedText(): Promise<string> {
  if (typeof chrome === "undefined" || !chrome.tabs) {
    return "";
  }

  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab.id) return "";

    const result = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.getSelection()?.toString() || "",
    });

    return result[0]?.result || "";
  } catch (error) {
    console.error("Failed to get selected text:", error);
    return "";
  }
}
