# 🧪 Master Test Generator

> **Genera planes de prueba y casos de prueba sin esfuerzo** - Una potente aplicación Vue.js que crea documentación de pruebas completa en inglés y español, con asistencia de IA y exportación perfecta a tus herramientas de gestión de pruebas favoritas.

**🌍 Idioma / Language:** [Español](README.es.md) | [English](README.md)

---

## ✨ Características

### 📋 Generación de Planes de Prueba

Crea planes de prueba detallados con diferentes tipos (Funcional, Rendimiento, Seguridad, Integración y más)

### 📝 Generación de Casos de Prueba

Genera casos de prueba en dos formatos:

- **Paso a Paso**: Pasos numerados simples para fácil ejecución
- **Gherkin**: Formato BDD con estructura Given-When-Then

### 🤖 Inteligencia con IA

- **🤖 IA Local (Ollama)**: Ejecuta modelos de IA en tu máquina para privacidad completa
- **🌐 IA en Línea (Hugging Face)**: IA basada en la nube cuando la necesites
- **🧠 Fallback Inteligente**: Generación basada en reglas inteligentes cuando la IA no está disponible

### 🌍 Soporte Multi-idioma

Genera documentación de pruebas en **Inglés** o **Español**

### 📤 Exportación e Integración

- Exporta a **TestMO**, **TestRail**, **Jira**, **Zephyr** y más
- **Vista previa antes de exportar** para ver exactamente cómo se verá
- Formato CSV compatible con todas las herramientas principales de gestión de pruebas

### 🎨 Interfaz Hermosa

- **Modo Claro/Oscuro** con transiciones suaves
- **Diseño completamente responsive** - optimizado para escritorio, tablet y dispositivos móviles
- **Interfaz táctil** - objetivos táctiles de 44px+ para accesibilidad móvil
- **Interfaz intuitiva** - fácil de usar, incluso para principiantes
- **Diseño moderno basado en tarjetas** - presentación limpia y organizada de casos de prueba
- **Agrupado por Criterios de Aceptación** - casos de prueba organizados por AC con secciones colapsables

### 🐛 Generador de Reportes de Bug

- **Reportes de bugs completos** con campos de información detallados
- **🤖 Generación Dual de Títulos con IA** - Genera automáticamente **2 opciones de título** de diferentes proveedores de IA (IA Principal + Groq IA) para que elijas el mejor
- **🎯 Selección Inteligente de Títulos** - Hermosa interfaz modal para seleccionar entre títulos generados por IA con indicadores de fuente
- **Generación de contenido con IA** - Genera automáticamente pasos para reproducir, resultados esperados/actuales
- **Adjuntar evidencias** - sube imágenes, logs y archivos de texto con soporte de arrastrar y soltar
- **Múltiples formatos de exportación** - Jira, Markdown y Texto Plano con limpieza de etiquetas HTML
- **Auto-detección** de navegador y sistema operativo
- **Copiar al portapapeles** para pegar fácilmente en rastreadores de issues
- **Interfaz hermosa** - Indicadores de progreso, validación en tiempo real, badges visuales y secciones colapsables
- **Validación inteligente de formularios** - Retroalimentación en tiempo real con indicadores visuales
- **Límite de longitud de título** - Aplica automáticamente un máximo de 30 caracteres para títulos concisos

---

## 🛠️ Stack Tecnológico

Este proyecto está construido con increíbles tecnologías de código abierto. Estamos agradecidos con todos los contribuidores y mantenedores:

### Framework Principal

