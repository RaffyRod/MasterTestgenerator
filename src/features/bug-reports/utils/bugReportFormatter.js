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
 * @param {string} text - Text to clean
 * @param {boolean} removeHeadings - If true, removes heading tags instead of converting them (for titles)
 */
function cleanTextForJira(text, removeHeadings = false) {
  if (!text) return ''
  
  let cleaned = text
  
  if (removeHeadings) {
    // For titles, remove heading tags completely (just extract the text)
    cleaned = cleaned
      .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, '$1')
      // Remove Jira heading format if already present (at start or anywhere)
      .replace(/^h[1-6]\.\s*/gi, '')
      .replace(/\s*h[1-6]\.\s*/gi, ' ')
      // Remove any remaining heading markers
      .replace(/^(h[1-6]\.\s*)+/gi, '')
  } else {
    // For content, convert HTML heading tags to Jira format
    cleaned = cleaned
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, 'h1. $1')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, 'h2. $1')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, 'h3. $1')
      .replace(/<h4[^>]*>(.*?)<\/h4>/gi, 'h4. $1')
      .replace(/<h5[^>]*>(.*?)<\/h5>/gi, 'h5. $1')
      .replace(/<h6[^>]*>(.*?)<\/h6>/gi, 'h6. $1')
  }
  
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
  
  // Remove Jira heading format if it appears in the middle of text (should only be at start of line)
  if (!removeHeadings) {
    // Only remove h2., h3. etc if they're not at the start of a line
    cleaned = cleaned.replace(/([^\n])h([1-6])\.\s+/g, '$1')
  }
  
  // Clean up extra whitespace
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim()
  
  return cleaned
}

