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
    formatRow: testCase => ({
      Title: testCase.title,
      Type: testCase.type || 'Functional',
      Priority: testCase.priority || 'Medium',
      Preconditions: testCase.preconditions || '',
      Steps: testCase.steps,
      Expected: testCase.expectedResult
    })
  },
  testmo: {
    columns: [
      'Case ID',
      'Case',
      'Automated',
      'Configurations',
      'Created at',
      'Created by',
      'Description',
      'Estimate',
      'Expected',
      'Folder',
      'Forecast',
      'Issues',
      'Pre-Condition',
      'Priority',
      'State',
      'Status (latest)',
      'Status date',
      'Steps (Expected)',
      'Steps (Step)',
      'Tags',
      'Template',
      'Test Data',
      'Updated at',
      'Updated by'
    ],
    formatRow: (testCase, isFirstRow = true, stepIndex = 0, totalSteps = 0) => {
      const tags = generateTestMOTags(testCase)
      const folderName = testCase.folder || 'Test Cases'

      // Format description with HTML
      const description = formatHTMLDescription(testCase)

      // Format preconditions
      const preconditions = formatHTMLText(testCase.preconditions || 'System is ready')

      // Clean title - remove newlines and extra spaces for CSV
      const cleanTitle = (testCase.title || '').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()

      if (isFirstRow) {
        // First row: Main test case info + first step
        const steps = parseSteps(testCase.steps)
        const firstStep =
          steps.length > 0
            ? steps[0]
            : { step: 'Navigate to the application', expected: 'Application is accessible' }

        return {
          'Case ID': '',
          Case: cleanTitle,
          Automated: 'No',
          Configurations: '',
          'Created at': '',
          'Created by': '',
          Description: description,
          Estimate: '',
          Expected: formatHTMLText(testCase.expectedResult || 'Operation completes successfully'),
          Folder: folderName,
          Forecast: '',
          Issues: '',
          'Pre-Condition': preconditions,
          Priority: mapPriority(testCase.priority || 'Medium'),
          State: 'Active',
          'Status (latest)': '',
          'Status date': '',
          'Steps (Expected)': formatHTMLText(firstStep.expected),
          'Steps (Step)': formatHTMLText(firstStep.step),
          Tags: tags,
          Template: 'Case (steps)',
          'Test Data': '',
          'Updated at': '',
          'Updated by': ''
        }
      } else {
        // Subsequent rows: Individual steps only
        const steps = parseSteps(testCase.steps)
        const step = steps[stepIndex] || { step: '', expected: '' }

        // Clean title for subsequent rows too
        const cleanTitle = (testCase.title || '').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()

        return {
          'Case ID': '',
          Case: cleanTitle,
          Automated: '',
          Configurations: '',
          'Created at': '',
          'Created by': '',
          Description: '',
          Estimate: '',
          Expected: '',
          Folder: '',
          Forecast: '',
          Issues: '',
          'Pre-Condition': '',
          Priority: '',
          State: '',
          'Status (latest)': '',
          'Status date': '',
          'Steps (Expected)': formatHTMLText(step.expected),
          'Steps (Step)': formatHTMLText(step.step),
          Tags: '',
          Template: '',
          'Test Data': '',
          'Updated at': '',
          'Updated by': ''
        }
      }
    }
  },
  jira: {
    columns: ['Summary', 'Test Type', 'Priority', 'Preconditions', 'Test Steps', 'Expected Result'],
    formatRow: testCase => ({
      Summary: testCase.title,
      'Test Type': testCase.type || 'Manual',
      Priority: testCase.priority || 'Medium',
      Preconditions: testCase.preconditions || '',
      'Test Steps': testCase.steps,
      'Expected Result': testCase.expectedResult
    })
  },
  xray: {
    columns: [
      'Test Summary',
      'Test Type',
      'Priority',
      'Preconditions',
      'Test Steps',
      'Expected Result'
    ],
    formatRow: testCase => ({
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
    formatRow: testCase => ({
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
    formatRow: testCase => ({
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

  let rows = []

  if (toolId === 'testmo') {
    // Multi-row format for TestMO
    testCases.forEach(testCase => {
      const steps = parseSteps(testCase.steps)

      // First row: Main info + first step
      rows.push(format.formatRow(testCase, true, 0, steps.length))

      // Subsequent rows: Individual steps (skip first step as it's in first row)
      for (let i = 1; i < steps.length; i++) {
        rows.push(format.formatRow(testCase, false, i, steps.length))
      }
    })
  } else {
    // Single-row format for other tools
    rows = testCases.map(tc => format.formatRow(tc))
  }

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

  let rows = []

  if (toolId === 'testmo') {
    // Multi-row format for TestMO (limit to first 3 test cases for preview)
    const previewCases = testCases.slice(0, 3)
    previewCases.forEach(testCase => {
      if (!testCase || !testCase.title) {
        return
      }

      const steps = parseSteps(testCase.steps || testCase.stepByStep || '')

      // Ensure we have at least one step
      if (steps.length === 0) {
        steps.push({
          step: testCase.title || 'Execute test case',
          expected: testCase.expectedResult || 'Test completes successfully'
        })
      }

      rows.push(format.formatRow(testCase, true, 0, steps.length))
      for (let i = 1; i < Math.min(3, steps.length); i++) {
        rows.push(format.formatRow(testCase, false, i, steps.length))
      }
    })
  } else {
    rows = testCases.map(tc => format.formatRow(tc))
  }

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

// Helper functions for TestMO formatting

function parseSteps(stepsText) {
  if (!stepsText) return []

  // Handle different step formats
  const steps = []

  // Clean the input text first - remove any truncation artifacts
  let cleanText = stepsText.trim()
  // Remove any incomplete sentences at the end (like "(e" or incomplete words)
  cleanText = cleanText.replace(/\s*\([^)]*$/, '') // Remove incomplete parentheses
  cleanText = cleanText.replace(/\s*,\s*$/, '') // Remove trailing commas
  cleanText = cleanText.replace(/\s+\.\.\.\s*$/, '') // Remove trailing ellipsis

  // Try to parse numbered steps (1., 2., etc.) with expected results
  // Pattern: "1. Step description\n   Expected: result" or "1. Step description\n   Result description"
  const numberedPattern = /(?:^|\n)\s*(\d+)[.)]\s*(.+?)(?=\n\s*\d+[.)]|$)/gs
  const numberedMatches = [...cleanText.matchAll(numberedPattern)]

  if (numberedMatches && numberedMatches.length > 0) {
    numberedMatches.forEach(match => {
      const fullMatch = match[0]
      const stepNumber = match[1]
      const content = match[2] || ''

      // Try to extract expected result from the content
      const expectedPattern = /(?:expected|result|should|debe)[:\s]+(.+?)(?=\n|$)/i
      const expectedMatch = content.match(expectedPattern)

      if (expectedMatch) {
        const step = content.replace(expectedPattern, '').trim()
        const expected = expectedMatch[1].trim()
        if (step) {
          steps.push({ step, expected })
        }
      } else {
        // Split by newline to separate step from expected
        const parts = content
          .split(/\n/)
          .map(p => p.trim())
          .filter(p => p)
        const step = parts[0] || ''
        const expected = parts.slice(1).join(' ').trim() || 'Step completes successfully'
        if (step) {
          steps.push({ step, expected })
        }
      }
    })
  } else {
    // Try to parse Gherkin format (Given/When/Then)
    // Split by Gherkin keywords first, then process each step
    const gherkinKeywords = /(?:^|\n)\s*(Given|When|Then|And|But|Dado|Cuando|Entonces|Y|Pero)\s+/gi
    const lines = stepsText.split(/\n/)
    const gherkinSteps = []
    let currentStep = null

    // Process line by line to build complete steps
    lines.forEach((line, index) => {
      const trimmed = line.trim()
      if (!trimmed) return

      // Check if line starts with a Gherkin keyword
      const keywordMatch = trimmed.match(
        /^(Given|When|Then|And|But|Dado|Cuando|Entonces|Y|Pero)\s+(.+)$/i
      )

      if (keywordMatch) {
        // Save previous step if exists
        if (currentStep) {
          gherkinSteps.push(currentStep)
        }

        // Start new step
        const keyword = keywordMatch[1]
        let description = keywordMatch[2].trim()

        // Clean description - remove trailing punctuation that might be from truncation
        description = description.replace(/[.,;]$/, '').trim()

        currentStep = {
          keyword,
          description,
          fullStep: `${keyword} ${description}`
        }
      } else if (currentStep) {
        // Continuation of current step (multi-line description)
        // Only append if it doesn't look like a new step
        if (!trimmed.match(/^(Given|When|Then|And|But|Dado|Cuando|Entonces|Y|Pero)\s+/i)) {
          currentStep.description += ' ' + trimmed
          currentStep.fullStep = `${currentStep.keyword} ${currentStep.description}`
        } else {
          // This is actually a new step, save current and start new
          gherkinSteps.push(currentStep)
          const newKeywordMatch = trimmed.match(
            /^(Given|When|Then|And|But|Dado|Cuando|Entonces|Y|Pero)\s+(.+)$/i
          )
          if (newKeywordMatch) {
            currentStep = {
              keyword: newKeywordMatch[1],
              description: newKeywordMatch[2].trim(),
              fullStep: `${newKeywordMatch[1]} ${newKeywordMatch[2].trim()}`
            }
          }
        }
      }
    })

    // Don't forget the last step
    if (currentStep) {
      gherkinSteps.push(currentStep)
    }

    if (gherkinSteps.length > 0) {
      gherkinSteps.forEach(stepObj => {
        // Clean up description - remove extra whitespace
        const description = stepObj.description.replace(/\s+/g, ' ').trim()
        const step = `${stepObj.keyword} ${description}`

        // Extract expected result
        let expected = 'Step completes successfully'
        const keywordLower = stepObj.keyword.toLowerCase()

        if (keywordLower === 'then' || keywordLower === 'entonces') {
          // "Then" steps are the expected results
          expected = description
        } else if (keywordLower === 'when' || keywordLower === 'cuando') {
          // For "When" steps, the expected is usually in the next "Then" step
          // But if this is the last step, use a generic expected
          expected = 'Action is performed successfully'
        } else {
          // For "Given" steps
          expected = 'Precondition is met'
        }

        steps.push({ step, expected })
      })
    } else {
      // Split by newlines and treat each as a step
      // But be careful not to split on commas or parentheses within a step
      const lines = cleanText
        .split(/\n/)
        .map(l => l.trim())
        .filter(l => l && !l.match(/^(expected|result|should|debe)[:\s]/i))

      // Group lines that might be continuations of the same step
      const groupedLines = []
      let currentGroup = null

      lines.forEach((line, index) => {
        // Check if line starts with a Gherkin keyword
        const isGherkinStart = line.match(
          /^(Given|When|Then|And|But|Dado|Cuando|Entonces|Y|Pero)\s+/i
        )

        if (isGherkinStart) {
          // Save previous group if exists
          if (currentGroup) {
            groupedLines.push(currentGroup.join(' '))
          }
          // Start new group
          currentGroup = [line]
        } else if (currentGroup) {
          // This is a continuation of the current step
          currentGroup.push(line)
        } else {
          // Standalone line
          groupedLines.push(line)
        }
      })

      // Don't forget the last group
      if (currentGroup) {
        groupedLines.push(currentGroup.join(' '))
      }

      // Process grouped lines
      groupedLines.forEach((line, index) => {
        if (line) {
          // Clean up the line - remove any truncation artifacts
          let cleanLine = line.trim()
          cleanLine = cleanLine.replace(/\s*\([^)]*$/, '') // Remove incomplete parentheses
          cleanLine = cleanLine.replace(/\s*,\s*$/, '') // Remove trailing commas

          // Check if line contains expected result pattern
          const expectedPattern = /(?:expected|result|should|debe)[:\s]+(.+?)(?:\.|$)/i
          const expectedMatch = cleanLine.match(expectedPattern)

          if (expectedMatch) {
            const step = cleanLine.replace(expectedPattern, '').trim()
            const expected = expectedMatch[1].trim()
            if (step) {
              steps.push({ step, expected })
            }
          } else {
            steps.push({ step: cleanLine, expected: 'Step completes successfully' })
          }
        }
      })
    }
  }

  // Ensure at least one step
  if (steps.length === 0) {
    steps.push({ step: 'Execute the test case', expected: 'Test case completes successfully' })
  }

  return steps
}

function formatHTMLDescription(testCase) {
  const parts = []

  // Scenario
  if (testCase.scenario) {
    parts.push(`<p>Scenario: ${escapeHTML(testCase.scenario)}</p>`)
  }

  // Given/When/Then format
  if (testCase.given) {
    parts.push(`<p>Given ${escapeHTML(testCase.given)}</p>`)
  }
  if (testCase.when) {
    parts.push(`<p>When ${escapeHTML(testCase.when)}</p>`)
  }
  if (testCase.then) {
    parts.push(`<p>Then ${escapeHTML(testCase.then)}</p>`)
  }

  // Fallback to title if no structured description
  if (parts.length === 0) {
    parts.push(`<p>${escapeHTML(testCase.title)}</p>`)
  }

  return parts.join('')
}

function formatHTMLText(text) {
  if (!text) return ''
  const escaped = escapeHTML(text)
  // Replace line breaks with <br />
  const withBreaks = escaped.replace(/\n/g, '<br />')
  return `<p>${withBreaks}</p>`
}

function escapeHTML(text) {
  if (!text) return ''
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

function generateTestMOTags(testCase) {
  const tags = []

  // Primary tags based on test type
  if (testCase.type) {
    const typeLower = testCase.type.toLowerCase()
    if (typeLower.includes('visual') || typeLower.includes('ui')) {
      tags.push('visual')
    }
    if (typeLower.includes('functional') || typeLower.includes('functionality')) {
      tags.push('functionality')
    }
    if (typeLower.includes('structure')) {
      tags.push('structure')
    }
    if (typeLower.includes('responsive')) {
      tags.push('responsive')
    }
    if (typeLower.includes('accessibility')) {
      tags.push('accessibility')
    }
    if (typeLower.includes('performance')) {
      tags.push('performance')
    }
    if (typeLower.includes('navigation')) {
      tags.push('navigation')
    }
  }

  // Component tags
  const titleLower = (testCase.title || '').toLowerCase()
  if (titleLower.includes('hero') || titleLower.includes('banner')) {
    tags.push('hero-banner')
  }
  if (titleLower.includes('card')) {
    tags.push('cards')
  }
  if (titleLower.includes('form')) {
    tags.push('forms')
  }
  if (titleLower.includes('button') || titleLower.includes('cta')) {
    tags.push('buttons')
  }

  // Always add e2e tag
  tags.push('e2e')

  return tags.join(',')
}

function mapPriority(priority) {
  const priorityMap = {
    high: 'High',
    medium: 'Normal',
    low: 'Low',
    critical: 'High',
    normal: 'Normal'
  }
  return priorityMap[priority.toLowerCase()] || 'Normal'
}
