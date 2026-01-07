# 📁 Estructura del Proyecto - Master Test Generator

## 📂 Estructura de Carpetas

```
MasterTestgenerator/
├── 📁 src/                          # Código fuente principal
│   ├── 📁 core/                     # Lógica de negocio central
│   │   ├── 📁 ai/                   # Servicios de IA
│   │   │   └── aiService.js         # Integración con Ollama y Hugging Face
│   │   ├── 📁 analysis/             # Análisis inteligente
│   │   │   └── intelligentAnalyzer.js # Generación inteligente de test cases/plans
│   │   └── 📁 constants/            # Constantes de la aplicación
│   │       └── aiProviders.js       # Constantes de proveedores de IA
│   │
│   ├── 📁 features/                 # Módulos de funcionalidades
│   │   ├── 📁 test-cases/           # Feature: Generación de Test Cases
│   │   │   ├── 📁 components/       # Componentes específicos (vacío)
│   │   │   ├── 📁 generators/       # Lógica de generación
│   │   │   │   └── testCaseGenerator.js
│   │   │   └── 📁 utils/           # Utilidades
│   │   │       └── csvExport.js     # Exportación a CSV
│   │   │
│   │   └── 📁 test-plans/           # Feature: Generación de Test Plans
│   │       ├── 📁 components/       # Componentes específicos
│   │       │   └── PlanTypeModal.vue
│   │       ├── 📁 generators/      # Lógica de generación
│   │       │   └── testPlanGenerator.js
│   │       └── 📁 utils/            # Utilidades
│   │           └── testPlanExport.js # Exportación de test plans
│   │
│   ├── 📁 shared/                   # Recursos compartidos
│   │   ├── 📁 components/          # Componentes reutilizables
│   │   │   ├── ExportPreview.vue
│   │   │   ├── NotificationToast.vue
│   │   │   └── OllamaStatus.vue
│   │   ├── 📁 composables/         # Composables de Vue
│   │   │   ├── useNotification.js
│   │   │   └── useTheme.js
│   │   └── 📁 data/                # Datos estáticos
│   │       └── 📁 patterns/
│   │           └── test-case-patterns.json
│   │
│   ├── 📁 i18n/                     # Internacionalización
│   │   └── index.js                 # Mensajes de traducción (ES/EN)
│   │
│   ├── 📁 router/                   # Configuración de rutas
│   │   └── index.js
│   │
│   ├── 📁 views/                     # Vistas/páginas
│   │   ├── TestCases.vue            # Vista de generación de test cases
│   │   └── TestPlans.vue            # Vista de generación de test plans
│   │
│   ├── App.vue                       # Componente raíz
│   ├── main.js                       # Punto de entrada
│   └── STRUCTURE.md                  # Documentación de estructura
│
├── 📁 tests/                         # Tests unitarios
│   ├── intelligentAnalyzer.test.js   # Tests del analizador inteligente
│   └── setup.js                      # Configuración de tests
│
├── 📁 scripts/                       # Scripts de utilidad
│   ├── dev.js                        # Servidor de desarrollo
│   ├── dev-local-ai.js              # Dev con IA local
│   ├── dev-web-ai.js                # Dev con IA web
│   ├── install-ollama.js            # Instalación de Ollama
│   └── setup.js                      # Script de configuración inicial
│
├── 📁 public/                        # Archivos públicos
│   └── favicon.svg
│
├── 📁 dist/                          # Build de producción (generado)
│
├── vite.config.js                    # Configuración de Vite
├── package.json                      # Dependencias y scripts
├── README.md                         # Documentación principal
└── LICENSE                           # Licencia GPL v3
```

## 🎯 Organización por Capas

### 1. **Core** (`src/core/`)

Lógica de negocio fundamental y servicios centrales:

- **ai/**: Integración con servicios de IA
- **analysis/**: Análisis inteligente y generación
- **constants/**: Constantes globales

### 2. **Features** (`src/features/`)

Módulos de funcionalidades independientes:

- **test-cases/**: Generación de test cases
- **test-plans/**: Generación de test plans

Cada feature contiene:

- `components/`: Componentes específicos de la feature
- `generators/`: Lógica de generación
- `utils/`: Utilidades y helpers

### 3. **Shared** (`src/shared/`)

Recursos compartidos entre features:

- `components/`: Componentes reutilizables
- `composables/`: Lógica Vue reutilizable
- `data/`: Datos estáticos compartidos

### 4. **Views** (`src/views/`)

Componentes de página/vista:

- `TestCases.vue`: Página de test cases
- `TestPlans.vue`: Página de test plans

## 🔗 Aliases de Importación

Configurados en `vite.config.js`:

| Alias        | Ruta            |
| ------------ | --------------- |
| `@/`         | `src/`          |
| `@core/`     | `src/core/`     |
| `@features/` | `src/features/` |
| `@shared/`   | `src/shared/`   |
| `@views/`    | `src/views/`    |
| `@i18n/`     | `src/i18n/`     |
| `@router/`   | `src/router/`   |

## ✅ Estado Actual

### Carpetas con contenido:

- ✅ `src/core/` - Completo
- ✅ `src/features/test-cases/` - Completo (components/ vacío pero válido)
- ✅ `src/features/test-plans/` - Completo
- ✅ `src/shared/` - Completo
- ✅ `src/views/` - Completo
- ✅ `tests/` - Tests unitarios configurados

### Observaciones:

- 📁 `src/features/test-cases/components/` está vacía (esto es normal si no hay componentes específicos)
- ✅ Todos los aliases están configurados correctamente
- ✅ La estructura sigue el patrón feature-based
- ✅ Tests unitarios en `tests/` en la raíz

## 📊 Estadísticas

- **Total de archivos Vue**: 7
- **Total de archivos JS**: 20
- **Features**: 2 (test-cases, test-plans)
- **Tests unitarios**: 13 tests pasando
- **Componentes compartidos**: 3
- **Composables**: 2

## 🎨 Principios de Arquitectura

1. **Separación de responsabilidades**: Core, Features, Shared claramente separados
2. **Reutilización**: Componentes y composables compartidos
3. **Modularidad**: Features independientes y autocontenidas
4. **Escalabilidad**: Fácil agregar nuevas features
5. **Mantenibilidad**: Estructura clara y documentada

## 📝 Recomendaciones

La estructura actual está bien organizada. Si en el futuro necesitas:

- Agregar componentes específicos de test-cases, úsalos en `src/features/test-cases/components/`
- Agregar nuevas features, crea una nueva carpeta en `src/features/`
- Agregar más tests, agrégalos en `tests/` con el patrón `*.test.js`
