# Setup Instructions

## Quick Start with pnpm

1. **Install pnpm globally** (if not already installed):

```bash
npm install -g pnpm
```

2. **Install dependencies**:

```bash
pnpm install
```

3. **Setup Husky git hooks**:

```bash
pnpm prepare
```

4. **Run the development server**:

```bash
pnpm dev
```

## What's Configured

### Prettier

- Code formatter configured with sensible defaults
- Runs automatically on pre-commit via lint-staged
- Configuration file: `.prettierrc`

### Husky

- Git hooks manager
- Pre-commit hook runs Prettier on staged files
- Configuration: `.husky/pre-commit`

### lint-staged

- Runs Prettier only on staged files
- Fast and efficient
- Configuration in `package.json`

### pnpm

- Fast, disk space efficient package manager
- `packageManager` field set in `package.json`
- Workspace configuration: `pnpm-workspace.yaml`

## Manual Setup (if needed)

If `pnpm prepare` doesn't work automatically, you can manually setup husky:

```bash
# Create .husky directory
mkdir .husky

# Make pre-commit executable (Linux/Mac)
chmod +x .husky/pre-commit

# On Windows, the file should already be executable
```

## Format Code Manually

```bash
# Format all files
pnpm format

# Check formatting without changing files
pnpm format:check
```

## Design Proposals

Check the `design-proposals/` folder for HTML mockups of different design options. Open them in your browser to preview.
