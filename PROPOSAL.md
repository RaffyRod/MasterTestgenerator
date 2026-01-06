# Propuesta: Master Test Generator

## Resumen Ejecutivo

Aplicación web desarrollada en Vue.js 3 para generar planes de prueba y casos de prueba a partir de información de proyectos o criterios de aceptación. La aplicación soporta múltiples idiomas (inglés y español) y permite exportar los casos de prueba en formatos CSV compatibles con las principales herramientas de gestión de pruebas del mercado.

## Características Principales

### 1. Módulo de Planes de Prueba
- Generación automática de planes de prueba estructurados
- Incluye:
  - Objetivos de prueba
  - Alcance (In Scope / Out of Scope)
  - Estrategia de prueba
  - Elementos de prueba
  - Recursos necesarios
  - Cronograma de ejecución
  - Riesgos y mitigación
- Exportación en formato JSON

### 2. Módulo de Casos de Prueba
- Generación de casos de prueba a partir de información del proyecto
- Dos formatos disponibles:
  - **Paso a Paso**: Formato tradicional con pasos numerados
  - **Gherkin**: Formato BDD con sintaxis Given-When-Then usando Title Case
- Extracción automática de:
  - Título del caso de prueba
  - Prioridad (High, Medium, Low)
  - Precondiciones
  - Pasos de prueba
  - Resultado esperado

### 3. Soporte Multiidioma
- Interfaz completamente traducida en inglés y español
- Cambio de idioma en tiempo real
- Persistencia de preferencia de idioma
- Contenido generado en el idioma seleccionado

### 4. Exportación CSV Compatible
- Soporte para múltiples herramientas de gestión de pruebas:
  - **TestRail**: Formato estándar con columnas Title, Type, Priority, Preconditions, Steps, Expected
  - **Testmo**: Formato flexible con mapeo de columnas personalizado
  - **Jira (Zephyr)**: Compatible con estructura de Jira
  - **Xray**: Formato específico para Xray
  - **qTest**: Formato compatible con qTest
  - **PractiTest**: Formato estándar de PractiTest

### 5. Vista Previa de Exportación
- Visualización previa del formato CSV antes de descargar
- Muestra columnas y primeras 5 filas
- Información sobre el formato seleccionado
- Confirmación antes de descargar

## Arquitectura Técnica

### Stack Tecnológico
- **Vue.js 3**: Framework principal con Composition API
- **Vue Router**: Navegación entre módulos
- **Vue I18n**: Internacionalización
- **PapaParse**: Generación y parsing de CSV
- **Vite**: Build tool y dev server

### Estructura del Proyecto
```
src/
├── components/
│   └── ExportPreview.vue      # Componente de vista previa
├── views/
│   ├── TestPlans.vue          # Vista de planes de prueba
│   └── TestCases.vue          # Vista de casos de prueba
├── utils/
│   ├── csvExport.js           # Utilidades de exportación CSV
│   ├── testCaseGenerator.js   # Generador de casos de prueba
│   └── testPlanGenerator.js   # Generador de planes de prueba
├── i18n/
│   └── index.js               # Traducciones
├── router/
│   └── index.js               # Configuración de rutas
├── App.vue                    # Componente principal
└── main.js                    # Punto de entrada
```

## Mejores Prácticas Implementadas

### Formato Gherkin
- Uso de Title Case para keywords (Given, When, Then)
- Estructura clara Given-When-Then
- Legibilidad mejorada para stakeholders técnicos y no técnicos
- Compatible con herramientas de BDD como Cucumber

### Generación de Casos de Prueba
- Extracción inteligente de información relevante
- Detección automática de prioridad basada en keywords
- Generación de precondiciones contextuales
- Formato consistente y profesional

### Exportación CSV
- Formatos específicos para cada herramienta
- Mapeo correcto de columnas
- Compatibilidad con importación directa
- Manejo de caracteres especiales

## Flujo de Usuario

### Generar Plan de Prueba
1. Usuario ingresa información del proyecto o criterios de aceptación
2. Hace clic en "Generar Plan de Prueba"
3. El sistema genera un plan estructurado
4. Usuario puede exportar el plan en formato JSON

### Generar Casos de Prueba
1. Usuario ingresa información del proyecto o criterios de aceptación
2. Selecciona formato (Paso a Paso o Gherkin)
3. Hace clic en "Generar Casos de Prueba"
4. El sistema genera casos de prueba estructurados
5. Usuario selecciona herramienta de gestión de pruebas
6. Visualiza preview del formato de exportación
7. Descarga el archivo CSV compatible

## Interfaz de Usuario

### Diseño
- Interfaz moderna y limpia
- Gradientes y sombras para profundidad visual
- Diseño responsive para diferentes tamaños de pantalla
- Navegación intuitiva con tabs
- Selector de idioma visible

### Experiencia de Usuario
- Feedback visual durante la generación
- Validación de campos requeridos
- Mensajes claros y descriptivos
- Preview antes de exportar
- Descarga automática de archivos

## Casos de Uso

1. **QA Engineer**: Genera casos de prueba rápidamente a partir de AC
2. **Test Lead**: Crea planes de prueba estructurados para proyectos
3. **Product Owner**: Valida casos de prueba en formato legible (Gherkin)
4. **Team Lead**: Exporta casos de prueba a herramientas de gestión existentes

## Próximas Mejoras Potenciales

1. Integración con APIs de herramientas de gestión de pruebas
2. Plantillas personalizables para diferentes tipos de proyectos
3. Generación basada en IA para casos de prueba más inteligentes
4. Historial de generaciones
5. Exportación a formatos adicionales (Excel, XML)
6. Colaboración en tiempo real
7. Integración con repositorios de código

## Instalación y Uso

### Requisitos
- Node.js 16+ y npm

### Instalación
```bash
npm install
```

### Desarrollo
```bash
npm run dev
```

### Build para Producción
```bash
npm run build
```

## Conclusión

Master Test Generator es una herramienta completa que simplifica la creación de planes y casos de prueba, reduciendo el tiempo de trabajo manual y mejorando la consistencia y calidad de los artefactos de prueba generados. La compatibilidad con múltiples herramientas de gestión de pruebas y el soporte multiidioma la hacen accesible para equipos internacionales.

