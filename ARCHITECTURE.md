# Extension User Flow

## Updated Architecture (After Fixes)

```
┌─────────────────────────────────────────────────────────────┐
│                    User Clicks Extension Icon                │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    POPUP OPENS (index.html)                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  ThemeProvider (✅ Fixed)                              │ │
│  │    └── Popup Component                                 │ │
│  │          ├── Header (Theme, Settings, Panel, Close)    │ │
│  │          └── Prompt Component                          │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
               │ Click "📂 Panel"            │ Use in Popup
               │                              │
               ▼                              ▼
┌────────────────────────────┐   ┌────────────────────────────┐
│  Send Message:             │   │  Continue Using Popup      │
│  { type: "open_side_panel" }│   │  - Chat with AI            │
└────────────┬───────────────┘   │  - View conversation       │
             │                    │  - Toggle theme            │
             ▼                    │  - Access settings         │
┌────────────────────────────┐   └────────────────────────────┘
│  Background Service Worker │
│  Routes message            │
└────────────┬───────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│              SIDE PANEL OPENS (sidePanel.html)              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  ThemeProvider (✅ Fixed)                              │ │
│  │    └── SidePanel Component                             │ │
│  │          ├── Header (Theme, Settings, Expand, Close)   │ │
│  │          └── Prompt Component                          │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ✅ Same conversation history (chrome.storage.local)        │
│  ✅ Same theme preference (chrome.storage.sync)             │
│  ✅ Same API keys (chrome.storage.sync)                     │
└─────────────────────────────────────────────────────────────┘
```

## State Synchronization

```
┌──────────────────────────────────────────────────────────────┐
│                   Chrome Storage APIs                         │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  chrome.storage.sync (Syncs across devices)                  │
│  ├── theme: "dark" | "light"                                 │
│  ├── geminiApiKey: "encrypted-key"                           │
│  └── huggingfaceApiKey: "encrypted-key"                      │
│                                                               │
│  chrome.storage.local (Per-device storage)                   │
│  └── conversationHistory: [                                  │
│       {                                                       │
│         id: "uuid",                                           │
│         timestamp: 1234567890,                                │
│         userMessage: "Hello",                                 │
│         aiResponse: "Hi there!",                              │
│         embedding: [0.1, 0.2, ...]  // 384-dim vector        │
│       },                                                      │
│       ...                                                     │
│     ]                                                         │
└──────────────────────────────────────────────────────────────┘
         ▲                                    ▲
         │                                    │
    ┌────┴────┐                          ┌───┴────┐
    │  POPUP  │                          │  SIDE  │
    │         │ ◄────── Shared ────────► │  PANEL │
    └─────────┘         State            └────────┘
```

## Component Tree (Both Interfaces)

```
App (Entry Point)
└── ThemeProvider (Context)
    └── Popup | SidePanel
        ├── SetupScreen (if no API keys)
        │   └── API Key Configuration
        │
        ├── Settings (if settings clicked)
        │   ├── API Key Management
        │   ├── Export/Import Conversations
        │   └── Clear History
        │
        └── Main Interface
            ├── Header
            │   ├── Theme Toggle (☀️/🌙)
            │   ├── Settings Button (⚙️)
            │   ├── Panel Button (📂) [Popup only]
            │   ├── Expand Button (⛶) [Side Panel only]
            │   └── Close Button (✕)
            │
            └── Prompt Component
                ├── Welcome Screen (if empty)
                └── Chat Component
                    ├── Message List
                    │   ├── User Message
                    │   └── AI Response (Markdown)
                    └── Input Form
                        └── Enhanced with Semantic Search
```

## Message Flow

```
┌────────────┐                  ┌────────────┐                  ┌────────────┐
│   Popup    │                  │ Background │                  │    Side    │
│            │                  │  Worker    │                  │   Panel    │
└─────┬──────┘                  └──────┬─────┘                  └──────┬─────┘
      │                                │                               │
      │ open_side_panel                │                               │
      ├───────────────────────────────>│                               │
      │                                │ chrome.sidePanel.open()       │
      │                                ├──────────────────────────────>│
      │                                │                               │
      │                                │                         Opens │
      │                                │                      & Mounts │
      │                                │                               │
      │                    Both components read/write                  │
      │                    chrome.storage simultaneously               │
      │                                │                               │
      │◄───────────────────────────────┼───────────────────────────────┤
      │         Shared State           │       Shared State            │
      │    (Conversation History)      │   (Conversation History)      │
      │    (Theme Preference)          │   (Theme Preference)          │
      │    (API Keys)                  │   (API Keys)                  │
      │                                │                               │
```

## Error Handling Flow

```
User Action (Send Message)
    │
    ├── Check API Keys ──► Missing? ──► Show SetupScreen
    │                         │
    │                         └─► Configured? ──► Continue
    │
    ├── Enhance Prompt (Semantic Search)
    │   └── Fetch relevant context from history
    │
    ├── Call AI API
    │   ├── Success ──► Stream response ──► Update UI
    │   │
    │   └── Error ──┬──► Offline? ──► "No internet connection..."
    │               ├──► 429? ──► "Rate limit exceeded..."
    │               ├──► 401/403? ──► "Invalid API key..."
    │               └──► Other? ──► "Failed: [error message]"
    │
    └── Save to History (chrome.storage.local)
```

## Before vs After

### ❌ Before (Broken)
```
Click Icon → Side Panel Opens Directly
    │
    └──► 🔴 TypeError: Cannot read 'isDarkMode'
    └──► 🔴 White blank screen
    └──► 🔴 No popup option
```

### ✅ After (Fixed)
```
Click Icon → Popup Opens
    │
    ├──► ✅ ThemeProvider wraps component
    ├──► ✅ Renders correctly
    ├──► ✅ Full functionality
    │
    └──► Click "📂 Panel" → Side Panel Opens
             │
             ├──► ✅ ThemeProvider wraps component
             ├──► ✅ Renders correctly
             ├──► ✅ Maintains conversation state
             └──► ✅ Full functionality
```

---

## Key Fixes Summary

1. **ThemeProvider Wrapper** - Both `src/index.js` and `src/sidePanel.js` now wrap their root components in ThemeProvider
2. **Panel Behavior** - Changed `openPanelOnActionClick: false` to show popup first
3. **Shared State** - Both interfaces use same chrome.storage, ensuring seamless transitions
4. **User Control** - User chooses when to switch from popup to side panel
