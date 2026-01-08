/**
 * Format bug report in different formats (Jira, Markdown, Plain)
 * @param {Object} bugData - Bug data object
 * @param {Array} evidenceFiles - Array of evidence files
 * @param {string} format - Format type: 'jira', 'markdown', or 'plain'
 * @returns {string} Formatted bug report
 */
export function formatBugReport(bugData, evidenceFiles = [], format = 'jira') {
  const {
    title,
    description,
    priority,
    severity,
    stepsToReproduce,
    expectedResult,
    actualResult,
    environment,
    browser,
    operatingSystem,
    version,
    additionalInfo
  } = bugData

  const evidenceList = evidenceFiles.length > 0
    ? evidenceFiles.map((file, index) => `${index + 1}. ${file.name}`).join('\n')
    : 'No evidence files attached'

  switch (format) {
    case 'jira':
      return formatJira(bugData, evidenceList)
    case 'markdown':
      return formatMarkdown(bugData, evidenceList)
    case 'plain':
      return formatPlain(bugData, evidenceList)
    default:
      return formatJira(bugData, evidenceList)
  }
}

/**
 * Clean HTML tags and convert to plain text for Jira
 * Removes HTML tags and converts heading tags to Jira format if needed
 */
function cleanTextForJira(text) {
  if (!text) return ''
  
  // Convert HTML heading tags to Jira format first
  let cleaned = text
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, 'h1. $1')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, 'h2. $1')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, 'h3. $1')
    .replace(/<h4[^>]*>(.*?)<\/h4>/gi, 'h4. $1')
    .replace(/<h5[^>]*>(.*?)<\/h5>/gi, 'h5. $1')
    .replace(/<h6[^>]*>(.*?)<\/h6>/gi, 'h6. $1')
  
  // Remove all remaining HTML tags
  cleaned = cleaned.replace(/<[^>]+>/g, '')
  
  // Decode common HTML entities
  const entityMap = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&nbsp;': ' ',
    '&apos;': "'"
  }
  cleaned = cleaned.replace(/&[#\w]+;/g, (entity) => {
    return entityMap[entity] || entity
  })
  
  // Clean up extra whitespace
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim()
  
  return cleaned
}

/**
 * Format bug report for Jira
 */
function formatJira(bugData, evidenceList) {
  const {
    title,
    description,
    priority,
    severity,
    stepsToReproduce,
    expectedResult,
    actualResult,
    environment,
    browser,
    operatingSystem,
    version,
    additionalInfo
  } = bugData

  // Clean title and all text fields
  const cleanTitle = cleanTextForJira(title)
  const cleanDescription = cleanTextForJira(description)
  const cleanSteps = cleanTextForJira(stepsToReproduce)
  const cleanExpected = cleanTextForJira(expectedResult)
  const cleanActual = cleanTextForJira(actualResult)
  const cleanAdditional = cleanTextForJira(additionalInfo)

  let report = `h2. ${cleanTitle}\n\n`
  
  report += `*Priority:* ${priority}\n`
  report += `*Severity:* ${severity}\n\n`
  
  if (environment) report += `*Environment:* ${environment}\n`
  if (browser) report += `*Browser:* ${browser}\n`
  if (operatingSystem) report += `*Operating System:* ${operatingSystem}\n`
  if (version) report += `*Version:* ${version}\n`
  report += '\n'
  
  report += `h3. Description\n${cleanDescription}\n\n`
  
  if (cleanSteps) {
    report += `h3. Steps to Reproduce\n${cleanSteps}\n\n`
  }
  
  if (cleanExpected) {
    report += `h3. Expected Result\n${cleanExpected}\n\n`
  }
  
  if (cleanActual) {
    report += `h3. Actual Result\n${cleanActual}\n\n`
  }
  
  if (evidenceList && evidenceList !== 'No evidence files attached') {
    report += `h3. Evidence\n${evidenceList}\n\n`
  }
  
  if (cleanAdditional) {
    report += `h3. Additional Information\n${cleanAdditional}\n`
  }
  
  return report.trim()
}

/**
 * Format bug report in Markdown
 */
function formatMarkdown(bugData, evidenceList) {
  const {
    title,
    description,
    priority,
    severity,
    stepsToReproduce,
    expectedResult,
    actualResult,
    environment,
    browser,
    operatingSystem,
    version,
    additionalInfo
  } = bugData

  let report = `# ${title}\n\n`
  
  report += `**Priority:** ${priority}  \n`
  report += `**Severity:** ${severity}\n\n`
  
  if (environment) report += `**Environment:** ${environment}  \n`
  if (browser) report += `**Browser:** ${browser}  \n`
  if (operatingSystem) report += `**Operating System:** ${operatingSystem}  \n`
  if (version) report += `**Version:** ${version}\n\n`
  
  report += `## Description\n\n${description}\n\n`
  
  if (stepsToReproduce) {
    report += `## Steps to Reproduce\n\n${stepsToReproduce}\n\n`
  }
  
  if (expectedResult) {
    report += `## Expected Result\n\n${expectedResult}\n\n`
  }
  
  if (actualResult) {
    report += `## Actual Result\n\n${actualResult}\n\n`
  }
  
  if (evidenceList && evidenceList !== 'No evidence files attached') {
    report += `## Evidence\n\n${evidenceList}\n\n`
  }
  
  if (additionalInfo) {
    report += `## Additional Information\n\n${additionalInfo}\n`
  }
  
  return report.trim()
}

/**
 * Format bug report in plain text
 */
function formatPlain(bugData, evidenceList) {
  const {
    title,
    description,
    priority,
    severity,
    stepsToReproduce,
    expectedResult,
    actualResult,
    environment,
    browser,
    operatingSystem,
    version,
    additionalInfo
  } = bugData

  let report = `${title}\n`
  report += '='.repeat(title.length) + '\n\n'
  
  report += `Priority: ${priority}\n`
  report += `Severity: ${severity}\n\n`
  
  if (environment) report += `Environment: ${environment}\n`
  if (browser) report += `Browser: ${browser}\n`
  if (operatingSystem) report += `Operating System: ${operatingSystem}\n`
  if (version) report += `Version: ${version}\n`
  report += '\n'
  
  report += `DESCRIPTION\n${'-'.repeat(11)}\n${description}\n\n`
  
  if (stepsToReproduce) {
    report += `STEPS TO REPRODUCE\n${'-'.repeat(18)}\n${stepsToReproduce}\n\n`
  }
  
  if (expectedResult) {
    report += `EXPECTED RESULT\n${'-'.repeat(15)}\n${expectedResult}\n\n`
  }
  
  if (actualResult) {
    report += `ACTUAL RESULT\n${'-'.repeat(13)}\n${actualResult}\n\n`
  }
  
  if (evidenceList && evidenceList !== 'No evidence files attached') {
    report += `EVIDENCE\n${'-'.repeat(8)}\n${evidenceList}\n\n`
  }
  
  if (additionalInfo) {
    report += `ADDITIONAL INFORMATION\n${'-'.repeat(22)}\n${additionalInfo}\n`
  }
  
  return report.trim()
}

