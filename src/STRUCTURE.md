# Project Structure

This document describes the folder structure and organization of the Master Test Generator project.

## Overview

The project follows a **feature-based architecture** with clear separation of concerns, making it easier to maintain, test, and scale.

## Directory Structure

```
src/
├── core/                    # Core functionality and shared business logic
│   ├── ai/                  # AI service integration
│   │   └── aiService.js      # AI service for test generation (Ollama, Hugging Face)
│   ├── analysis/            # Analysis and intelligence utilities
│   │   └── intelligentAnalyzer.js  # Intelligent analysis of project info and AC
│   └── constants/           # Application-wide constants
│       └── aiProviders.js   # AI provider constants
│
├── features/                # Feature modules (domain-driven)
│   ├── test-cases/          # Test Cases feature
│   │   ├── components/      # Feature-specific components (if any)
│   │   ├── generators/    # Test case generation logic
│   │   │   └── testCaseGenerator.js
│   │   └── utils/          # Test case utilities
│   │       └── csvExport.js
│   │
│   └── test-plans/          # Test Plans feature
│       ├── components/      # Feature-specific components
│       │   └── PlanTypeModal.vue
│       ├── generators/     # Test plan generation logic
│       │   └── testPlanGenerator.js
│       └── utils/          # Test plan utilities
│           └── testPlanExport.js
│
├── shared/                  # Shared resources across features
│   ├── components/         # Reusable UI components
│   │   ├── ExportPreview.vue
│   │   ├── NotificationToast.vue
│   │   └── OllamaStatus.vue
│   ├── composables/       # Reusable Vue composables
│   │   ├── useNotification.js
│   │   └── useTheme.js
│   └── data/              # Shared static data
│       └── patterns/
│           └── test-case-patterns.json
│
├── i18n/                   # Internationalization
│   └── index.js           # Translation messages
│
├── router/                 # Vue Router configuration
│   └── index.js
│
├── views/                  # Page-level components
│   ├── TestCases.vue
│   └── TestPlans.vue
│
├── App.vue                 # Root component
└── main.js                 # Application entry point
```

## Architecture Principles

### 1. **Feature-Based Organization**

- Each feature (`test-cases`, `test-plans`) is self-contained
- Features can have their own components, generators, and utilities
- Promotes modularity and makes features easier to understand

### 2. **Core vs Shared**

- **Core**: Business logic and services that are fundamental to the application
- **Shared**: Reusable UI components, composables, and data that multiple features use

### 3. **Separation of Concerns**

- **Generators**: Business logic for creating test cases/plans
- **Utils**: Helper functions and utilities
- **Components**: UI components
- **Composables**: Reusable Vue composition API logic

## Import Paths (Dynamic Aliases)

The project uses **dynamic path aliases** configured in `vite.config.js` to avoid breaking imports when moving files. All imports use absolute paths with aliases instead of relative paths.

### Available Aliases

- `@/` → `src/` (root)
- `@core/` → `src/core/`
- `@features/` → `src/features/`
- `@shared/` → `src/shared/`
- `@views/` → `src/views/`
- `@i18n/` → `src/i18n/`
- `@router/` → `src/router/`

### Core Modules

```javascript
// AI Service
import { initAIService, AI_PROVIDERS } from '@core/ai/aiService.js'

// Analysis
import { analyzeProjectInfo } from '@core/analysis/intelligentAnalyzer.js'

// Constants
import { AI_PROVIDERS } from '@core/constants/aiProviders.js'
```

### Feature Modules

```javascript
// Test Cases
import { generateTestCases } from '@features/test-cases/generators/testCaseGenerator.js'
import { exportToCSV } from '@features/test-cases/utils/csvExport.js'

// Test Plans
import { generateTestPlan } from '@features/test-plans/generators/testPlanGenerator.js'
import { exportTestPlanToPDF } from '@features/test-plans/utils/testPlanExport.js'
import PlanTypeModal from '@features/test-plans/components/PlanTypeModal.vue'
```

### Shared Resources

```javascript
// Components
import NotificationToast from '@shared/components/NotificationToast.vue'
import ExportPreview from '@shared/components/ExportPreview.vue'

// Composables
import { useNotification } from '@shared/composables/useNotification.js'
import { useTheme } from '@shared/composables/useTheme.js'

// Data
import testCasePatterns from '@shared/data/patterns/test-case-patterns.json'
```

### Views and Router

```javascript
// Views
import TestCases from '@views/TestCases.vue'
import TestPlans from '@views/TestPlans.vue'

// Router
import router from '@router/index.js'

// i18n
import { messages } from '@i18n/index.js'
```

### Benefits of Dynamic Aliases

✅ **No broken imports**: Moving files doesn't break imports  
✅ **Cleaner code**: No more `../../../` relative paths  
✅ **IDE support**: Better autocomplete and navigation  
✅ **Platform independent**: Works on Windows, Mac, and Linux  
✅ **Easier refactoring**: Move files without updating imports manually

## Adding New Features

When adding a new feature:

1. Create a new folder under `features/`
2. Organize by:
   - `components/` - Feature-specific components
   - `generators/` - Business logic
   - `utils/` - Helper functions
3. Use shared resources from `shared/` when possible
4. Keep core logic in `core/` if it's fundamental to the app

## Best Practices

1. **Keep features independent**: Features should not depend on each other
2. **Use shared resources**: Prefer `shared/` over duplicating code
3. **Core for fundamentals**: Only put truly core functionality in `core/`
4. **Clear naming**: Use descriptive names that indicate purpose
5. **Consistent structure**: Follow the same structure across features

## Benefits

- ✅ **Maintainability**: Easy to find and modify code
- ✅ **Scalability**: Easy to add new features
- ✅ **Testability**: Clear boundaries for testing
- ✅ **Team Collaboration**: Clear ownership and structure
- ✅ **Code Reuse**: Shared resources prevent duplication
