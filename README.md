# Master Test Generator

A Vue.js application for generating test plans and test cases in English and Spanish. Supports multiple export formats compatible with popular test management tools.

## Features

- **Test Plan Module**: Create and manage test plans
- **Test Case Module**: Generate test cases in two formats:
  - Step-by-step format
  - Gherkin format (Given-When-Then with Title Case)
- **AI-Powered Generation**:
  - 🤖 **Local AI** (Ollama) - Run AI models locally for privacy and offline use
  - 🌐 **Online AI** (Hugging Face) - Use cloud-based AI when internet is available
  - Intelligent fallback to rule-based generation
- **Multi-language Support**: English and Spanish
- **CSV Export**: Compatible with TestRail, Testmo, Jira, Zephyr, and other test management tools
- **Export Preview**: Preview how test cases will appear in the selected tool before exporting
- **Light/Dark Mode**: Beautiful themes with smooth transitions
- **Modern UI/UX**: Intuitive and responsive design

## Prerequisites

- Node.js 16+
- pnpm 8+ (recommended) or npm
- (Optional) Ollama for local AI - See [AI Integration](#ai-integration) section

## Installation

### Quick Setup (Recommended) 🚀

Run the automated setup script that installs everything:

**Using pnpm:**

```bash
pnpm setup
```

**Using npm:**

```bash
npm run setup
```

**Direct execution:**

```bash
# Windows
setup.bat

# Linux/macOS
./setup.sh

# Or directly with Node.js
node scripts/setup.js
```

**What the setup script does:**

- ✅ Checks Node.js version
- ✅ Installs pnpm globally if needed
- ✅ Installs all project dependencies
- ✅ Configures Git hooks (Husky)
- ✅ Checks Ollama installation (Local AI)
- ✅ Attempts to install AI model if Ollama is available
- ✅ Creates `.env` file with configuration template
- ✅ Provides installation guide for Ollama if not found

### Manual Installation

#### Using pnpm (Recommended)

```bash
# Install pnpm globally if you don't have it
npm install -g pnpm

# Install dependencies
pnpm install

# Setup husky for git hooks
pnpm prepare
```

#### Using npm

```bash
npm install
npm run prepare
```

## Development

### Standard Development Server

```bash
# Using pnpm
pnpm dev

# Using npm
npm run dev
```

### Development with Local AI (Ollama)

Runs the development server with Local AI (Ollama) pre-configured:

```bash
# Using pnpm
pnpm dev:local-ai

# Using npm
npm run dev:local-ai
```

This will:

- ✅ Check if Ollama is running
- ✅ Configure the app to use Local AI by default
- ✅ Show helpful messages if Ollama is not available

### Development with Web AI (Hugging Face)

Runs the development server with Web AI (Hugging Face) pre-configured:

```bash
# Using pnpm
pnpm dev:web-ai

# Using npm
npm run dev:web-ai
```

This will:

- ✅ Check for Hugging Face API key in `.env`
- ✅ Configure the app to use Web AI by default
- ✅ Use authenticated API if key is found (faster)
- ✅ Fallback to public endpoints if no key (slower, rate-limited)

The application will be available at `http://localhost:3000` (or next available port)

## Build

```bash
# Using pnpm
pnpm build

# Using npm
npm run build
```

## Code Formatting

This project uses Prettier for code formatting. Formatting runs automatically on pre-commit via husky and lint-staged.

### Format all files

```bash
pnpm format
```

### Check formatting

```bash
pnpm format:check
```

## Git Hooks

This project uses Husky to run Prettier on staged files before each commit. This ensures consistent code formatting across the project.

## AI Integration

This project supports AI-powered generation of test plans and test cases using two open-source solutions:

### 1. Local AI (Ollama) - Recommended for Privacy

**Ollama** is an open-source tool that runs large language models locally on your machine. This provides:

- ✅ Complete privacy (data never leaves your machine)
- ✅ Works offline
- ✅ No API costs
- ✅ Full control over models

**⚠️ Important:** Ollama is installed **system-wide** (like Node.js or Docker), not inside the project directory. This is because:

- Ollama runs as a system service on port 11434
- AI models are large (1-5GB) and stored in your user directory
- Multiple projects can share the same Ollama installation

**Model Storage Locations:**

- **Windows:** `%USERPROFILE%\.ollama` or `%LOCALAPPDATA%\ollama`
- **macOS/Linux:** `~/.ollama`

#### Installation

The setup script (`pnpm setup`) will attempt to install Ollama automatically. If it fails, install manually:

**Windows/macOS:**

1. Download from [ollama.com](https://ollama.com)
2. Install and run the application (system-wide installation)
3. Pull a model (recommended: `llama3.2:1b` for speed or `llama3.2:3b` for quality):
   ```bash
   ollama pull llama3.2:1b
   ```

**Linux:**

```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama3.2:1b
```

#### Usage

1. Start Ollama (usually runs automatically)
2. Verify it's running: `ollama list`
3. In the app, enable "Use AI Enhancement" and select "Local AI (Ollama)"
4. The app will automatically detect Ollama when available

**Recommended Models:**

- `llama3.2:1b` - Fast, small (~1.3GB), good for quick generation
- `llama3.2:3b` - Better quality (~2GB), balanced speed/quality
- `llama3.2` - Best quality (~4.7GB), slower but most accurate

### 2. Online AI (Hugging Face) - Recommended for Convenience

**Hugging Face Inference API** provides access to open-source AI models in the cloud:

- ✅ **No installation required** - It's a cloud service, nothing is installed
- ✅ Always up-to-date models
- ✅ Free tier available
- ⚠️ Requires internet connection
- ⚠️ Data sent to external service

**Note:** Hugging Face doesn't require any installation. Only an API key (optional) stored in the project's `.env` file.

#### Setup (Optional - for better performance)

1. Create a free account at [huggingface.co](https://huggingface.co)
2. Generate an API token from your [settings](https://huggingface.co/settings/tokens)
3. Create a `.env` file in the project root:
   ```env
   VITE_HUGGING_FACE_API_KEY=your_token_here
   ```
4. Restart the development server

**Without API Key:**
The app will use public endpoints (slower, rate-limited) but works without configuration.

#### Usage

1. Ensure you have internet connection
2. In the app, enable "Use AI Enhancement" and select "Online AI (Hugging Face)"
3. The app will automatically use Hugging Face models

### AI vs Rule-Based Generation

The app intelligently combines both approaches:

1. **AI Enhancement** (when enabled):
   - Uses AI models to generate more natural, context-aware test cases
   - Better understanding of complex requirements
   - More varied and creative test scenarios

2. **Rule-Based Fallback** (always available):
   - Fast, deterministic generation
   - Works offline
   - Based on pattern recognition and intelligent analysis
   - Automatically used if AI fails or is unavailable

### Troubleshooting

**Local AI (Ollama) not detected:**

- Ensure Ollama is running: `ollama list`
- Check if Ollama is on the default port (11434)
- Verify the model is downloaded: `ollama list`

**Online AI not working:**

- Check internet connection
- Verify Hugging Face API key in `.env` (if using)
- Check browser console for errors
- The app will automatically fallback to rule-based generation

**Getting help:**

- Run `node scripts/install-ollama.js` for installation help
- Check [Ollama documentation](https://github.com/ollama/ollama)
- Check [Hugging Face documentation](https://huggingface.co/docs/api-inference)

## Supported Test Management Tools

- TestRail
- Testmo
- Jira (Zephyr)
- Xray
- qTest
- PractiTest

## Project Structure

```
src/
├── components/        # Reusable components
├── views/            # Page components
├── utils/            # Utility functions
├── composables/      # Vue composables
├── i18n/             # Internationalization
└── router/           # Vue Router configuration
```

## Tech Stack

- **Vue.js 3** - Progressive JavaScript framework
- **Vue Router** - Official router for Vue.js
- **Vue I18n** - Internationalization plugin
- **PapaParse** - CSV parser/generator
- **Vite** - Next generation frontend tooling
- **Prettier** - Code formatter
- **Husky** - Git hooks made easy
- **lint-staged** - Run linters on git staged files
- **Ollama** - Local AI models (optional)
- **Hugging Face Inference API** - Online AI models (optional)

## License

GPL-3.0