- **[Vue.js 3](https://vuejs.org/)** - Framework JavaScript progresivo para construir interfaces de usuario
- **[Vue Router](https://router.vuejs.org/)** - Router oficial para Vue.js
- **[Vue I18n](https://vue-i18n.intlify.dev/)** - Plugin de internacionalización para Vue.js

### Herramientas de Construcción y Desarrollo

- **[Vite](https://vitejs.dev/)** - Herramienta de construcción frontend de próxima generación
- **[Vitest](https://vitest.dev/)** - Framework de pruebas unitarias rápido impulsado por Vite
- **[Prettier](https://prettier.io/)** - Formateador de código con opiniones definidas
- **[Husky](https://typicode.github.io/husky/)** - Git hooks simplificados

### Pruebas y Calidad

- **[Vitest](https://vitest.dev/)** - Framework de pruebas unitarias rápido
- **[@vitest/coverage-v8](https://vitest.dev/guide/coverage.html)** - Reportes de cobertura de código
- **[@vue/test-utils](https://test-utils.vuejs.org/)** - Utilidades para probar componentes Vue
- **[Testing Library](https://testing-library.com/)** - Utilidades de prueba simples y completas
- **CI/CD con GitHub Actions** - Pruebas automatizadas en cada push y pull request
- **Pruebas Unitarias** - Cobertura completa de pruebas para generación de IA y funcionalidad principal

### Procesamiento de Datos

- **[PapaParse](https://www.papaparse.com/)** - Parser CSV potente para JavaScript
- **[jsPDF](https://github.com/parallax/jsPDF)** - Generación de PDF del lado del cliente
- **[docx](https://github.com/dolanmiu/docx)** - Genera archivos .docx fácilmente

### Integración de IA

- **[Ollama](https://ollama.com/)** - Ejecuta modelos de lenguaje grandes localmente
- **[Hugging Face](https://huggingface.co/)** - Comunidad y plataforma de IA
- **[Groq API](https://groq.com/)** - Inferencia de IA rápida y gratuita para generación dual de títulos (reportes de bugs)
- **[OpenAI API](https://platform.openai.com/)** - Modelos GPT para generación con IA (configurable vía UI)
- **[Anthropic Claude](https://www.anthropic.com/)** - Modelos de IA Claude (configurable vía UI)
- **[Google Gemini](https://ai.google.dev/)** - Modelos de IA de Google (configurable vía UI)
- **Proveedores de API Personalizados** - Configura cualquier proveedor de IA con endpoints personalizados
- **Sistema Dual de IA** - Los títulos de reportes de bugs usan dos proveedores de IA en paralelo para mejores opciones

### Herramientas Adicionales

- **[jsdom](https://github.com/jsdom/jsdom)** - Implementación DOM en JavaScript puro para pruebas

---

## 🙏 Agradecimientos

Nos gustaría agradecer a todos los contribuidores y mantenedores de código abierto de las tecnologías utilizadas en este proyecto. ¡Su trabajo hace posibles proyectos como este!

---

## 🚀 Inicio Rápido (¡Súper Fácil!)

### ⚡ Configuración de Un Comando - ¡Instala Todo Automáticamente!

**¡Eso es todo! Solo ejecuta un comando y todo se instalará automáticamente:**

```bash
pnpm setup
```

**O si prefieres npm:**

```bash
npm run setup
```

**En Windows, también puedes hacer doble clic en:**

```
setup.bat
```

**En Linux/macOS:**

```bash
./setup.sh
```

### 🎯 Lo que Hace la Configuración Automáticamente

El script de configuración **automáticamente**:

- ✅ Verifica e instala Node.js (si es necesario)
- ✅ Instala el gestor de paquetes pnpm
- ✅ Instala todas las dependencias del proyecto
- ✅ Configura Git hooks (formateo con Prettier)
- ✅ **Instala Ollama (IA Local)** - descarga y configura automáticamente
- ✅ **Descarga modelos de IA** - obtiene el modelo recomendado (llama3.2:1b)
- ✅ Crea archivos de entorno
- ✅ Verifica que todo funciona

**¡No necesitas hacer nada más!** Solo ejecuta la configuración y estarás listo para comenzar. 🎉

### 📋 Prerrequisitos

La configuración verificará e instalará estos por ti, pero si quieres instalar manualmente:

- **Node.js 16+** - [Descarga aquí](https://nodejs.org/)
- **pnpm 8+** (recomendado) o npm - Se instalará automáticamente con la configuración

> 💡 **Consejo**: ¡El script de configuración maneja todo, incluyendo la instalación de Ollama. No necesitas instalar nada manualmente!

---

## 🛠️ Desarrollo

### Iniciar el Servidor de Desarrollo

Después de ejecutar `pnpm setup`, comienza a desarrollar:

```bash
pnpm dev
```

El servidor encontrará automáticamente un puerto disponible (3000-7000) y se iniciará en `http://localhost:3000`

### 🤖 Desarrollo con IA Local (Ollama)

Ejecuta el servidor de desarrollo con IA Local preconfigurada:

```bash
pnpm dev:local-ai
```

Esto:

- ✅ Verifica si Ollama está ejecutándose
- ✅ Configura la aplicación para usar IA Local por defecto
- ✅ Muestra mensajes útiles si Ollama no está disponible

### 🌐 Desarrollo con IA Web (Hugging Face)

Ejecuta el servidor de desarrollo con IA Web preconfigurada:

```bash
pnpm dev:web-ai
```

Esto:

- ✅ Verifica la clave API de Hugging Face en `.env`
- ✅ Configura la aplicación para usar IA Web por defecto
- ✅ Usa API autenticada si se encuentra la clave (más rápido)
- ✅ Fallback a endpoints públicos si no hay clave (más lento, con límite de tasa)

---

## 🤖 Integración de IA

Este proyecto soporta generación con IA usando dos soluciones de código abierto. **¡El script de configuración instala todo automáticamente!**

### 🎯 Configuración Rápida de IA

**¡Buenas noticias!** El comando `pnpm setup` automáticamente:

- ✅ Instala Ollama (IA Local) en tu sistema
- ✅ Descarga el modelo de IA recomendado (llama3.2:1b)
- ✅ Configura todo para que funcione de inmediato

**¡No necesitas hacer nada manualmente!** Solo ejecuta `pnpm setup` y la IA estará lista para usar.

---

### 1. 🤖 IA Local (Ollama) - Recomendado para Privacidad

**Ollama** ejecuta modelos de IA localmente en tu máquina. Perfecto para:

- 🔒 **Privacidad completa** - Tus datos nunca salen de tu computadora
- 📴 **Funciona sin internet** - No se requiere internet después de la configuración
- 💰 **Sin costos de API** - Completamente gratis
- 🎛️ **Control total** - Elige tus modelos y configuraciones

#### 📍 Ubicación de Instalación

Ollama se instala **en todo el sistema** (como Node.js o Docker), no en la carpeta del proyecto. Esto significa:

- ✅ Una instalación funciona para todos tus proyectos
- ✅ Los modelos se almacenan en tu directorio de usuario
- ✅ Fácil de gestionar y actualizar

**Almacenamiento de Modelos:**

- **Windows:** `%USERPROFILE%\.ollama`
- **macOS/Linux:** `~/.ollama`

#### 🚀 Instalación Automática

El script de configuración (`pnpm setup`) **instala Ollama automáticamente** por ti:

- **Windows**: Descarga e instala vía winget o descarga directa
- **macOS**: Usa Homebrew si está disponible, o descarga el instalador
- **Linux**: Ejecuta el script de instalación oficial

**Si la instalación automática falla** (raro), puedes instalar manualmente:

**Windows/macOS:**

1. Descarga desde [ollama.com](https://ollama.com)
2. Ejecuta el instalador
3. El script de configuración luego descargará el modelo de IA por ti

**Linux:**

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

#### ✅ Usando IA Local

Después de ejecutar `pnpm setup`, Ollama está listo para usar:

1. **Inicia la aplicación**: `pnpm dev:local-ai` (o `pnpm dev` regular)
2. **En la aplicación**: Habilita "Usar Mejora de IA" y selecciona "💻 IA Local (Ollama)"
3. **¡Eso es todo!** La aplicación detecta Ollama automáticamente

**Modelos Recomendados** (la configuración instala `llama3.2:1b` por defecto):

- `llama3.2:1b` - ⚡ Rápido, pequeño (~1.3GB) - **Instalado por defecto**
- `llama3.2:3b` - 🎯 Mejor calidad (~2GB) - Ejecuta `ollama pull llama3.2:3b` si quieres
- `llama3.2` - 🏆 Mejor calidad (~4.7GB) - Ejecuta `ollama pull llama3.2` para máxima calidad

---

### 2. 🌐 IA en Línea (Hugging Face) - Sin Instalación Necesaria

**Hugging Face** proporciona IA basada en la nube - perfecto si no quieres instalar nada localmente:

- ✅ **Cero instalación** - Es un servicio en la nube
- ✅ Modelos siempre actualizados
- ✅ Nivel gratuito disponible
- ⚠️ Requiere conexión a internet
- ⚠️ Datos enviados a servicio externo

#### 🚀 Usando IA en Línea

**¡No se necesita configuración!** Solo:

1. Inicia la aplicación: `pnpm dev:web-ai` (o `pnpm dev` regular)
2. En la aplicación: Habilita "Usar Mejora de IA" y selecciona "🌐 IA en Línea (Hugging Face)"
3. **Opcional**: Agrega tu clave API a `.env` para mejor rendimiento:
   ```env
   VITE_HUGGING_FACE_API_KEY=tu_token_aqui
   ```
   Obtén tu token gratuito en [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)

**Sin clave API**: Funciona bien, pero usa endpoints públicos (más lento, con límite de tasa)

---

## 📚 Guía de Uso

### Generar Planes de Prueba

1. Navega a la sección **Planes de Prueba**
2. Ingresa la información de tu proyecto o criterios de aceptación
3. Selecciona el tipo de plan de prueba (Funcional, Rendimiento, Seguridad, etc.)
4. Haz clic en **Generar Plan de Prueba**
5. Revisa el plan generado con recomendaciones y análisis
6. Exporta si es necesario

### Generar Casos de Prueba

1. Navega a la sección **Casos de Prueba**
2. Ingresa tus criterios de aceptación o información del proyecto
3. Elige formato:
   - **Paso a Paso**: Pasos numerados con acciones específicas
   - **Gherkin**: Formato BDD (Given-When-Then) en título case
4. Selecciona número de casos de prueba por AC (1-5)
   - Cada variación genera pasos únicos (Positivo, Negativo, Caso Límite, Flujo Alternativo)
5. **Opcional**: Habilita mejora de IA para mejores resultados
6. Haz clic en **Generar Casos de Prueba**
7. Los casos de prueba se agrupan automáticamente **por Criterio de Aceptación** con secciones colapsables
8. **Copia casos de prueba individuales** con el botón de copiar en cada tarjeta
9. Vista previa del formato de exportación y descarga CSV

### Configurar Proveedores de IA

1. Haz clic en el icono **⚙️ Configuración** en el encabezado
2. Selecciona **🤖 Configuración de IA**
3. Elige tu proveedor de IA:
   - **IA Local (Ollama)** - No se necesita clave API
   - **IA en Línea (Hugging Face)** - Clave API opcional para mejor rendimiento
   - **OpenAI GPT** - Requiere clave API
   - **Anthropic Claude** - Requiere clave API
   - **Google Gemini** - Requiere clave API
   - **API Personalizada** - Configura tu propio endpoint
4. Ingresa tu clave API (si es requerida)
5. Selecciona el modelo que deseas usar
6. Haz clic en **Guardar Configuración**
7. Tu proveedor de IA se usará para la generación de casos de prueba y reportes de bugs

### Generar Reportes de Bug

1. Navega a la sección **🐛 Reporte de Bug**
2. Ingresa la **Descripción** del bug (requerido) - **¡El título se genera automáticamente!**
3. **🤖 Generación Dual de Títulos con IA**: La aplicación genera automáticamente **2 opciones de título** de diferentes proveedores de IA:
   - **IA Principal**: Usa tu proveedor de IA configurado (Ollama, Hugging Face, etc.)
   - **Groq IA**: Alternativa rápida y gratuita para comparación
   - Aparecerá un modal para que **selecciones el mejor título**
4. Selecciona **Prioridad** y **Severidad** de los dropdowns
5. **Opcional**: Expande "Información Opcional" para agregar detalles del entorno (auto-detectado por defecto)
6. **Sube evidencias** - Arrastra y suelta o haz clic para subir imágenes, logs o archivos de texto
7. **Habilita IA** (por defecto) para generar automáticamente:
   - Pasos para Reproducir
   - Resultado Esperado
   - Resultado Actual
   - Información Adicional
8. Haz clic en **🚀 Generar Bug**
9. Selecciona formato de exportación (Jira, Markdown o Texto Plano)
10. Haz clic en **📋 Copiar** para copiar el reporte formateado al portapapeles

### Exportar a Herramientas de Gestión de Pruebas

1. Genera tus casos de prueba
2. Selecciona tu herramienta de gestión de pruebas (TestMO, TestRail, Jira, etc.)
3. Haz clic en **Vista Previa de Exportación** para ver cómo se verá
4. Haz clic en **Exportar CSV** para descargar
5. Importa el CSV en tu herramienta de gestión de pruebas

---

## 🎨 Características en Detalle

### Generación Inteligente de Casos de Prueba

La aplicación genera **casos de prueba inteligentes y específicos** que:

- ✅ Extraen entidades de criterios de aceptación (ej: "province", "branch", "user")
- ✅ Crean pasos contextuales basados en acciones detectadas (click, view, create, etc.)
- ✅ Generan resultados esperados claros y legibles del texto AC
- ✅ Evitan texto placeholder genérico
- ✅ Siempre usan tipo "Funcional" por defecto (a menos que se especifique explícitamente)
- ✅ Agrupan casos de prueba por Criterio de Aceptación para mejor organización

### Múltiples Casos de Prueba por AC

Genera **1 a 5 variaciones** de casos de prueba para cada criterio de aceptación:

- **Caso base**: Caso de prueba conciso y enfocado
- **Camino positivo**: Escenarios detallados y completos
- **Camino negativo**: Escenarios de manejo de errores y validación
- **Casos límite**: Condiciones límite y escenarios límite
- **Flujos alternativos**: Diferentes enfoques para lograr el mismo objetivo

¡Cada variación tiene **pasos únicos y específicos** - sin pasos genéricos duplicados!

### Diseño Responsive

La UI está completamente optimizada para todos los dispositivos:

- **Escritorio**: Diseño de cuadrícula multi-columna, efectos hover, tarjetas espaciosas
- **Tablet**: Cuadrícula adaptable, controles optimizados para táctil
- **Móvil**: Columna única, objetivos táctiles grandes (44px+), secciones colapsables
- **Accesibilidad**: Etiquetas ARIA apropiadas, navegación por teclado, soporte para lectores de pantalla

### Análisis Inteligente

La aplicación automáticamente:

- Detecta tipos de funcionalidad (Autenticación, CRUD, Validación, etc.)
- Identifica casos límite y condiciones de frontera
- Sugiere escenarios de prueba faltantes
- Calcula complejidad de pruebas y estimaciones

### Formatos de Exportación

Compatible con:

- 🧪 **TestMO** - Formato multi-fila con formato HTML
- 🚂 **TestRail** - Formato CSV estándar
- 🎯 **Jira (Zephyr)** - Compatible con gestión de pruebas Zephyr
- 🔍 **Xray** - Compatibilidad completa con Xray
- 📊 **qTest** - Formato de importación qTest
- ✅ **PractiTest** - Formato CSV PractiTest

---

## 🛠️ Desarrollo

### Construir para Producción

```bash
pnpm build
```

Esto crea una compilación optimizada de producción en la carpeta `dist/`.

### Formateo de Código

Este proyecto usa **Prettier** para un estilo de código consistente. El formateo se ejecuta **automáticamente** en cada commit (gracias a Husky).

**Formateo manual:**

```bash
# Formatear todos los archivos
pnpm format

# Verificar formateo (sin cambiar archivos)
pnpm format:check
```

### Git Hooks

**Prettier se ejecuta automáticamente** antes de cada commit para asegurar formateo de código consistente. ¡No necesitas ejecutarlo manualmente!

### Ejecutar Tests

```bash
# Ejecutar tests en modo watch
pnpm test

# Ejecutar tests una vez
pnpm test:run

# Ejecutar tests con cobertura
pnpm test:coverage
```

### CI/CD con GitHub Actions

Este proyecto incluye **CI/CD automatizado** que se ejecuta en cada push y pull request:

- ✅ **Pruebas Automatizadas** - Ejecuta todas las pruebas unitarias en Node.js 18.x y 20.x
- ✅ **Verificación de Formateo** - Valida la consistencia del estilo de código
- ✅ **Verificación de Compilación** - Asegura que el proyecto se compile exitosamente
- ✅ **Reportes de Cobertura** - Genera reportes de cobertura de pruebas

El pipeline de CI está configurado en `.github/workflows/ci.yml` y se ejecuta automáticamente para:
- Cada push a la rama `main`
- Cada pull request dirigido a la rama `main`

**¡No se requiere acción** - se ejecuta automáticamente! 🎉
pnpm test:run

# Ejecutar tests con cobertura
pnpm test:coverage
```

---

## 🐛 Solución de Problemas

### ¿Ollama No Disponible?

1. **Verifica si Ollama está ejecutándose:**

   ```bash
   ollama list
   ```

2. **Si no está instalado**, ejecuta la configuración nuevamente:

   ```bash
   pnpm setup
   ```

3. **Si está instalado pero no se detecta**, reinicia tu terminal e intenta nuevamente

### ¿Puerto Ya en Uso?

El servidor de desarrollo encuentra automáticamente un puerto disponible (3000-7000). ¡No se necesita acción!

### ¿Problemas de Exportación?

- Asegúrate de haber generado casos de prueba primero
- Verifica que hayas seleccionado una herramienta de gestión de pruebas
- Verifica que la vista previa se vea correcta antes de exportar

---

## 📝 Licencia

Este proyecto está licenciado bajo la Licencia Pública General GNU Versión 3 - consulta el archivo [LICENSE](LICENSE) para más detalles.

---

## 🙏 Contribuir

¡Las contribuciones son bienvenidas! Por favor, siéntete libre de enviar un Pull Request.

### Flujo de Desarrollo

1. **Haz fork del repositorio** y crea una rama de funcionalidad
2. **Haz tus cambios** siguiendo el estilo de código (Prettier formateará automáticamente)
3. **Escribe o actualiza tests** para nueva funcionalidad
4. **Ejecuta tests** para asegurar que todo pase: `pnpm test:run`
5. **Haz commit de tus cambios** (Prettier formateará en el commit)
6. **Haz push a tu fork** y crea un Pull Request
7. **CI/CD se ejecutará automáticamente** para probar y validar tus cambios

### Requisitos de Testing

- Todas las nuevas funcionalidades deben incluir pruebas unitarias
- Los tests deben pasar antes de fusionar
- Los reportes de cobertura se generan automáticamente en CI/CD

---

## 📧 Soporte

Si encuentras algún problema o tienes preguntas:

1. Revisa la sección [Solución de Problemas](#-solución-de-problemas)
2. Revisa la documentación anterior
3. Abre un issue en GitHub

---

**Hecho con ❤️ para la comunidad de QA**
