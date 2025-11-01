# Chrome Assistant 🤖

> An intelligent Chrome extension powered by Google's Gemini AI that provides real-time conversational assistance directly in your browser.

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://reactjs.org/)
[![Webpack](https://img.shields.io/badge/Webpack-5.93.0-8DD6F9?logo=webpack)](https://webpack.js.org/)

## 📖 What is Chrome Assistant?

Chrome Assistant is a browser extension that brings the power of Google's Gemini AI directly into your Chrome browsing experience. It provides an intelligent chat interface through both a popup window and a side panel, allowing you to get instant answers, summaries, code help, and creative assistance without leaving your browser.

Think of it as your personal AI companion that lives in your browser—always ready to help with research, writing, coding, or simply answering questions while you browse.

## ✨ Key Features

- **💬 Real-time AI Chat** - Stream responses from Gemini AI with markdown support
- **🎨 Dual Interface** - Access via popup (Ctrl+Shift+0) or expandable side panel
- **🌓 Dark/Light Theme** - Beautiful, customizable themes with persistent preferences
- **📝 Markdown Rendering** - Rich text formatting with syntax highlighting for code
- **💾 Conversation Memory** - Maintains chat history across sessions
- **🎯 Context-Aware** - Uses embeddings for semantic search through conversation history
- **⚡ Streaming Responses** - See AI responses as they're generated in real-time
- **🔧 Chrome Integration** - Deep integration with Chrome APIs for seamless experience

## 🏗️ Architecture Overview

### Project Structure

```
Chrome-Assistant/
├── public/                    # Static assets & extension files
│   ├── manifest.json         # Chrome extension manifest (v3)
│   ├── background.js         # Service worker for extension lifecycle
│   ├── content.js            # Content script for page interaction
│   ├── key.js               # API key configuration
│   ├── index.html           # Popup entry point
│   └── sidePanel.html       # Side panel entry point
├── src/
│   ├── components/          # React components
│   │   ├── Chat.js         # Chat message display
│   │   ├── MarkdownRender.js  # Markdown & code highlighting
│   │   ├── Popup.js        # Main popup interface
│   │   ├── Prompt.js       # Input & chat logic
│   │   ├── sidepanel.js    # Side panel interface
│   │   ├── ThemeContext.js # Theme management
│   │   └── welcome.js      # Welcome screen
│   ├── utilities/          # Helper functions
│   │   ├── chromeApiUtilities.js  # Chrome API wrappers
│   │   ├── Embedding.js    # HuggingFace embeddings
│   │   ├── getAiModal.js   # Gemini AI initialization
│   │   └── promptsResponse.js  # AI response streaming
│   ├── index.js            # Popup entry point
│   ├── sidePanel.js        # Side panel entry point
│   └── index.css           # Global styles
├── webpack.config.js       # Build configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
└── package.json           # Dependencies & scripts
```

### Component Architecture

```
┌─────────────────────────────────────┐
│       Chrome Extension APIs          │
│  (Background, Tabs, Storage, etc.)   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Background Service Worker       │
│  • Message routing                   │
│  • Conversation memory               │
│  • Side panel management             │
└──────────────┬──────────────────────┘
               │
        ┌──────┴──────┐
        │             │
┌───────▼─────┐  ┌───▼──────────┐
│   Popup UI  │  │  Side Panel  │
│  (700px)    │  │  (Expandable)│
└───────┬─────┘  └───┬──────────┘
        │            │
        └──────┬─────┘
               │
┌──────────────▼──────────────────────┐
│        Shared Components             │
│  • Prompt (input handler)            │
│  • Chat (message display)            │
│  • MarkdownRenderer                  │
│  • ThemeContext                      │
└──────────────┬──────────────────────┘
               │
        ┌──────┴──────┐
        │             │
┌───────▼─────┐  ┌───▼──────────────┐
│  Gemini AI  │  │  HuggingFace     │
│  (Gemini    │  │  (Embeddings for │
│   1.5 Pro)  │  │   semantic search)│
└─────────────┘  └──────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI framework
- **Tailwind CSS 3.4.6** - Utility-first styling
- **React Markdown** - Markdown rendering with GFM support
- **React Syntax Highlighter** - Code syntax highlighting
- **Material-UI (Emotion)** - Styled components

### AI & ML
- **Google Generative AI (Gemini 1.5 Pro)** - Main AI model
- **HuggingFace Inference** - Text embeddings (e5-small-v2 model)

### Build Tools
- **Webpack 5.93.0** - Module bundler
- **Babel** - JavaScript transpiler
- **PostCSS & Autoprefixer** - CSS processing

### Chrome APIs
- `chrome.runtime` - Message passing & extension lifecycle
- `chrome.storage` - Persistent data storage
- `chrome.sidePanel` - Side panel management
- `chrome.tabs` - Tab interactions
- `chrome.scripting` - Content script injection

## 🚀 Local Setup & Installation

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Google Chrome** browser
- **Gemini API Key** ([Get it here](https://makersuite.google.com/app/apikey))

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/NotGyashu/Chrome-Assistant.git
   cd Chrome-Assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Key**
   
   Create a `public/key.js` file with your Gemini API key:
   ```javascript
   const codeKey = "YOUR_GEMINI_API_KEY_HERE";
   ```
   
   > ⚠️ **Security Note**: Never commit `key.js` to version control. It's already in `.gitignore`.

4. **Build the extension**
   ```bash
   npm run build
   ```
   
   This creates a production build in the `dist/` directory.

5. **Load the extension in Chrome**
   
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable **Developer mode** (toggle in top-right corner)
   - Click **Load unpacked**
   - Select the `dist/` folder from your project directory
   - The extension should now appear in your extensions list

## 🎮 How to Run the Project

### Development Mode

For live development with hot reloading:

```bash
npm start
```

This starts the webpack dev server at `http://localhost:8080`. Note: You'll still need to load the extension in Chrome manually.

### Production Build

```bash
npm run build
```

Generates optimized production files in `dist/` directory.

### Using the Extension

1. **Popup Interface**
   - Click the extension icon in Chrome toolbar, or
   - Use keyboard shortcut: `Ctrl+Shift+0` (Windows/Linux) or `Cmd+Shift+0` (Mac)

2. **Side Panel**
   - Click the "📂 Panel" button in the popup to expand to side panel
   - Provides more screen space for longer conversations

3. **Starting a Conversation**
   - Type your question or prompt in the input field
   - Press Enter or click the send button (➤)
   - Watch as AI responses stream in real-time

4. **Theme Toggle**
   - Click "☀️ Light" or "🌙 Dark" button to switch themes
   - Theme preference is saved locally

## ⚙️ Configuration

### Environment Variables

The extension primarily uses a single configuration file:

**`public/key.js`** (create this file):
```javascript
const codeKey = "YOUR_GEMINI_API_KEY_HERE";
```

### Customizing AI Behavior

Edit `src/utilities/getAiModal.js` to adjust:

```javascript
const generationConfig = {
  temperature: 1,      // Creativity (0.0 - 2.0)
  topP: 0.95,         // Nucleus sampling
  topK: 64,           // Top-K sampling
};
```

### Modifying Permissions

Edit `public/manifest.json` to add/remove Chrome permissions:

```json
{
  "permissions": [
    "activeTab",
    "scripting",
    "tabs",
    "storage",
    "sidePanel",
    "contextMenus"
  ]
}
```

## 🎨 Customizing Themes

Themes are configured in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      theme: {
        light: {
          primary: '#2563EB',
          secondary: '#BFDBFE',
          background: '#F8FAFC',
          text: '#1E293B',
          accent: '#1D4ED8',
          error: '#DC2626'
        },
        dark: {
          primary: '#1D4ED8',
          secondary: '#1E3A8A',
          background: '#0F172A',
          text: '#F8FAFC',
          accent: '#60A5FA',
          error: '#EF4444'
        }
      }
    }
  }
}
```

## 📊 Performance Notes

### Streaming Responses
- Uses **async generators** for real-time streaming from Gemini API
- Average response latency: **~500ms** for first token
- Full response time depends on complexity and length

### Memory Management
- Conversation history stored in **chrome.storage.local** (up to 10MB)
- Embeddings cached for semantic similarity search
- Background service worker auto-sleeps when inactive

### Optimization Tips
- Responses are streamed chunk-by-chunk to reduce perceived latency
- Markdown rendering is optimized with React memoization
- Tailwind CSS purges unused styles in production build

## 🗺️ Roadmap & Future Improvements

### Upcoming Features
- [ ] **Multi-tab Context** - Analyze content from multiple tabs
- [ ] **Voice Input** - Speech-to-text for hands-free interaction
- [ ] **Export Conversations** - Save chats as PDF/Markdown
- [ ] **Custom Prompts** - User-defined prompt templates
- [ ] **Web Search Integration** - Enhance responses with real-time web data
- [ ] **Model Selection** - Switch between different AI models
- [ ] **Collaborative Features** - Share conversations with others

### Enhancements
- [ ] Improve context window management for longer conversations
- [ ] Add support for image analysis (Gemini Vision)
- [ ] Implement conversation branching/forking
- [ ] Add keyboard shortcuts for common actions
- [ ] Better error handling and retry mechanisms
- [ ] Add usage analytics dashboard

### Technical Improvements
- [ ] Migrate to Manifest V3 best practices
- [ ] Add comprehensive unit tests (Jest + React Testing Library)
- [ ] Implement proper TypeScript support
- [ ] Add end-to-end tests (Playwright)
- [ ] Optimize bundle size (code splitting)
- [ ] Add CI/CD pipeline for automated releases

## 🤝 Contribution Guidelines

We welcome contributions! Here's how you can help:

### Getting Started

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit with clear messages**
   ```bash
   git commit -m "Add: Amazing new feature"
   ```
5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Code Style

- Use **ES6+** syntax
- Follow **React best practices** (hooks, functional components)
- Use **Tailwind CSS** for styling (avoid inline styles)
- Write **descriptive variable names**
- Add **comments** for complex logic
- Keep components **small and focused**

### Commit Message Convention

```
Type: Brief description

