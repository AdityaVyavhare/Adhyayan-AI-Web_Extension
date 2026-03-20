// Content script for Adhyayan AI extension
// Runs on all web pages

console.log("Adhyayan AI content script loaded");

// Inject content styles
const contentStyles = `
  #adhyayan-extension-root * {
    box-sizing: border-box;
  }
  
  .adhyayan-overlay {
    z-index: 2147483647 !important;
  }
  
  .adhyayan-fade-in {
    animation: adhyayan-fadeIn 0.2s ease-in-out;
  }
  
  @keyframes adhyayan-fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .adhyayan-selection-active {
    cursor: crosshair !important;
  }
`;

const styleElement = document.createElement("style");
styleElement.textContent = contentStyles;
document.head.appendChild(styleElement);

// Screenshot selection tool state
let isSelecting = false;
let selectionOverlay: HTMLDivElement | null = null;
let selectionBox: HTMLDivElement | null = null;
let startX = 0;
let startY = 0;

// Initialize screenshot tool
function initScreenshotTool() {
  // Create overlay
  selectionOverlay = document.createElement("div");
  selectionOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 999999;
    cursor: crosshair;
  `;

  // Create selection box
  selectionBox = document.createElement("div");
  selectionBox.style.cssText = `
    position: fixed;
    border: 2px dashed #2563EB;
    background: rgba(37, 99, 235, 0.1);
    z-index: 1000000;
    pointer-events: none;
  `;

  // Add instruction text
  const instruction = document.createElement("div");
  instruction.textContent = "Drag to select area, press ESC to cancel";
  instruction.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #2563EB;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-family: system-ui, sans-serif;
    font-size: 14px;
    font-weight: 600;
    z-index: 1000001;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  `;

  selectionOverlay.appendChild(instruction);
  document.body.appendChild(selectionOverlay);
  document.body.appendChild(selectionBox);

  isSelecting = true;

  // Mouse event handlers
  selectionOverlay.addEventListener("mousedown", handleMouseDown);
  selectionOverlay.addEventListener("mousemove", handleMouseMove);
  selectionOverlay.addEventListener("mouseup", handleMouseUp);

  // Keyboard handler
  document.addEventListener("keydown", handleKeyDown);
}

function handleMouseDown(e: MouseEvent) {
  startX = e.clientX;
  startY = e.clientY;
  if (selectionBox) {
    selectionBox.style.display = "block";
    selectionBox.style.left = startX + "px";
    selectionBox.style.top = startY + "px";
    selectionBox.style.width = "0px";
    selectionBox.style.height = "0px";
  }
}

function handleMouseMove(e: MouseEvent) {
  if (!isSelecting || !selectionBox) return;
  if (selectionBox.style.display !== "block") return;

  const currentX = e.clientX;
  const currentY = e.clientY;

  const width = Math.abs(currentX - startX);
  const height = Math.abs(currentY - startY);
  const left = Math.min(currentX, startX);
  const top = Math.min(currentY, startY);

  selectionBox.style.left = left + "px";
  selectionBox.style.top = top + "px";
  selectionBox.style.width = width + "px";
  selectionBox.style.height = height + "px";
}

async function handleMouseUp(_e: MouseEvent) {
  if (!selectionBox) return;

  const width = parseInt(selectionBox.style.width);
  const height = parseInt(selectionBox.style.height);

  if (width > 10 && height > 10) {
    // Valid selection, capture screenshot
    try {
      const response = await chrome.runtime.sendMessage({
        action: "captureScreenshot",
      });

      if (response.dataUrl) {
        // Open side panel with the screenshot
        chrome.runtime.sendMessage({
          action: "openSidePanel",
        });

        // Store screenshot for processing
        chrome.storage.local.set({
          pendingScreenshot: response.dataUrl,
          screenshotRegion: {
            left: parseInt(selectionBox.style.left),
            top: parseInt(selectionBox.style.top),
            width: width,
            height: height,
          },
        });
      }
    } catch (error) {
      console.error("Failed to capture screenshot:", error);
    }
  }

  cleanupScreenshotTool();
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === "Escape" && isSelecting) {
    cleanupScreenshotTool();
  }
}

function cleanupScreenshotTool() {
  isSelecting = false;

  if (selectionOverlay) {
    selectionOverlay.remove();
    selectionOverlay = null;
  }

  if (selectionBox) {
    selectionBox.remove();
    selectionBox = null;
  }

  document.removeEventListener("keydown", handleKeyDown);
}

// Listen for messages from popup/background
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  console.log("Content script received message:", request);

  switch (request.action) {
    case "startScreenshot":
      initScreenshotTool();
      sendResponse({ success: true });
      break;

    case "getSelectedText":
      const selectedText = window.getSelection()?.toString() || "";
      sendResponse({ text: selectedText });
      break;

    case "highlightText":
      // Highlight specific text on the page (for future feature)
      sendResponse({ success: true });
      break;

    default:
      console.log("Unknown action:", request.action);
  }

  return false;
});

// Add a subtle indicator that the extension is active
const indicator = document.createElement("div");
indicator.style.cssText = `
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 8px;
  height: 8px;
  background: linear-gradient(135deg, #6C5CE7, #4895EF);
  border-radius: 50%;
  z-index: 999998;
  opacity: 0.5;
  transition: opacity 0.3s;
  pointer-events: none;
`;

indicator.addEventListener("mouseenter", () => {
  indicator.style.opacity = "1";
});

indicator.addEventListener("mouseleave", () => {
  indicator.style.opacity = "0.5";
});

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(indicator);
});

// If DOM is already loaded
if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  document.body.appendChild(indicator);
}
