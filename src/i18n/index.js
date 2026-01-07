export const messages = {
  en: {
    app: {
      title: 'Master Test Generator'
    },
    nav: {
      testPlans: 'Test Plans',
      testCases: 'Test Cases'
    },
    testPlan: {
      title: 'Test Plan Generator',
      subtitle: 'Generate comprehensive test plans from project information or acceptance criteria',
      projectInfo: 'Project Information / Acceptance Criteria',
      projectInfoPlaceholder: 'Enter project description, requirements, or acceptance criteria...',
      generate: 'Generate Test Plan',
      planTitle: 'Test Plan',
      objectives: 'Objectives',
      scope: 'Scope',
      testStrategy: 'Test Strategy',
      testItems: 'Test Items',
      resources: 'Resources',
      schedule: 'Schedule',
      risks: 'Risks and Mitigation',
      recommendations: 'Recommendations',
      analysis: 'Analysis Summary',
      export: 'Export Test Plan',
      exportFormat: 'Select Export Format',
      clear: 'Clear',
      loading: 'Generating test plan...'
    },
    testCase: {
      title: 'Test Case Generator',
      subtitle: 'Create test cases in step-by-step or Gherkin format',
      projectInfo: 'Project Information / Acceptance Criteria',
      projectInfoPlaceholder: 'Enter project description, requirements, or acceptance criteria...',
      format: 'Test Case Format',
      stepByStep: 'Step-by-Step',
      gherkin: 'Gherkin (Given-When-Then)',
      generate: 'Generate Test Cases',
      testCases: 'Generated Test Cases',
      export: 'Export to CSV',
      selectTool: 'Select Test Management Tool',
      preview: 'Preview Export',
      clear: 'Clear',
      loading: 'Generating test cases...',
      noTestCases: 'No test cases generated yet. Enter project information and click Generate.',
      testCaseTitle: 'Test Case Title',
      priority: 'Priority',
      type: 'Type',
      steps: 'Steps',
      expectedResult: 'Expected Result',
      preconditions: 'Preconditions',
      useAI: 'Use AI Enhancement',
      testsPerAC: 'Test Cases per Acceptance Criteria',
      testsPerACHint: 'Generate multiple test case variations for each acceptance criteria',
      testCase: 'Test Case',
      testCases: 'Test Cases',
      copyTestCase: 'Copy Test Case'
    },
    export: {
      preview: 'Export Preview',
      download: 'Download CSV',
      close: 'Close',
      tool: 'Tool',
      format: 'Format',
      columns: 'Columns',
      rows: 'Rows',
      previewNote: 'This is how your test cases will appear in the selected tool'
    },
    common: {
      required: 'Required field',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add'
    },
    notifications: {
      testCasesGenerated: 'Test cases generated successfully',
      testCasesGeneratedCount: '{count} test cases generated successfully',
      testCasesError: 'Error generating test cases. Please try again.',
      testPlanGenerated: 'Test plan generated successfully',
      testPlanError: 'Error generating test plan. Please try again.',
      exportSuccess: 'Export completed successfully',
      exportError: 'Error exporting file. Please try again.',
      clearSuccess: 'Content cleared successfully',
      aiNotAvailable: 'AI service is not available. Using intelligent analyzer instead.',
      aiError: 'AI generation failed. Using intelligent analyzer instead.',
      invalidInput: 'Please enter project information or acceptance criteria',
      noTestCases: 'No test cases were generated. Please check your input.',
      noTestPlan: 'No test plan was generated. Please check your input.',
      testCaseCopied: 'Test case copied to clipboard',
      copyError: 'Error copying test case. Please try again.'
    }
  },
  es: {
    app: {
      title: 'Generador Maestro de Pruebas'
    },
    nav: {
      testPlans: 'Planes de Prueba',
      testCases: 'Casos de Prueba'
    },
    testPlan: {
      title: 'Generador de Planes de Prueba',
      subtitle:
        'Genera planes de prueba completos a partir de información del proyecto o criterios de aceptación',
      projectInfo: 'Información del Proyecto / Criterios de Aceptación',
      projectInfoPlaceholder:
        'Ingresa la descripción del proyecto, requisitos o criterios de aceptación...',
      generate: 'Generar Plan de Prueba',
      planTitle: 'Plan de Prueba',
      objectives: 'Objetivos',
      scope: 'Alcance',
      testStrategy: 'Estrategia de Prueba',
      testItems: 'Elementos de Prueba',
      resources: 'Recursos',
      schedule: 'Cronograma',
      risks: 'Riesgos y Mitigación',
      recommendations: 'Recomendaciones',
      analysis: 'Resumen de Análisis',
      export: 'Exportar Plan de Prueba',
      exportFormat: 'Seleccionar Formato de Exportación',
      clear: 'Limpiar',
      loading: 'Generando plan de prueba...'
    },
    testCase: {
      title: 'Generador de Casos de Prueba',
      subtitle: 'Crea casos de prueba en formato paso a paso o Gherkin',
      projectInfo: 'Información del Proyecto / Criterios de Aceptación',
      projectInfoPlaceholder:
        'Ingresa la descripción del proyecto, requisitos o criterios de aceptación...',
      format: 'Formato de Caso de Prueba',
      stepByStep: 'Paso a Paso',
      gherkin: 'Gherkin (Given-When-Then)',
      generate: 'Generar Casos de Prueba',
      testCases: 'Casos de Prueba Generados',
      export: 'Exportar a CSV',
      selectTool: 'Seleccionar Herramienta de Gestión de Pruebas',
      preview: 'Vista Previa de Exportación',
      clear: 'Limpiar',
      loading: 'Generando casos de prueba...',
      noTestCases:
        'Aún no se han generado casos de prueba. Ingresa información del proyecto y haz clic en Generar.',
      testCaseTitle: 'Título del Caso de Prueba',
      priority: 'Prioridad',
      type: 'Tipo',
      steps: 'Pasos',
      expectedResult: 'Resultado Esperado',
      preconditions: 'Precondiciones',
      useAI: 'Usar Mejora con IA',
      testsPerAC: 'Casos de Prueba por Criterio de Aceptación',
      testsPerACHint:
        'Generar múltiples variaciones de casos de prueba para cada criterio de aceptación',
      testCase: 'Caso de Prueba',
      testCases: 'Casos de Prueba',
      copyTestCase: 'Copiar Caso de Prueba'
    },
    export: {
      preview: 'Vista Previa de Exportación',
      download: 'Descargar CSV',
      close: 'Cerrar',
      tool: 'Herramienta',
      format: 'Formato',
      columns: 'Columnas',
      rows: 'Filas',
      previewNote: 'Así es como aparecerán tus casos de prueba en la herramienta seleccionada'
    },
    common: {
      required: 'Campo requerido',
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      add: 'Agregar'
    },
    notifications: {
      testCasesGenerated: 'Casos de prueba generados exitosamente',
      testCasesGeneratedCount: '{count} casos de prueba generados exitosamente',
      testCasesError: 'Error al generar casos de prueba. Por favor, inténtalo de nuevo.',
      testPlanGenerated: 'Plan de prueba generado exitosamente',
      testPlanError: 'Error al generar plan de prueba. Por favor, inténtalo de nuevo.',
      exportSuccess: 'Exportación completada exitosamente',
      exportError: 'Error al exportar archivo. Por favor, inténtalo de nuevo.',
      clearSuccess: 'Contenido limpiado exitosamente',
      aiNotAvailable:
        'El servicio de IA no está disponible. Usando analizador inteligente en su lugar.',
      aiError: 'La generación con IA falló. Usando analizador inteligente en su lugar.',
      invalidInput: 'Por favor, ingresa información del proyecto o criterios de aceptación',
      noTestCases: 'No se generaron casos de prueba. Por favor, verifica tu entrada.',
      noTestPlan: 'No se generó plan de prueba. Por favor, verifica tu entrada.',
      testCaseCopied: 'Caso de prueba copiado al portapapeles',
      copyError: 'Error al copiar caso de prueba. Por favor, inténtalo de nuevo.'
    }
  }
}
