# Master Test Generator

A Vue.js application for generating test plans and test cases in English and Spanish. Supports multiple export formats compatible with popular test management tools.

## Features

- **Test Plan Module**: Create and manage test plans
- **Test Case Module**: Generate test cases in two formats:
  - Step-by-step format
  - Gherkin format (Given-When-Then with Title Case)
- **Multi-language Support**: English and Spanish
- **CSV Export**: Compatible with TestRail, Testmo, Jira, Zephyr, and other test management tools
- **Export Preview**: Preview how test cases will appear in the selected tool before exporting
- **Light/Dark Mode**: Beautiful themes with smooth transitions
- **Modern UI/UX**: Intuitive and responsive design

## Prerequisites

- Node.js 16+ 
- pnpm 8+ (recommended) or npm

## Installation

### Using pnpm (Recommended)

```bash
# Install pnpm globally if you don't have it
npm install -g pnpm

# Install dependencies
pnpm install

# Setup husky for git hooks
pnpm prepare
```

### Using npm

```bash
npm install
npm run prepare
```

## Development

```bash
# Using pnpm
pnpm dev

# Using npm
npm run dev
```

The application will be available at `http://localhost:3000`

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

## License

GPL-3.0
