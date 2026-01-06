# 🧪 Master Test Generator

> **Generate test plans and test cases effortlessly** - A powerful Vue.js application that creates comprehensive test documentation in English and Spanish, with AI-powered assistance and seamless export to your favorite test management tools.

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
- **🧠 Smart Fallback**: Intelligent rule-based generation when AI isn't available

### 🌍 Multi-language Support

Generate test documentation in **English** or **Spanish**

### 📤 Export & Integration

- Export to **TestMO**, **TestRail**, **Jira**, **Zephyr**, and more
- **Preview before export** to see exactly how it will look
- CSV format compatible with all major test management tools

### 🎨 Beautiful UI

- **Light/Dark mode** with smooth transitions
- **Responsive design** - works perfectly on desktop, tablet, and mobile
- **Intuitive interface** - easy to use, even for beginners

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
   - **Step-by-Step**: Simple numbered steps
   - **Gherkin**: BDD format (Given-When-Then)
4. Select number of test cases per AC (1-5)
5. **Optional**: Enable AI enhancement for better results
6. Click **Generate Test Cases**
7. Preview export format and download CSV

### Exporting to Test Management Tools

1. Generate your test cases
2. Select your test management tool (TestMO, TestRail, Jira, etc.)
3. Click **Preview Export** to see how it will look
4. Click **Export CSV** to download
5. Import the CSV into your test management tool

---

## 🎨 Features in Detail

### Multiple Test Cases per AC

Generate **1 to 5 variations** of test cases for each acceptance criteria:

- Positive path scenarios
- Negative path scenarios
- Edge cases
- Alternative flows

### Intelligent Analysis

The app automatically:

- Detects functionality types (Authentication, CRUD, Validation, etc.)
- Identifies edge cases and boundary conditions
- Suggests missing test scenarios
- Calculates test complexity and estimates

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

---

## 📧 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review the documentation above
3. Open an issue on GitHub

---

**Made with ❤️ for the QA community**
