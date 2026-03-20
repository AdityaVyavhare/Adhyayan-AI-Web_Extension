# Adhyayan AI Extension - Testing Guide

## Setup Instructions

### 1. Load Extension in Chrome

1. Open Chrome browser
2. Navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right)
4. Click **Load unpacked**
5. Select the `S:\NormalProject\dist` folder
6. Extension should appear with Adhyayan AI logo

### 2. Verify Installation

- ✅ Extension icon appears in Chrome toolbar
- ✅ No errors in `chrome://extensions/` page
- ✅ Background service worker is active (green status)

---

## Test Cases

### **Test 1: Extension Popup**

**Steps:**

1. Click the Adhyayan AI extension icon
2. Verify popup opens (400x600px)

**Expected Results:**

- ✅ Popup displays with NEWLOGO.png in header
- ✅ 5 tool cards visible: PDF Upload, YouTube, Gita, Podcast, Chat
- ✅ Each card has correct icon, title, and description
- ✅ Gradient background (purple/blue/orange) displays correctly

---

### **Test 2: PDF Upload Page**

**Steps:**

1. Click "PDF Upload & Analysis" card
2. Test drag-and-drop functionality
3. Click "Browse Files" button
4. Select a PDF file
5. Click "Analyze PDF" button

**Expected Results:**

- ✅ Navigation to PDF page works
- ✅ Back button returns to home
- ✅ Drag-over effect shows purple border
- ✅ File input opens on "Browse Files"
- ✅ Selected file displays with name and size
- ✅ "Analyze PDF" button enabled after file selection
- ✅ Click opens side panel with PDF analysis prompt
- ✅ File saved to recentPDFs in storage
- ✅ Recent PDFs list displays below (up to 5 items)

**Storage Check:**

```javascript
chrome.storage.local.get(["recentPDFs"], console.log);
```

---

### **Test 3: YouTube Learning Page**

**Steps:**

1. Go back to home and click "YouTube Learning"
2. Open a YouTube video in another tab
3. Return to extension popup and reopen YouTube page
4. Verify auto-detection
5. Manually paste a YouTube URL
6. Select learning mode (Summary/Q&A/Quiz)
7. Click "Start Learning"

**Expected Results:**

- ✅ Navigation to YouTube page works
- ✅ Auto-detects YouTube URL from current tab
- ✅ "Auto-detected" badge shows green checkmark
- ✅ Manual URL input validates correctly
- ✅ Video thumbnail displays when valid URL entered
- ✅ 3 mode buttons (Summary, Q&A, Quiz) selectable
- ✅ "Start Learning" opens side panel with mode-specific prompt
- ✅ Recent videos list saved to storage

**Test URLs:**

- `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- `https://youtu.be/dQw4w9WgXcQ`

**Storage Check:**

```javascript
chrome.storage.local.get(["recentVideos"], console.log);
```

---

### **Test 4: Gita Counselor Page**

**Steps:**

1. Go back to home and click "Gita Counselor"
2. Click each scenario card (Anxiety, Career, Relationships, Purpose, Conflict)
3. Verify color changes on selection
4. Type custom query in textarea
5. Click "Get Guidance"

**Expected Results:**

- ✅ Navigation to Gita page works
- ✅ 5 scenario cards display with icons and colors
- ✅ Click highlights card with purple border
- ✅ Custom query textarea accepts input
- ✅ "Get Guidance" button enabled when topic selected
- ✅ Click opens side panel with appropriate query
- ✅ Sanskrit verse info card displays at bottom
- ✅ Recent queries saved to storage

**Scenarios to test:**

1. Stress/Anxiety (pink/red theme)
2. Career Decisions (purple theme)
3. Relationships (green theme)
4. Life Purpose (orange theme)
5. Inner Conflict (blue theme)

**Storage Check:**

```javascript
chrome.storage.local.get(["recentGitaQueries"], console.log);
```

---

### **Test 5: Podcast Generator Page**

**Steps:**

1. Go back to home and click "Podcast Generator"
2. Enter a topic (e.g., "History of Ancient Rome")
3. Select duration (5, 10, or 15 minutes)
4. Choose voice style (Conversational/Formal/Energetic/Storytelling)
5. Select format (Solo/Interview/Discussion)
6. Click "Generate Podcast"

