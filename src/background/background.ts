// Background service worker for Adhyayan AI extension

// Check if contextMenus API is available
const contextMenusAvailable =
  typeof chrome !== "undefined" &&
  chrome.contextMenus &&
  typeof chrome.contextMenus.create === "function";

// Initialize extension on install
chrome.runtime.onInstalled.addListener(() => {
  console.log("Adhyayan AI Extension installed!");

  // Create context menu items with error handling
  if (contextMenusAvailable) {
    try {
      chrome.contextMenus.create({
        id: "askAdhyayan",
        title: "Ask Adhyayan AI about this",
        contexts: ["selection"],
      });

      chrome.contextMenus.create({
        id: "explainImage",
        title: "Explain this image",
        contexts: ["image"],
      });

      chrome.contextMenus.create({
        id: "summarizePage",
        title: "Summarize this page",
        contexts: ["page"],
      });
    } catch (error) {
      console.warn("Failed to create context menus:", error);
    }
  } else {
    console.warn("Context menus API not available");
  }

  // Initialize storage with default values
  chrome.storage.local.get(["user", "settings"], (result) => {
    if (!result.user) {
      chrome.storage.local.set({
        user: {
          id: "user_" + Date.now(),
          email: "",
          username: "Student",
          streak: 0,
          createdAt: Date.now(),
        },
      });
    }

    if (!result.settings) {
      chrome.storage.local.set({
        settings: {
          theme: "auto",
          language: "en",
          baseUrl: "https://your-backend.ngrok-free.app",
        },
      });
    }
  });
});

// Handle context menu clicks
if (contextMenusAvailable) {
  try {
    chrome.contextMenus.onClicked.addListener((info, tab) => {
      if (!tab?.id) return;

      switch (info.menuItemId) {
        case "askAdhyayan":
          if (info.selectionText) {
            // Open side panel and send selected text
            chrome.sidePanel.open({ windowId: tab.windowId });
            // Store the selected text to be picked up by the side panel
            chrome.storage.local.set({ pendingQuery: info.selectionText });
          }
          break;

        case "explainImage":
          if (info.srcUrl) {
            chrome.sidePanel.open({ windowId: tab.windowId });
            chrome.storage.local.set({
              pendingQuery: `Explain this image: ${info.srcUrl}`,
            });
          }
          break;

        case "summarizePage":
          chrome.sidePanel.open({ windowId: tab.windowId });
          chrome.storage.local.set({
            pendingQuery: `Summarize this page: ${info.pageUrl}`,
          });
          break;
      }
    });
  } catch (error) {
    console.warn("Failed to add context menu listener:", error);
  }
}

// Handle messages from content scripts, popup, and side panel
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Background received message:", request);

  // Handle different actions
  switch (request.action) {
    case "openSidePanel":
      if (sender.tab?.windowId) {
        chrome.sidePanel.open({ windowId: sender.tab.windowId });

        // Store any pending data
        if (request.data) {
          chrome.storage.local.set({ pendingQuery: request.data });
        }
      }
      break;

    case "uploadPDF":
      // Open side panel and store PDF data
      if (sender.tab?.windowId) {
        chrome.sidePanel.open({ windowId: sender.tab.windowId });
        chrome.storage.local.set({
          pendingPDF: {
            name: request.file.name,
            size: request.file.size,
            timestamp: Date.now(),
          },
        });
      }
      break;

    case "youtubeLearn":
      // Open side panel with YouTube URL and mode
      if (sender.tab?.windowId) {
        chrome.sidePanel.open({ windowId: sender.tab.windowId });
        chrome.storage.local.set({
          pendingYouTube: {
            url: request.url,
            videoId: request.videoId,
            mode: request.mode,
            timestamp: Date.now(),
          },
        });
      }
      break;

    case "gitaGuidance":
      // Open side panel with Gita query
      if (sender.tab?.windowId) {
        chrome.sidePanel.open({ windowId: sender.tab.windowId });
        chrome.storage.local.set({
          pendingGita: {
            topic: request.topic,
            query: request.query,
            timestamp: Date.now(),
          },
        });
      }
      break;

    case "generatePodcast":
      // Open side panel with podcast configuration
      if (sender.tab?.windowId) {
        chrome.sidePanel.open({ windowId: sender.tab.windowId });
        chrome.storage.local.set({
          pendingPodcast: {
            topic: request.topic,
            duration: request.duration,
            voiceStyle: request.voiceStyle,
            format: request.format,
            timestamp: Date.now(),
          },
        });
      }
      break;

    case "ocrResult":
      // Forward OCR result to side panel
      chrome.runtime.sendMessage({
        action: "ocrTextExtracted",
        text: request.text,
      });
      break;

    case "captureScreenshot":
      // Capture visible tab as screenshot
      if (sender.tab?.id) {
        chrome.tabs.captureVisibleTab(
          sender.tab.windowId,
          { format: "png" },
          (dataUrl) => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
              sendResponse({ error: chrome.runtime.lastError.message });
            } else {
              sendResponse({ dataUrl });
            }
          },
        );
        return true; // Keep channel open for async response
      }
      break;

    default:
      console.log("Unknown action:", request.action);
  }

  return false;
});

// Update streak counter daily
chrome.alarms.create("updateStreak", { periodInMinutes: 1440 }); // 24 hours

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "updateStreak") {
    chrome.storage.local.get(["user", "lastActiveDate"], (result) => {
      const today = new Date().toDateString();
      const lastActive = result.lastActiveDate;

      if (lastActive !== today) {
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        // Increment streak if user was active yesterday, otherwise reset
        const newStreak =
          lastActive === yesterday ? (result.user?.streak || 0) + 1 : 1;

        chrome.storage.local.set({
          user: {
            ...result.user,
            streak: newStreak,
          },
          lastActiveDate: today,
        });
      }
    });
  }
});

// Track user activity
chrome.tabs.onActivated.addListener(() => {
  const today = new Date().toDateString();
  chrome.storage.local.set({ lastActiveDate: today });
});

console.log("Adhyayan AI background service worker loaded");
