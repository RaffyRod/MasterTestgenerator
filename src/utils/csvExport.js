import Papa from 'papaparse'

export const TEST_MANAGEMENT_TOOLS = [
  { id: 'testrail', name: 'TestRail', icon: '🚂' },
  { id: 'testmo', name: 'Testmo', icon: '🧪' },
  { id: 'jira', name: 'Jira (Zephyr)', icon: '🎯' },
  { id: 'xray', name: 'Xray', icon: '🔍' },
  { id: 'qtest', name: 'qTest', icon: '📊' },
  { id: 'practitest', name: 'PractiTest', icon: '✅' }
]

const formatMappings = {
  testrail: {
    columns: ['Title', 'Type', 'Priority', 'Preconditions', 'Steps', 'Expected'],
    formatRow: (testCase) => ({
      Title: testCase.title,
      Type: testCase.type || 'Functional',
      Priority: testCase.priority || 'Medium',
      Preconditions: testCase.preconditions || '',
      Steps: testCase.steps,
      Expected: testCase.expectedResult
    })
  },
  testmo: {
    columns: ['Name', 'Priority', 'Type', 'Preconditions', 'Steps', 'Expected Result'],
    formatRow: (testCase) => ({
      Name: testCase.title,
      Priority: testCase.priority || 'Medium',
      Type: testCase.type || 'Manual',
      Preconditions: testCase.preconditions || '',
      Steps: testCase.steps,
      'Expected Result': testCase.expectedResult
    })
  },
  jira: {
    columns: ['Summary', 'Test Type', 'Priority', 'Preconditions', 'Test Steps', 'Expected Result'],
    formatRow: (testCase) => ({
      Summary: testCase.title,
      'Test Type': testCase.type || 'Manual',
      Priority: testCase.priority || 'Medium',
      Preconditions: testCase.preconditions || '',
      'Test Steps': testCase.steps,
      'Expected Result': testCase.expectedResult
    })
  },
  xray: {
    columns: ['Test Summary', 'Test Type', 'Priority', 'Preconditions', 'Test Steps', 'Expected Result'],
    formatRow: (testCase) => ({
      'Test Summary': testCase.title,
      'Test Type': testCase.type || 'Manual',
      Priority: testCase.priority || 'Medium',
      Preconditions: testCase.preconditions || '',
      'Test Steps': testCase.steps,
      'Expected Result': testCase.expectedResult
    })
  },
  qtest: {
    columns: ['Name', 'Type', 'Priority', 'Preconditions', 'Steps', 'Expected Results'],
    formatRow: (testCase) => ({
      Name: testCase.title,
      Type: testCase.type || 'Manual',
      Priority: testCase.priority || 'Medium',
      Preconditions: testCase.preconditions || '',
      Steps: testCase.steps,
      'Expected Results': testCase.expectedResult
    })
  },
  practitest: {
    columns: ['Name', 'Type', 'Priority', 'Preconditions', 'Steps', 'Expected Result'],
    formatRow: (testCase) => ({
      Name: testCase.title,
      Type: testCase.type || 'Manual',
      Priority: testCase.priority || 'Medium',
      Preconditions: testCase.preconditions || '',
      Steps: testCase.steps,
      'Expected Result': testCase.expectedResult
    })
  }
}

export function exportToCSV(testCases, toolId) {
  const format = formatMappings[toolId]
  if (!format) {
    throw new Error(`Unsupported tool: ${toolId}`)
  }

  const rows = testCases.map(format.formatRow)
  const csv = Papa.unparse({
    fields: format.columns,
    data: rows
  })

  return csv
}

export function getPreviewData(testCases, toolId) {
  const format = formatMappings[toolId]
  if (!format) {
    return { columns: [], rows: [] }
  }

  const rows = testCases.map(format.formatRow)
  return {
    columns: format.columns,
    rows: rows
  }
}

export function downloadCSV(csvContent, filename) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