**Expected Results:**

- ✅ Navigation to Podcast page works
- ✅ Topic textarea accepts input
- ✅ Duration buttons selectable (purple highlight)
- ✅ Voice style grid displays 4 options with icons
- ✅ Format list displays 3 options
- ✅ "Generate Podcast" button disabled until topic entered
- ✅ Click opens side panel with podcast script prompt
- ✅ Recent podcasts saved to storage (up to 5)
- ✅ Recent podcasts display with topic, duration, and timestamp

**Test Topics:**

- "Impact of AI on Education"
- "Climate Change Solutions"
- "Introduction to Quantum Physics"

**Storage Check:**

```javascript
chrome.storage.local.get(["recentPodcasts"], console.log);
```

---

### **Test 6: Chat AI Page**

**Steps:**

1. Go back to home and click "Chat with AI"
2. Verify side panel opens

**Expected Results:**

- ✅ Side panel opens automatically
- ✅ Chat interface displays with NEWLOGO.png
- ✅ Input field ready for text entry
- ✅ Send button visible

---

### **Test 7: Side Panel Integration**

**Steps:**

1. Test each tool page → side panel flow
2. Verify correct prompt appears for each tool
3. Check Chrome storage for pending data

**Expected Results:**

**PDF Upload:**

- ✅ Prompt: "I've uploaded a PDF file [name] ([size] KB). Please analyze it..."

**YouTube (Summary mode):**

- ✅ Prompt: "I want to learn from this YouTube video: [URL]\n\nPlease provide a comprehensive summary..."

**YouTube (Q&A mode):**

- ✅ Prompt: "...I'd like to ask questions about this video."

**YouTube (Quiz mode):**

- ✅ Prompt: "...Please create a quiz to test my understanding..."

**Gita Counselor:**

- ✅ Prompt: Selected scenario prompt or custom query

**Podcast Generator:**

- ✅ Prompt: "Generate a [duration]-minute [format] podcast about [topic] in a [voiceStyle] style..."

**Storage Check:**

```javascript
// Check pending data
chrome.storage.local.get(
  [
    "pendingQuery",
    "pendingPDF",
    "pendingYouTube",
    "pendingGita",
    "pendingPodcast",
  ],
  console.log,
);
```

---

### **Test 8: Context Menu**

**Steps:**

1. Right-click on selected text on any webpage
2. Right-click on an image
3. Right-click on page background

**Expected Results:**

- ✅ "Ask Adhyayan AI about this" appears on selected text
- ✅ "Explain this image" appears on images
- ✅ "Summarize this page" appears on page
- ✅ Each option opens side panel with appropriate context

---

### **Test 9: Background Service Worker**

**Steps:**

1. Open `chrome://extensions/`
2. Find Adhyayan AI extension
3. Click "service worker" link under "Inspect views"
4. Check Console tab for logs

**Expected Results:**

- ✅ "Adhyayan AI Extension installed!" logged
- ✅ "Adhyayan AI background service worker loaded" logged
- ✅ No errors in console
- ✅ Context menus created successfully (or warning if unavailable)

---

### **Test 10: Storage & Persistence**

**Steps:**

1. Complete actions on each tool page
2. Close and reopen extension popup
3. Navigate to each page and verify recent items

**Expected Results:**

- ✅ Recent PDFs persist across sessions
- ✅ Recent YouTube videos persist
- ✅ Recent Gita queries persist
- ✅ Recent podcasts persist
- ✅ Click recent item repopulates form

**Full Storage Check:**

```javascript
chrome.storage.local.get(null, (data) => {
  console.log("All stored data:", data);
  console.log("User:", data.user);
  console.log("Settings:", data.settings);
  console.log("Recent PDFs:", data.recentPDFs);
  console.log("Recent Videos:", data.recentVideos);
  console.log("Recent Gita Queries:", data.recentGitaQueries);
  console.log("Recent Podcasts:", data.recentPodcasts);
});
```

---

### **Test 11: Responsive Design**

**Steps:**

1. Test popup dimensions
2. Verify scrolling works on each page
3. Check text wrapping and overflow

**Expected Results:**