Types:
- Add: New feature
- Fix: Bug fix
- Update: Modify existing feature
- Remove: Delete feature/code
- Refactor: Code restructuring
- Docs: Documentation changes
- Style: Formatting changes
```

### Testing

Before submitting:
- [ ] Test in both light and dark themes
- [ ] Verify popup and side panel work correctly
- [ ] Check console for errors
- [ ] Test with different prompt types
- [ ] Ensure build succeeds: `npm run build`

### Areas We Need Help

- 📖 Improving documentation
- 🐛 Bug fixes and testing
- 🎨 UI/UX enhancements
- 🌐 Internationalization (i18n)
- ♿ Accessibility improvements
- 🧪 Writing tests

## 📄 License

This project is licensed under the **ISC License**.

```
ISC License

Copyright (c) 2024 Gyashu Rahman

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```

## 🙏 Credits & Acknowledgements

### Technologies & Libraries

- **[Google Generative AI](https://ai.google.dev/)** - Gemini AI model
- **[HuggingFace](https://huggingface.co/)** - Text embeddings
- **[React](https://react.dev/)** - UI framework
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling
- **[Marked.js](https://marked.js.org/)** - Markdown parsing
- **[React Syntax Highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter)** - Code highlighting

### Author

**Gyashu Rahman** ([@NotGyashu](https://github.com/NotGyashu))

### Special Thanks

- The Chrome Extensions team for excellent documentation
- The open-source community for amazing tools and libraries
- Everyone who tests and provides feedback

---

<div align="center">

**Made with ❤️ by [Gyashu Rahman](https://github.com/NotGyashu)**

If you find this helpful, please ⭐ star the repo!

[Report Bug](https://github.com/NotGyashu/Chrome-Assistant/issues) · [Request Feature](https://github.com/NotGyashu/Chrome-Assistant/issues) · [Contribute](https://github.com/NotGyashu/Chrome-Assistant/pulls)

</div>
