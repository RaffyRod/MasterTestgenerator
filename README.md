# 🧪 Master Test Generator

> **Generate test plans and test cases effortlessly** - A powerful Vue.js application that creates comprehensive test documentation in English and Spanish, with AI-powered assistance and seamless export to your favorite test management tools.

**🌍 Language / Idioma:** [English](README.md) | [Español](README.es.md)

---

## ✨ Features

### 📋 Test Plan Generation

Create detailed test plans with different types (Functional, Performance, Security, Integration, and more)

### 📝 Test Case Generation

Generate test cases in two formats:

- **Step-by-Step**: Simple numbered steps for easy execution
- **Gherkin**: BDD format with Given-When-Then structure

### 🤖 AI-Powered Intelligence

- **🤖 Local AI (Ollama)**: Run AI models on your machine for complete privacy
- **🌐 Online AI (Hugging Face)**: Cloud-based AI when you need it
- **🔑 Custom AI Providers**: Configure your own AI providers (OpenAI GPT, Anthropic Claude, Google Gemini, Custom APIs) with API keys
- **🧠 Smart Fallback**: Intelligent rule-based generation when AI isn't available

### 🌍 Multi-language Support

Generate test documentation in **English** or **Spanish**

### 📤 Export & Integration

- Export to **TestMO**, **TestRail**, **Jira**, **Zephyr**, and more
- **Preview before export** to see exactly how it will look
- CSV format compatible with all major test management tools

### 🎨 Beautiful UI

- **Light/Dark mode** with smooth transitions
- **Fully responsive design** - optimized for desktop, tablet, and mobile devices
- **Touch-friendly interface** - 44px+ touch targets for mobile accessibility
- **Intuitive interface** - easy to use, even for beginners
- **Modern card-based layout** - clean, organized test case presentation
- **Grouped by Acceptance Criteria** - test cases organized by AC with collapsible sections
- **Accessibility-first design** - ARIA labels, keyboard navigation, screen reader support
- **Smooth animations** - polished transitions and micro-interactions
- **Mobile-optimized modals** - full-screen modals on mobile with slide-up animations
- **Smart notifications** - bottom-positioned toasts on mobile for better UX

### 🐛 Bug Report Generator

- **Comprehensive bug reporting** with detailed information fields
- **🤖 Dual AI Title Generation** - Automatically generates **2 title options** from different AI providers (Primary AI + Groq AI) for you to choose the best one
- **🎯 Smart Title Selection** - Beautiful modal UI to select between AI-generated titles with source indicators
- **AI-powered content generation** - Automatically generates steps to reproduce, expected/actual results
- **Evidence attachment** - Upload images, logs, and text files with drag & drop support
- **Multiple export formats** - Jira, Markdown, and Plain Text with HTML tag cleaning
- **Auto-detection** of browser and operating system
- **Copy to clipboard** for easy pasting into issue trackers
- **Beautiful UI/UX** - Progress indicators, real-time validation, visual badges, and collapsible sections
- **Smart form validation** - Real-time feedback with visual indicators
- **Title length limit** - Automatically enforces 30-character maximum for concise bug titles

---

## 🛠️ Tech Stack

This project is built with amazing open-source technologies. We're grateful to all the contributors and maintainers:

### Core Framework