- ✅ Popup: 400px width, 600px height
- ✅ All pages overflow-y with smooth scrolling
- ✅ Text doesn't break layout
- ✅ Long file names truncate properly
- ✅ Buttons remain visible and accessible

---

### **Test 12: Dark Mode (Future)**

**Note:** Theme switching not yet implemented in current version

---

## Known Issues & Limitations

1. **Backend API**: Currently configured to use placeholder URL `https://your-backend.ngrok-free.app`
   - Update in Settings or `background.ts` before actual deployment

2. **File Upload**: PDF files are not yet actually uploaded to backend
   - Only metadata (name, size) is stored locally

3. **YouTube Transcript**: Extension doesn't fetch actual video transcripts yet
   - Integration with YouTube API or transcript service needed

4. **Podcast Generation**: No actual audio generation
   - Script prompt sent to AI, but audio synthesis not implemented

5. **Context Menus**: May not work in some environments
   - Graceful fallback with console warnings

---

## Debug Commands

### Clear All Storage

```javascript
chrome.storage.local.clear(() => {
  console.log("Storage cleared");
});
```

### View All Storage

```javascript
chrome.storage.local.get(null, console.log);
```

### Test Side Panel

```javascript
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.sidePanel.open({ windowId: tabs[0].windowId });
});
```

### Check Background Messages

```javascript
chrome.runtime.sendMessage(
  {
    action: "uploadPDF",
    file: { name: "test.pdf", size: 1234 },
  },
  (response) => {
    console.log("Response:", response);
  },
);
```

---

## Success Criteria

### ✅ All Tests Pass

- [ ] Extension loads without errors
- [ ] All 5 tool pages navigate correctly
- [ ] Each tool page UI displays properly
- [ ] Side panel integration works for all tools
- [ ] Chrome storage persists data correctly
- [ ] Recent items display on each page
- [ ] Context menus function (where available)
- [ ] Background service worker runs without errors
- [ ] No console errors in any view

### 📊 Performance

- Build size: ~450KB (sidepanel.js largest)
- Popup opens in <100ms
- Page navigation instant
- No memory leaks detected

---

## Next Steps (Post-Testing)

1. **Backend Integration**
   - Implement actual API calls in `src/utils/api.ts`
   - Replace placeholder URL with production endpoint

2. **Feature Enhancements**
   - Add actual PDF text extraction
   - Integrate YouTube transcript fetching
   - Implement audio generation for podcasts
   - Add chat history persistence

3. **Production Deployment**
   - Update manifest version
   - Add proper icons (16x16, 48x48, 128x128)
   - Submit to Chrome Web Store
   - Set up analytics

---

## Test Report Template

```
Test Date: _______________
Tester: _______________
Chrome Version: _______________

| Test Case | Status | Notes |
|-----------|--------|-------|
| Extension Popup | ⬜ Pass / ⬜ Fail | |
| PDF Upload Page | ⬜ Pass / ⬜ Fail | |
| YouTube Page | ⬜ Pass / ⬜ Fail | |
| Gita Page | ⬜ Pass / ⬜ Fail | |
| Podcast Page | ⬜ Pass / ⬜ Fail | |
| Chat AI Page | ⬜ Pass / ⬜ Fail | |
| Side Panel Integration | ⬜ Pass / ⬜ Fail | |
| Context Menu | ⬜ Pass / ⬜ Fail | |
| Background Worker | ⬜ Pass / ⬜ Fail | |
| Storage & Persistence | ⬜ Pass / ⬜ Fail | |
| Responsive Design | ⬜ Pass / ⬜ Fail | |

Overall Result: ⬜ Pass / ⬜ Fail

Critical Issues:
-
-

Minor Issues:
-
-

Recommendations:
-
-
```

---

## Quick Start Testing Checklist

✅ **Quick 5-Minute Test:**

1. Load extension at `chrome://extensions/`
2. Click extension icon → popup opens
3. Click each tool card → page loads
4. Click "Chat with AI" → side panel opens
5. No errors in console

✅ **Full Test (20 minutes):**

- Complete all 12 test cases above
- Verify all storage operations
- Check side panel integration
- Test context menus
- Review background service worker logs

---

_Extension Version: 1.0.0_  
_Test Guide Version: 1.0_  
_Last Updated: February 11, 2026_