/**
 * Format bug report for Jira with improved formatting
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

  // Clean title (remove headings completely) and all text fields
  // Also fix common typos and spacing issues in title
  let cleanTitle = cleanTextForJira(title, true) // Remove headings from title
  
  // Fix common spacing issues and typos
  cleanTitle = cleanTitle.replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between lowercase and uppercase
  cleanTitle = cleanTitle.replace(/\boage\b/gi, 'page') // Fix "oage" -> "page"
  cleanTitle = cleanTitle.replace(/(page)(is|was|are|were)/gi, '$1 $2') // Fix "pageis" -> "page is"
  cleanTitle = cleanTitle.replace(/(properl)(y|ies)/gi, 'properly') // Fix "properl" -> "properly"
  cleanTitle = cleanTitle.replace(/(loadin)(g)/gi, 'loading') // Fix "loadin" -> "loading"
  cleanTitle = cleanTitle.replace(/(displaye)(d)/gi, 'displayed') // Fix "displaye" -> "displayed"
  cleanTitle = cleanTitle.replace(/(workin)(g)/gi, 'working') // Fix "workin" -> "working"
  cleanTitle = cleanTitle.replace(/\s+/g, ' ') // Normalize multiple spaces
  cleanTitle = cleanTitle.trim()
  
  const cleanDescription = cleanTextForJira(description)
  const cleanSteps = cleanTextForJira(stepsToReproduce)
  const cleanExpected = cleanTextForJira(expectedResult)
  const cleanActual = cleanTextForJira(actualResult)
  const cleanAdditional = cleanTextForJira(additionalInfo)

  // Format steps as numbered list for Jira
  const formatSteps = (steps) => {
    if (!steps) return ''
    
    // Split by newlines and process each line
    const lines = steps.split('\n').filter(line => line.trim())
    
    if (lines.length === 0) return ''
    
    // Convert each line to Jira numbered list format
    return lines.map(line => {
      // Remove existing numbering (1., 2., etc.) and clean the line
      let cleaned = line.replace(/^\d+\.\s*/, '').trim()
      
      // Remove any leading dashes or bullets
      cleaned = cleaned.replace(/^[-*•]\s*/, '').trim()
      
      // Jira numbered list format: # at the start of line (must be at column 0)
      // Each step must be on its own line with # prefix
      return `# ${cleaned}`
    }).join('\n')
  }

  // Format code/error messages
  const formatCodeBlock = (text) => {
    if (!text) return ''
    // Detect if text contains code-like patterns (errors, URLs, code snippets)
    const codePatterns = [
      /TypeError|ReferenceError|SyntaxError|Error:/i,
      /https?:\/\/[^\s]+/,
      /[a-z]+\/[a-z0-9\/\-_]+/i, // URLs like squad/1
      /console\.(log|error|warn)/i
    ]
    
    const hasCodePattern = codePatterns.some(pattern => pattern.test(text))
    
    if (hasCodePattern) {
      // Wrap code-like content in code blocks
      return `{code}${text}{code}`
    }
    return text
  }

  // Build metadata panel - no bold for metadata fields, only section headers
  let metadata = []
  metadata.push(`Priority: ${priority}`)
  metadata.push(`Severity: ${severity}`)
  if (environment) metadata.push(`Environment: ${environment}`)
  if (browser) metadata.push(`Browser: ${browser}`)
  if (operatingSystem) metadata.push(`Operating System: ${operatingSystem}`)
  if (version) metadata.push(`Version: ${version}`)

  // Start building the report
  let report = `${cleanTitle}\n\n`
  
  // Metadata in a simple panel (simplified syntax for better Jira compatibility)
  report += `{panel:title=Issue Details}\n`
  report += metadata.join('\n')
  report += `\n{panel}\n\n`
  
  // Description section - using bold text instead of heading
  report += `*Description:*\n\n`
  report += `${formatCodeBlock(cleanDescription)}\n\n`
  
  // Steps to Reproduce in a panel
  if (cleanSteps && cleanSteps.trim()) {
    report += `*Steps to Reproduce:*\n\n`
    report += `{panel:title=Reproduction Steps|borderStyle=solid|borderColor=#0052CC|titleBGColor=#E3FCEF|bgColor=#FAFBFC}\n`
    
    // Always format steps as numbered list
    const lines = cleanSteps.split('\n').filter(line => line.trim())
    if (lines.length > 0) {
      const formattedSteps = lines.map(line => {
        // Remove existing numbering (1., 2., etc.) and clean the line
        let cleaned = line.replace(/^\d+\.\s*/, '').trim()
        // Remove any leading dashes or bullets
        cleaned = cleaned.replace(/^[-*•]\s*/, '').trim()
        // Jira numbered list format: # at the start of line
        return `# ${cleaned}`
      }).join('\n')
      report += `${formattedSteps}\n`
    } else {
      // Fallback if no steps found
      report += `# Navigate to the application\n# Perform the action described\n# Observe the issue\n`
    }
    
    report += `{panel}\n\n`
  }
  
  // Expected vs Actual in a comparison panel
  if (cleanExpected || cleanActual) {
    report += `*Expected vs Actual Result:*\n\n`
    
    if (cleanExpected) {
      report += `*Expected Result:*\n`
      report += `{panel:borderStyle=solid|borderColor=#36B37E|titleBGColor=#E3FCEF|bgColor=#FAFBFC}\n`
      report += `${cleanExpected}\n`
      report += `{panel}\n\n`
    }
    
    if (cleanActual) {
      report += `*Actual Result:*\n`
      report += `{panel:borderStyle=solid|borderColor=#DE350B|titleBGColor=#FFEBE6|bgColor=#FAFBFC}\n`
      report += `${formatCodeBlock(cleanActual)}\n`
      report += `{panel}\n\n`
    }
  }
  
  // Evidence section
  if (evidenceList && evidenceList !== 'No evidence files attached') {
    report += `*Evidence:*\n\n`
    report += `{panel:title=Attachments|borderStyle=solid|borderColor=#ccc|titleBGColor=#f4f5f7|bgColor=#ffffff}\n`
    report += `${evidenceList}\n`
    report += `{panel}\n\n`
  }
  
  // Additional Information
  if (cleanAdditional) {
    report += `*Additional Information:*\n\n`
    report += `{panel:borderStyle=solid|borderColor=#ccc|bgColor=#FAFBFC}\n`
    report += `${cleanAdditional}\n`
    report += `{panel}\n`
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