- **[Vue.js 3](https://vuejs.org/)** - Progressive JavaScript framework for building user interfaces
- **[Vue Router](https://router.vuejs.org/)** - Official router for Vue.js
- **[Vue I18n](https://vue-i18n.intlify.dev/)** - Internationalization plugin for Vue.js

### Build Tools & Development

- **[Vite](https://vitejs.dev/)** - Next-generation frontend build tool
- **[Vitest](https://vitest.dev/)** - Fast unit test framework powered by Vite
- **[Prettier](https://prettier.io/)** - Opinionated code formatter
- **[Husky](https://typicode.github.io/husky/)** - Git hooks made easy

### Testing & Quality

- **[Vitest](https://vitest.dev/)** - Fast unit test framework
- **[@vitest/coverage-v8](https://vitest.dev/guide/coverage.html)** - Code coverage reporting
- **[@vue/test-utils](https://test-utils.vuejs.org/)** - Utilities for testing Vue components
- **[Testing Library](https://testing-library.com/)** - Simple and complete testing utilities
- **GitHub Actions CI/CD** - Automated testing on every push and pull request
- **Unit Tests** - Comprehensive test coverage for AI generation and core functionality

### Data Processing

- **[PapaParse](https://www.papaparse.com/)** - Powerful CSV parser for JavaScript
- **[jsPDF](https://github.com/parallax/jsPDF)** - Client-side PDF generation
- **[docx](https://github.com/dolanmiu/docx)** - Easily generate .docx files

### AI Integration

- **[Ollama](https://ollama.com/)** - Run large language models locally
- **[Hugging Face](https://huggingface.co/)** - AI community and platform
- **[Groq API](https://groq.com/)** - Fast, free AI inference for dual title generation (bug reports)
- **[OpenAI API](https://platform.openai.com/)** - GPT models for AI-powered generation (configurable via UI)
- **[Anthropic Claude](https://www.anthropic.com/)** - Claude AI models (configurable via UI)
- **[Google Gemini](https://ai.google.dev/)** - Google's AI models (configurable via UI)
- **Custom API Providers** - Configure any AI provider with custom endpoints
- **Dual AI System** - Bug report titles use two AI providers in parallel for better options

### Additional Tools

- **[jsdom](https://github.com/jsdom/jsdom)** - Pure JavaScript DOM implementation for testing

---

## 🙏 Acknowledgments

We would like to thank all the open-source contributors and maintainers of the technologies used in this project. Your work makes projects like this possible!

---

## 🚀 Quick Start (Super Easy!)

### ⚡ One-Command Setup - Installs Everything Automatically!

**That's it! Just run one command and everything will be installed automatically:**

```bash
pnpm setup
```

**Or if you prefer npm:**

```bash
npm run setup
```

**On Windows, you can also double-click:**

```
setup.bat
```

**On Linux/macOS:**

```bash
./setup.sh
```

### 🎯 What the Setup Does Automatically

The setup script will **automatically**:

- ✅ Check and install Node.js (if needed)
- ✅ Install pnpm package manager
- ✅ Install all project dependencies
- ✅ Configure Git hooks (Prettier formatting)
- ✅ **Install Ollama (Local AI)** - automatically downloads and sets up
- ✅ **Download AI models** - pulls the recommended model (llama3.2:1b)
- ✅ Create environment files
- ✅ Verify everything is working

**You don't need to do anything else!** Just run the setup and you're ready to go. 🎉

### 📋 Prerequisites

The setup will check and install these for you, but if you want to install manually:

- **Node.js 16+** - [Download here](https://nodejs.org/)
- **pnpm 8+** (recommended) or npm - Will be installed automatically by setup

> 💡 **Tip**: The setup script handles everything, including Ollama installation. You don't need to install anything manually!

---

## 🛠️ Development

### Start the Development Server

After running `pnpm setup`, start developing:

```bash
pnpm dev
```

The server will automatically find an available port (3000-7000) and start at `http://localhost:3000`

### 🤖 Development with Local AI (Ollama)

Runs the development server with Local AI pre-configured:

```bash
pnpm dev:local-ai
```

This will:

- ✅ Check if Ollama is running
- ✅ Configure the app to use Local AI by default
- ✅ Show helpful messages if Ollama is not available

### 🌐 Development with Web AI (Hugging Face)

Runs the development server with Web AI pre-configured:

```bash
pnpm dev:web-ai
```

This will:

- ✅ Check for Hugging Face API key in `.env`
- ✅ Configure the app to use Web AI by default
- ✅ Use authenticated API if key is found (faster)
- ✅ Fallback to public endpoints if no key (slower, rate-limited)

---

## 🤖 AI Integration

This project supports AI-powered generation using two open-source solutions. **The setup script installs everything automatically!**

### 🎯 Quick AI Setup

**Good news!** The `pnpm setup` command automatically:

- ✅ Installs Ollama (Local AI) on your system
- ✅ Downloads the recommended AI model (llama3.2:1b)
- ✅ Configures everything to work out of the box

**You don't need to do anything manually!** Just run `pnpm setup` and AI will be ready to use.

---

### 1. 🤖 Local AI (Ollama) - Recommended for Privacy

**Ollama** runs AI models locally on your machine. Perfect for:

- 🔒 **Complete privacy** - Your data never leaves your computer
- 📴 **Works offline** - No internet required after setup
- 💰 **No API costs** - Completely free
- 🎛️ **Full control** - Choose your models and settings

#### 📍 Installation Location

Ollama is installed **system-wide** (like Node.js or Docker), not in the project folder. This means:

- ✅ One installation works for all your projects
- ✅ Models are stored in your user directory
- ✅ Easy to manage and update

**Model Storage:**

- **Windows:** `%USERPROFILE%\.ollama`
- **macOS/Linux:** `~/.ollama`

#### 🚀 Automatic Installation

The setup script (`pnpm setup`) **automatically installs Ollama** for you:

- **Windows**: Downloads and installs via winget or direct download
- **macOS**: Uses Homebrew if available, or downloads installer
- **Linux**: Runs the official installation script

**If automatic installation fails** (rare), you can install manually:

**Windows/macOS:**

1. Download from [ollama.com](https://ollama.com)
2. Run the installer
3. The setup script will then download the AI model for you

**Linux:**

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

#### ✅ Using Local AI

After running `pnpm setup`, Ollama is ready to use:

1. **Start the app**: `pnpm dev:local-ai` (or regular `pnpm dev`)
2. **In the app**: Enable "Use AI Enhancement" and select "💻 Local AI (Ollama)"
3. **That's it!** The app automatically detects Ollama

**Recommended Models** (setup installs `llama3.2:1b` by default):

- `llama3.2:1b` - ⚡ Fast, small (~1.3GB) - **Installed by default**
- `llama3.2:3b` - 🎯 Better quality (~2GB) - Run `ollama pull llama3.2:3b` if you want
- `llama3.2` - 🏆 Best quality (~4.7GB) - Run `ollama pull llama3.2` for maximum quality

---

### 2. 🌐 Online AI (Hugging Face) - No Installation Needed

**Hugging Face** provides cloud-based AI - perfect if you don't want to install anything locally:

- ✅ **Zero installation** - It's a cloud service
- ✅ Always up-to-date models
- ✅ Free tier available
- ⚠️ Requires internet connection
- ⚠️ Data sent to external service

#### 🚀 Using Online AI

**No setup needed!** Just:

1. Start the app: `pnpm dev:web-ai` (or regular `pnpm dev`)
2. In the app: Enable "Use AI Enhancement" and select "🌐 Online AI (Hugging Face)"
3. **Optional**: Add your API key to `.env` for better performance:
   ```env
   VITE_HUGGING_FACE_API_KEY=your_token_here
   ```
   Get your free token at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)

**Without API key**: Works fine, but uses public endpoints (slower, rate-limited)

---

## 📚 Usage Guide

### Generating Test Plans

1. Navigate to the **Test Plans** section
2. Enter your project information or acceptance criteria
3. Select the test plan type (Functional, Performance, Security, etc.)
4. Click **Generate Test Plan**
5. Review the generated plan with recommendations and analysis
6. Export if needed

### Generating Test Cases

1. Navigate to the **Test Cases** section
2. Enter your acceptance criteria or project information
3. Choose format:
   - **Step-by-Step**: Simple numbered steps with specific actions
   - **Gherkin**: BDD format (Given-When-Then) in title case
4. Select number of test cases per AC (1-5)
   - Each variation generates unique steps (Positive, Negative, Edge Case, Alternative Flow)
5. **Optional**: Enable AI enhancement and select your preferred AI provider
6. Click **Generate Test Cases**
7. Test cases are automatically **grouped by Acceptance Criteria** with collapsible sections
8. **Copy individual test cases** with the copy button on each card
9. Preview export format and download CSV

### Configuring AI Providers

1. Click the **⚙️ Configuration** icon in the header
2. Select **🤖 AI Configuration**
3. Choose your AI provider:
   - **Local AI (Ollama)** - No API key needed
   - **Online AI (Hugging Face)** - Optional API key for better performance
   - **OpenAI GPT** - Requires API key
   - **Anthropic Claude** - Requires API key
   - **Google Gemini** - Requires API key
   - **Custom API** - Configure your own endpoint
4. Enter your API key (if required)
5. Select the model you want to use
6. Click **Save Configuration**
7. Your AI provider will be used for test case and bug report generation

### Generating Bug Reports

1. Navigate to the **🐛 Bug Report** section
2. Enter the bug **Description** (required) - **Title is auto-generated!**
3. **🤖 Dual AI Title Generation**: The app automatically generates **2 title options** from different AI providers:
   - **Primary AI**: Uses your configured AI provider (Ollama, Hugging Face, etc.)
   - **Groq AI**: Fast, free alternative for comparison
   - A modal will appear to let you **select the best title**
4. Select **Priority** and **Severity** from dropdowns
5. **Optional**: Expand "Optional Information" to add environment details (auto-detected by default)
6. **Upload evidence** - Drag & drop or click to upload images, logs, or text files
7. **Enable AI** (default) to automatically generate:
   - Steps to Reproduce
   - Expected Result
   - Actual Result
   - Additional Information
8. Click **🚀 Generate Bug**
9. Select export format (Jira, Markdown, or Plain Text)
10. Click **📋 Copy** to copy the formatted report to clipboard

### Exporting to Test Management Tools

1. Generate your test cases
2. Select your test management tool (TestMO, TestRail, Jira, etc.)
3. Click **Preview Export** to see how it will look
4. Click **Export CSV** to download
5. Import the CSV into your test management tool

---

## 🎨 Features in Detail

### Smart Test Case Generation

The app generates **intelligent, specific test cases** that:

- ✅ Extract entities from acceptance criteria (e.g., "province", "branch", "user")
- ✅ Create contextual steps based on detected actions (click, view, create, etc.)
- ✅ Generate clear, readable expected results from AC text
- ✅ Avoid generic placeholder text
- ✅ Always default to "Functional" test type (unless explicitly specified)
- ✅ Group test cases by Acceptance Criteria for better organization

### Responsive Design

The UI is fully optimized for all devices:

- **Desktop**: Multi-column grid layout, hover effects, spacious cards, smooth animations
- **Tablet**: Adaptive grid, touch-optimized controls, responsive modals
- **Mobile**: Single column, large touch targets (44px+), collapsible sections, bottom-positioned notifications
- **Accessibility**: Proper ARIA labels, keyboard navigation, screen reader support, focus management
- **Mobile Menu**: Smooth slide-down animation, auto-close on outside click
- **Modals**: Full-screen on mobile with slide-up animation, focus trapping, keyboard support

### Multiple Test Cases per AC

Generate **1 to 5 variations** of test cases for each acceptance criteria:

- **Base case**: Concise, focused test case
- **Positive path**: Comprehensive detailed scenarios
- **Negative path**: Error handling and validation scenarios
- **Edge cases**: Boundary conditions and edge scenarios
- **Alternative flows**: Different approaches to achieve the same goal

Each variation has **unique, specific steps** - no duplicate generic steps!

### Intelligent Analysis

The app automatically:

- Detects functionality types (Authentication, CRUD, Validation, etc.)
- Identifies edge cases and boundary conditions
- Suggests missing test scenarios
- Calculates test complexity and estimates
- **Generates specific, actionable steps** - No more generic "Navigate to application" steps
- **Creates clear expected results** - Extracts and formats expected results from acceptance criteria
- **Smart test case grouping** - Automatically groups test cases by Acceptance Criteria

### Export Formats

Compatible with:

- 🧪 **TestMO** - Multi-row format with HTML formatting
- 🚂 **TestRail** - Standard CSV format
- 🎯 **Jira (Zephyr)** - Compatible with Zephyr test management
- 🔍 **Xray** - Full Xray compatibility
- 📊 **qTest** - qTest import format
- ✅ **PractiTest** - PractiTest CSV format

---

## 🛠️ Development

### Build for Production

```bash
pnpm build
```

This creates an optimized production build in the `dist/` folder.

### Running Tests

```bash
# Run tests in watch mode
pnpm test

# Run tests once
pnpm test:run

# Run tests with coverage
pnpm test:coverage
```

### Code Formatting

This project uses **Prettier** for consistent code style. Formatting runs **automatically** on every commit (thanks to Husky).

**Manual formatting:**

```bash
# Format all files
pnpm format

# Check formatting (without changing files)
pnpm format:check
```

### Git Hooks

**Prettier runs automatically** before each commit to ensure consistent code formatting. No need to run it manually!

### CI/CD with GitHub Actions

This project includes **automated CI/CD** that runs on every push and pull request:

- ✅ **Automated Testing** - Runs all unit tests on Node.js 18.x and 20.x
- ✅ **Code Formatting Check** - Validates code style consistency
- ✅ **Build Verification** - Ensures the project builds successfully
- ✅ **Coverage Reports** - Generates test coverage reports

The CI pipeline is configured in `.github/workflows/ci.yml` and runs automatically for:
- Every push to `main` branch
- Every pull request targeting `main` branch

**No action needed** - it runs automatically! 🎉

---

## 🐛 Troubleshooting

### Ollama Not Available?

1. **Check if Ollama is running:**

   ```bash
   ollama list
   ```

2. **If not installed**, run the setup again:

   ```bash
   pnpm setup
   ```

3. **If installed but not detected**, restart your terminal and try again

### Port Already in Use?

The dev server automatically finds an available port (3000-7000). No action needed!

### Export Issues?

- Make sure you've generated test cases first
- Check that you've selected a test management tool
- Verify the preview looks correct before exporting

---

## 📝 License

This project is licensed under the GNU General Public License Version 3 - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Workflow

1. **Fork the repository** and create a feature branch
2. **Make your changes** following the code style (Prettier will format automatically)
3. **Write or update tests** for new functionality
4. **Run tests** to ensure everything passes: `pnpm test:run`
5. **Commit your changes** (Prettier will format on commit)
6. **Push to your fork** and create a Pull Request
7. **CI/CD will automatically run** tests and validate your changes

### Testing Requirements

- All new features should include unit tests
- Tests must pass before merging
- Coverage reports are generated automatically in CI/CD

---

## 📧 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review the documentation above
3. Open an issue on GitHub

---

**Made with ❤️ for the QA community**
