# 🚀 Adhyayan AI Extension - Quick Start Guide

## ✅ Build Status: SUCCESS

Your Adhyayan AI web extension has been successfully built and is ready to use!

## 📦 What Was Created

```
dist/
├── manifest.json          ✅ Extension configuration
├── icon16.png            ✅ Extension icon (16x16)
├── icon48.png            ✅ Extension icon (48x48)
├── icon128.png           ✅ Extension icon (128x128)
├── popup.html            ✅ Popup interface
├── sidepanel.html        ✅ Side panel chat
├── background.js         ✅ Background service worker
├── content.js            ✅ Content script
└── assets/               ✅ Bundled JS/CSS files
    ├── popup-*.js        → Popup React bundle
    ├── sidepanel-*.js    → Side panel React bundle
    ├── index-*.js        → Shared React components
    ├── index-*.css       → Tailwind CSS + KaTeX styles
    └── KaTeX_*.{woff2,woff,ttf} → Math font files
```

## 🎯 Installation Steps

### For Chrome:

1. **Open Chrome Extensions Page**

   ```
   chrome://extensions/
   ```

2. **Enable Developer Mode**
   - Toggle the switch in the top-right corner

3. **Load Extension**
   - Click "Load unpacked"
   - Navigate to: `S:\NormalProject\dist`
   - Click "Select Folder"

4. **Verify Installation**
   - Look for "Adhyayan AI - Doubt Clearing" in your extensions list
   - Pin the extension icon to your toolbar (click puzzle piece 🧩 icon)

### For Edge:

Same steps, but open: `edge://extensions/`

## 🎨 Features Overview

### Popup Interface (Click Extension Icon)

| Feature               | Icon | Description              |
| --------------------- | ---- | ------------------------ |
| **Scan Question**     | 📸   | Screenshot tool with OCR |
| **Upload PDF**        | 📄   | Analyze PDF documents    |
| **YouTube Learning**  | 🎥   | Summarize YouTube videos |
| **Chat Assistant**    | 💬   | Open AI chat side panel  |
| **Gita Counselor**    | 📚   | Spiritual guidance       |
| **Podcast Generator** | 🎧   | Create podcast scripts   |

### Side Panel Chat

- Full AI conversation interface
- Math equations with LaTeX (use $...$ or $$...$$)
- Code syntax highlighting
- Chat history with search
- Dark/Light theme toggle
- Typewriter effect for responses

### Context Menu (Right-Click)

- **"Ask Adhyayan AI about this"** - On selected text
- **"Explain this image"** - On images
- **"Summarize this page"** - On any page

## 🧪 Testing Checklist

After installation, test these features:

- [ ] Click extension icon → Popup opens with 6 action cards
- [ ] Click "Chat Assistant" → Side panel opens
- [ ] Type a message in chat → Get AI response
- [ ] Try math: Type `$x^2 + y^2 = z^2$` and send
- [ ] Right-click on text → See "Ask Adhyayan AI" option
- [ ] Check theme toggle (Sun/Moon icon in side panel)
- [ ] View chat history (History icon in side panel)
- [ ] Try "Scan Question" → Screenshot tool activates

## ⚙️ Configuration

### Set API Base URL

1. Click extension icon
2. Click "Settings & Preferences"
3. Update "API Base URL" field
4. Default: `https://your-backend.ngrok-free.app`

### Change Theme

- Click extension icon to open popup
- Open side panel (Chat Assistant)
- Click Sun/Moon icon in top-right

## 🐛 Troubleshooting

### Extension Won't Load

```powershell
# Rebuild the extension
cd S:\NormalProject
npm run build
```

Then reload in browser:

- Go to `chrome://extensions/`
- Find "Adhyayan AI"
- Click the reload icon 🔄

### API Not Connecting

1. Check Settings for correct API URL
2. Open browser DevTools (F12)
3. Check Console and Network tabs for errors
4. Verify backend server is running

### Styles Look Wrong

- Clear browser cache
- Reload extension
- Check if Tailwind CSS loaded (inspect element to see classes)

### Math Not Rendering

- KaTeX fonts should be in `dist/assets/`
- Check browser console for 404 errors
- Rebuild if fonts are missing

## 📝 Development Workflow

### Making Changes

1. **Edit source files** in `src/` folder
2. **Rebuild**:
   ```powershell
   npm run build
   ```
3. **Reload extension** in browser (click 🔄 icon)

### Watch Mode (Auto-rebuild)

```powershell
npm run watch
```

Still need to manually reload extension in browser after changes.

### Type Checking

```powershell
npm run type-check
```

## 🎓 Usage Examples

### Ask a Math Question

1. Open side panel (Chat Assistant)
2. Type: "Explain the quadratic formula with an example"
3. AI responds with formatted math using KaTeX

### Scan a Screenshot

1. Click "Scan Question" in popup
2. Drag to select area on screen
3. Text is extracted and sent to AI
4. Side panel opens with response

### Learn from YouTube

1. Go to any YouTube video
2. Click extension icon
3. Click "Learn from YouTube"
4. AI generates summary with key points

### Get Gita Guidance

1. Click "Gita Counselor"
2. Ask: "How can I deal with stress?"
3. Receive Sanskrit shloka with interpretation

## 🔧 Advanced Configuration

### Customize Colors

Edit `tailwind.config.js` → `theme.extend.colors`

### Add New Quick Action

Edit `src/popup/Popup.tsx` → `quickActions` array

### Modify API Endpoints

Edit `src/utils/api.ts` → `api` object

### Change Default Settings

Edit `src/store/index.ts` → `DEFAULT_SETTINGS`

## 📊 Project Stats

- **Total Files**: 20+ source files
- **Dependencies**: 262 npm packages
- **Bundle Size**:
  - Popup: ~7 KB
  - Side Panel: ~450 KB (includes React + KaTeX)
  - Background: ~3 KB
  - Content: ~3 KB
  - Assets (CSS + fonts): ~47 KB

## 🌟 Next Steps

1. **Configure your API backend URL**
2. **Test all 6 quick actions**
3. **Try the screenshot tool**
4. **Explore chat history feature**
5. **Customize colors and theme to your preference**

## 📞 Need Help?

- Check the main [README.md](README.md) for full documentation
- Review TypeScript types in `src/types/index.ts`
- Inspect Chrome DevTools console for errors
- Check `manifest.json` for permissions

---

**✨ Your extension is ready! Click the icon in your browser to get started! ✨**

Date Built: February 11, 2026
